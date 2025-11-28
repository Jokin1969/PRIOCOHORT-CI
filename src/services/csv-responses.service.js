const { Dropbox } = require('dropbox');
const fetch = require('node-fetch');

/**
 * Servicio para gestionar las respuestas del consentimiento informado en CSV
 * y sincronizarlas con Dropbox
 */
class CSVResponsesService {
  constructor() {
    this.dropboxPath = '/ConnectingPrion/priocohort/responses/CI_responses.csv';
    this.dbx = null;
    this.isInitialized = false;
    this.initializeDropbox();
  }

  /**
   * Inicializar cliente de Dropbox
   */
  initializeDropbox() {
    try {
      console.log('📊 Initializing CSV Responses service...');

      if (!process.env.DROPBOX_REFRESH_TOKEN || !process.env.DROPBOX_CLIENT_ID) {
        console.log('⚠️  CSV Responses: Dropbox credentials not configured. CSV sync will be disabled.');
        console.log('   Missing:');
        if (!process.env.DROPBOX_REFRESH_TOKEN) console.log('   - DROPBOX_REFRESH_TOKEN');
        if (!process.env.DROPBOX_CLIENT_ID) console.log('   - DROPBOX_CLIENT_ID');
        if (!process.env.DROPBOX_CLIENT_SECRET) console.log('   - DROPBOX_CLIENT_SECRET');
        this.isInitialized = false;
        return;
      }

      console.log('📊 Creating Dropbox client for CSV service...');
      this.dbx = new Dropbox({
        fetch,
        clientId: process.env.DROPBOX_CLIENT_ID,
        clientSecret: process.env.DROPBOX_CLIENT_SECRET,
        refreshToken: process.env.DROPBOX_REFRESH_TOKEN
      });

      this.isInitialized = true;
      console.log('✅ CSV Responses service initialized');
      console.log(`   Target path: ${this.dropboxPath}`);
    } catch (error) {
      console.error('❌ Error initializing CSV Responses service:', error.message);
      console.error('   Stack trace:', error.stack);
      this.isInitialized = false;
    }
  }

  /**
   * Definir las columnas del CSV
   */
  getCSVHeaders() {
    return [
      'codigo_verificacion',
      'leido_hoja_informacion',
      'recibido_informacion',
      'comprendo',
      'consentimiento_uso_muestras',
      'consentimiento_participacion',
      'info_estado_genetico',
      'info_biomarcadores',
      'incorporacion_biobanco',
      'tipo_donacion',
      'uso_autorizado',
      'destruccion_excedente'
    ];
  }

  /**
   * Convertir datos de consentimiento a fila CSV
   */
  consentDataToCSVRow(consentData) {
    const boolToText = (value) => value ? 'SI' : 'NO';

    return [
      consentData.txprCode || '',
      boolToText(consentData.consent?.readInformationSheet),
      boolToText(consentData.consent?.receivedInformation),
      boolToText(consentData.consent?.understand),
      boolToText(consentData.consent?.mainConsent1),
      boolToText(consentData.consent?.mainConsent2),
      consentData.decisions?.geneticInfo === 'si-solicito' ? 'SI-SOLICITO' : 'NO-QUIERO',
      consentData.decisions?.biomarkers === 'si-solicito' ? 'SI-SOLICITO' : 'NO-QUIERO',
      boolToText(consentData.biobank?.incorporation),
      consentData.biobank?.donationType === 'codificadas' ? 'CODIFICADAS' : 'ANONIMIZADAS',
      consentData.biobank?.authorizedUse === 'solo-prion' ? 'SOLO-PRION' : 'CUALQUIER',
      boolToText(consentData.biobank?.destruction)
    ];
  }

  /**
   * Convertir array a línea CSV (con escape de comillas)
   */
  arrayToCSVLine(array) {
    return array.map(value => {
      // Escapar comillas y envolver en comillas si contiene comas o comillas
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  }

  /**
   * Parsear CSV a array de líneas
   */
  parseCSV(csvContent) {
    return csvContent.trim().split('\n');
  }

  /**
   * Descargar CSV desde Dropbox
   */
  async downloadCSV() {
    if (!this.isInitialized) {
      return null;
    }

    try {
      const response = await this.dbx.filesDownload({ path: this.dropboxPath });
      const csvContent = response.result.fileBinary.toString('utf-8');
      return csvContent;
    } catch (error) {
      if (error.status === 409) {
        // Archivo no existe, retornar null
        console.log('📝 CSV file does not exist yet, will create new one');
        return null;
      }
      throw error;
    }
  }

  /**
   * Subir CSV a Dropbox
   */
  async uploadCSV(csvContent) {
    if (!this.isInitialized) {
      throw new Error('CSV Responses service not initialized');
    }

    try {
      await this.dbx.filesUpload({
        path: this.dropboxPath,
        contents: csvContent,
        mode: 'overwrite',
        autorename: false
      });

      console.log(`✅ CSV uploaded successfully to ${this.dropboxPath}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Error uploading CSV to Dropbox:', error.message);
      throw error;
    }
  }

  /**
   * Añadir respuesta de consentimiento al CSV
   */
  async addConsentResponse(consentData) {
    if (!this.isInitialized) {
      console.log('⚠️  CSV Responses service not initialized. Skipping CSV update.');
      return { success: false, message: 'Service not initialized' };
    }

    try {
      console.log(`📊 Adding consent response to CSV: ${consentData.txprCode}`);

      // Descargar CSV existente (si existe)
      let csvContent = await this.downloadCSV();
      let lines = [];

      if (csvContent) {
        lines = this.parseCSV(csvContent);
      } else {
        // Crear nuevo CSV con cabeceras
        const headers = this.getCSVHeaders();
        lines = [this.arrayToCSVLine(headers)];
      }

      // Añadir nueva fila
      const newRow = this.consentDataToCSVRow(consentData);
      lines.push(this.arrayToCSVLine(newRow));

      // Crear contenido CSV completo
      const updatedCSV = lines.join('\n') + '\n';

      // Subir a Dropbox
      await this.uploadCSV(updatedCSV);

      console.log(`✅ Consent response added to CSV: ${consentData.txprCode}`);
      return {
        success: true,
        message: 'Response added to CSV',
        txprCode: consentData.txprCode
      };
    } catch (error) {
      console.error('❌ Error adding consent response to CSV:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verificar si el servicio está configurado
   */
  isConfigured() {
    return this.isInitialized;
  }
}

// Export singleton instance
module.exports = new CSVResponsesService();
