const { Dropbox } = require('dropbox');
const fetch = require('node-fetch');

class DropboxService {
  constructor() {
    this.accessToken = process.env.DROPBOX_ACCESS_TOKEN;
    this.refreshToken = process.env.DROPBOX_REFRESH_TOKEN;
    // Soportar tanto CLIENT_ID como APP_KEY (Dropbox usa ambas nomenclaturas)
    this.clientId = process.env.DROPBOX_CLIENT_ID || process.env.DROPBOX_APP_KEY;
    this.clientSecret = process.env.DROPBOX_CLIENT_SECRET || process.env.DROPBOX_APP_SECRET;
    this.tokenExpiresAt = null;
    this.dbx = null;

    this.initialize();
  }

  /**
   * Initialize Dropbox client
   */
  initialize() {
    // Debug: Log credential status (without exposing full values)
    console.log('🔍 Dropbox credentials check:');
    console.log(`   - REFRESH_TOKEN: ${this.refreshToken ? `${this.refreshToken.substring(0, 10)}...` : 'NOT SET'}`);
    console.log(`   - CLIENT_ID: ${this.clientId ? `${this.clientId.substring(0, 10)}...` : 'NOT SET'}`);
    console.log(`   - CLIENT_SECRET: ${this.clientSecret ? 'SET' : 'NOT SET'}`);

    if (!this.accessToken && !this.refreshToken) {
      console.warn('⚠️  Dropbox credentials not configured. Dropbox sync will be disabled.');
      return;
    }

    this.dbx = new Dropbox({
      accessToken: this.accessToken,
      fetch: fetch
    });

    console.log('✅ Dropbox service initialized');
  }

  /**
   * Check if Dropbox is configured
   */
  isConfigured() {
    return this.dbx !== null;
  }

  /**
   * Refresh the access token using refresh token
   */
  async refreshAccessToken() {
    if (!this.refreshToken || !this.clientId || !this.clientSecret) {
      throw new Error('Refresh token or client credentials not configured');
    }

    try {
      const response = await fetch('https://api.dropbox.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiresAt = Date.now() + (data.expires_in * 1000);

      // Reinitialize Dropbox client with new token
      this.dbx = new Dropbox({
        accessToken: this.accessToken,
        fetch: fetch
      });

      console.log('✅ Dropbox access token refreshed successfully');
      return this.accessToken;
    } catch (error) {
      console.error('❌ Error refreshing Dropbox token:', error);
      throw error;
    }
  }

  /**
   * Check if token needs refresh and refresh if necessary
   */
  async ensureValidToken() {
    if (!this.refreshToken) {
      return; // Using static access token
    }

    // Refresh if we don't have an access token yet
    if (!this.accessToken) {
      console.log('🔄 No access token found, generating from refresh token...');
      await this.refreshAccessToken();
      return;
    }

    // Refresh if token expires in less than 5 minutes
    if (this.tokenExpiresAt && (Date.now() + 5 * 60 * 1000) >= this.tokenExpiresAt) {
      await this.refreshAccessToken();
    }
  }

  /**
   * Download a file from Dropbox
   * @param {string} path - Path in Dropbox (e.g., '/databases/dni.csv')
   * @returns {Promise<Buffer>} File contents as Buffer
   */
  async downloadFile(path) {
    if (!this.isConfigured()) {
      throw new Error('Dropbox is not configured');
    }

    try {
      await this.ensureValidToken();

      const response = await this.dbx.filesDownload({ path });

      if (response.result && response.result.fileBinary) {
        return Buffer.from(response.result.fileBinary);
      }

      throw new Error('No file content received from Dropbox');
    } catch (error) {
      console.error(`❌ Error downloading file ${path}:`, error.error || error.message);
      throw error;
    }
  }

  /**
   * Upload a file to Dropbox
   * @param {string} path - Path in Dropbox (e.g., '/Signed CI/consent_12345678A.pdf')
   * @param {Buffer} contents - File contents as Buffer
   * @param {string} mode - Write mode ('add', 'overwrite', 'update')
   */
  async uploadFile(path, contents, mode = 'add') {
    if (!this.isConfigured()) {
      throw new Error('Dropbox is not configured');
    }

    try {
      await this.ensureValidToken();

      // Convert string mode to Dropbox API format
      const writeMode = mode === 'overwrite'
        ? { '.tag': 'overwrite' }
        : { '.tag': 'add' };

      const response = await this.dbx.filesUpload({
        path,
        contents,
        mode: writeMode,
        autorename: false,
        mute: false,
        strict_conflict: false
      });

      console.log(`✅ File uploaded to Dropbox: ${path}`);
      return response.result;
    } catch (error) {
      console.error(`❌ Error uploading file ${path}:`, error.error || error.message);
      throw error;
    }
  }

  /**
   * List files in a Dropbox folder
   * @param {string} path - Folder path in Dropbox
   * @returns {Promise<Array>} List of file metadata
   */
  async listFiles(path) {
    if (!this.isConfigured()) {
      throw new Error('Dropbox is not configured');
    }

    try {
      await this.ensureValidToken();

      const response = await this.dbx.filesListFolder({ path });
      return response.result.entries;
    } catch (error) {
      console.error(`❌ Error listing files in ${path}:`, error.error || error.message);
      throw error;
    }
  }

  /**
   * Check if a file exists in Dropbox
   * @param {string} path - File path in Dropbox
   * @returns {Promise<boolean>}
   */
  async fileExists(path) {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      await this.ensureValidToken();
      await this.dbx.filesGetMetadata({ path });
      return true;
    } catch (error) {
      if (error.status === 409) {
        return false; // File not found
      }
      throw error;
    }
  }

