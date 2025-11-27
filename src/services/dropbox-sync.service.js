const fs = require('fs').promises;
const path = require('path');
const dropboxService = require('./dropbox.service');

class DropboxSyncService {
  constructor() {
    this.dropboxBasePath = '/ConnectingPrion/priocohort';
    this.databasesPath = `${this.dropboxBasePath}/databases`;
    this.signedCIPath = `${this.dropboxBasePath}/Signed CI`;
    this.localDataPath = path.join(__dirname, '../../data');

    // CSV files to sync
    this.csvFiles = ['dni.csv', 'txpr.csv'];
  }

  /**
   * Ensure local data directory exists
   */
  async ensureLocalDirectory() {
    try {
      await fs.access(this.localDataPath);
    } catch {
      await fs.mkdir(this.localDataPath, { recursive: true });
      console.log(`📁 Created local data directory: ${this.localDataPath}`);
    }
  }

  /**
   * Sync a single CSV file from Dropbox to local storage
   * @param {string} filename - CSV filename (e.g., 'dni.csv')
   */
  async syncCSVFile(filename) {
    if (!dropboxService.isConfigured()) {
      console.log(`⚠️  Dropbox not configured. Skipping sync for ${filename}`);
      return false;
    }

    const dropboxPath = `${this.databasesPath}/${filename}`;
    const localPath = path.join(this.localDataPath, filename);

    try {
      console.log(`⬇️  Syncing ${filename} from Dropbox...`);

      const fileBuffer = await dropboxService.downloadFile(dropboxPath);
      await fs.writeFile(localPath, fileBuffer);

      console.log(`✅ Successfully synced ${filename} (${fileBuffer.length} bytes)`);
      return true;
    } catch (error) {
      console.error(`❌ Error syncing ${filename}:`, error.message);

      // Check if local file exists as fallback
      try {
        await fs.access(localPath);
        console.log(`ℹ️  Using existing local copy of ${filename}`);
        return false;
      } catch {
        console.error(`❌ No local fallback available for ${filename}`);
        throw new Error(`Failed to sync ${filename} and no local copy exists`);
      }
    }
  }

  /**
   * Sync all CSV files from Dropbox
   * @returns {Promise<Object>} Sync results summary
   */
  async syncAllCSVFiles() {
    if (!dropboxService.isConfigured()) {
      console.log('⚠️  Dropbox not configured. Using local CSV files only.');
      return {
        success: false,
        message: 'Dropbox not configured',
        synced: [],
        failed: []
      };
    }

    await this.ensureLocalDirectory();

    const results = {
      success: true,
      synced: [],
      failed: [],
      timestamp: new Date().toISOString()
    };

    console.log('\n🔄 Starting CSV synchronization from Dropbox...\n');

    for (const filename of this.csvFiles) {
      try {
        const synced = await this.syncCSVFile(filename);
        if (synced) {
          results.synced.push(filename);
        }
      } catch (error) {
        results.failed.push({ filename, error: error.message });
        results.success = false;
      }
    }

    console.log('\n📊 Sync Summary:');
    console.log(`   ✅ Synced: ${results.synced.length} files`);
    console.log(`   ❌ Failed: ${results.failed.length} files`);

    if (results.synced.length > 0) {
      console.log(`   Files synced: ${results.synced.join(', ')}`);
    }

    if (results.failed.length > 0) {
      console.log(`   Files failed: ${results.failed.map(f => f.filename).join(', ')}`);
    }

    console.log('');

    return results;
  }

  /**
   * Upload signed consent PDF to Dropbox
   * @param {string} dni - Patient DNI
   * @param {Buffer} pdfBuffer - PDF file buffer
   * @param {Object} metadata - Additional metadata
   */
  async uploadSignedConsent(dni, pdfBuffer, metadata = {}) {
    if (!dropboxService.isConfigured()) {
      console.log('⚠️  Dropbox not configured. Signed consent not uploaded to cloud.');
      return {
        success: false,
        message: 'Dropbox not configured'
      };
    }

    try {
      // Ensure Signed CI folder exists
      await this.ensureSignedCIFolder();

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `consent_${dni}_${timestamp}.pdf`;
      const dropboxPath = `${this.signedCIPath}/${filename}`;

      console.log(`⬆️  Uploading signed consent to Dropbox: ${filename}`);

      await dropboxService.uploadFile(dropboxPath, pdfBuffer, 'add');

      console.log(`✅ Signed consent uploaded successfully: ${filename}`);

      return {
        success: true,
        filename,
        path: dropboxPath,
        uploadedAt: new Date().toISOString(),
        metadata
      };
    } catch (error) {
      console.error('❌ Error uploading signed consent:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Ensure the Signed CI folder exists in Dropbox
   */
  async ensureSignedCIFolder() {
    try {
      await dropboxService.createFolder(this.signedCIPath);
    } catch (error) {
      // Folder might already exist, which is fine
      console.log(`ℹ️  Signed CI folder check: ${error.message}`);
    }
  }

  /**
   * List all signed consents in Dropbox
   */
  async listSignedConsents() {
    if (!dropboxService.isConfigured()) {
      return {
        success: false,
        message: 'Dropbox not configured',
        files: []
      };
    }

    try {
      const files = await dropboxService.listFiles(this.signedCIPath);

      const pdfFiles = files
        .filter(file => file['.tag'] === 'file' && file.name.endsWith('.pdf'))
        .map(file => ({
          name: file.name,
          path: file.path_display,
          size: file.size,
          modified: file.client_modified,
          id: file.id
        }));

      return {
        success: true,
        count: pdfFiles.length,
        files: pdfFiles
      };
    } catch (error) {
      console.error('❌ Error listing signed consents:', error.message);
      return {
        success: false,
        error: error.message,
        files: []
      };
    }
  }

  /**
   * Download a signed consent from Dropbox
   * @param {string} filename - Consent filename
   */
  async downloadSignedConsent(filename) {
    if (!dropboxService.isConfigured()) {
      throw new Error('Dropbox not configured');
    }

    try {
      const dropboxPath = `${this.signedCIPath}/${filename}`;
      const pdfBuffer = await dropboxService.downloadFile(dropboxPath);

      return {
        success: true,
        buffer: pdfBuffer,
        filename
      };
    } catch (error) {
      console.error(`❌ Error downloading consent ${filename}:`, error.message);
      throw error;
    }
  }

  /**
   * Delete a signed consent from Dropbox
   * @param {string} filename - Consent filename
   */
  async deleteSignedConsent(filename) {
    if (!dropboxService.isConfigured()) {
      throw new Error('Dropbox not configured');
    }

    try {
      const dropboxPath = `${this.signedCIPath}/${filename}`;
      await dropboxService.deleteFile(dropboxPath);

      return {
        success: true,
        message: `Consent ${filename} deleted successfully`
      };
    } catch (error) {
      console.error(`❌ Error deleting consent ${filename}:`, error.message);
      throw error;
    }
  }

  /**
   * Check sync status
   */
  async getSyncStatus() {
    const status = {
      dropboxConfigured: dropboxService.isConfigured(),
      localDataPath: this.localDataPath,
      dropboxBasePath: this.dropboxBasePath,
      csvFiles: []
    };

    for (const filename of this.csvFiles) {
      const localPath = path.join(this.localDataPath, filename);

      try {
        const stats = await fs.stat(localPath);
        status.csvFiles.push({
          filename,
          exists: true,
          size: stats.size,
          modified: stats.mtime
        });
      } catch {
        status.csvFiles.push({
          filename,
          exists: false
        });
      }
    }

    return status;
  }
}

// Export singleton instance
module.exports = new DropboxSyncService();