  /**
   * Delete a file from Dropbox
   * @param {string} path - File path in Dropbox
   */
  async deleteFile(path) {
    if (!this.isConfigured()) {
      throw new Error('Dropbox is not configured');
    }

    try {
      await this.ensureValidToken();

      await this.dbx.filesDeleteV2({ path });
      console.log(`✅ File deleted from Dropbox: ${path}`);
      return true;
    } catch (error) {
      console.error(`❌ Error deleting file ${path}:`, error.error || error.message);
      throw error;
    }
  }

  /**
   * Get a temporary link to download a file
   * @param {string} path - File path in Dropbox
   * @returns {Promise<string>} Temporary download link
   */
  async getTemporaryLink(path) {
    if (!this.isConfigured()) {
      throw new Error('Dropbox is not configured');
    }

    try {
      await this.ensureValidToken();

      const response = await this.dbx.filesGetTemporaryLink({ path });
      return response.result.link;
    } catch (error) {
      console.error(`❌ Error getting temporary link for ${path}:`, error.error || error.message);
      throw error;
    }
  }

  /**
   * Create a folder in Dropbox
   * @param {string} path - Folder path to create
   */
  async createFolder(path) {
    if (!this.isConfigured()) {
      throw new Error('Dropbox is not configured');
    }

    try {
      await this.ensureValidToken();

      await this.dbx.filesCreateFolderV2({
        path,
        autorename: false
      });

      console.log(`✅ Folder created in Dropbox: ${path}`);
      return true;
    } catch (error) {
      // Ignore error if folder already exists
      if (error.status === 409 && error.error?.error?.['.tag'] === 'path') {
        if (error.error.error.path?.['.tag'] === 'conflict') {
          console.log(`ℹ️  Folder already exists: ${path}`);
          return true;
        }
      }
      console.error(`❌ Error creating folder ${path}:`, error.error || error.message);
      throw error;
    }
  }

  /**
   * Get file metadata
   * @param {string} path - File path in Dropbox
   */
  async getMetadata(path) {
    if (!this.isConfigured()) {
      throw new Error('Dropbox is not configured');
    }

    try {
      await this.ensureValidToken();

      const response = await this.dbx.filesGetMetadata({ path });
      return response.result;
    } catch (error) {
      console.error(`❌ Error getting metadata for ${path}:`, error.error || error.message);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new DropboxService();
