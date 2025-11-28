const dropboxService = require('./dropbox.service');

/**
 * Servicio para gestionar las respuestas del consentimiento informado en CSV
 * y sincronizarlas con Dropbox
 */
class CSVResponsesService {
  constructor() {
    this.dropboxPath = '/ConnectingPrion/priocohort/responses/CI_responses.csv';
    this.dropboxService = dropboxService;
    console.log('📊 CSV Responses service initialized');
    console.log(`   Target path: ${this.dropboxPath}`);
    console.log(`   Using shared Dropbox service: ${this.isConfigured() ? '✅ Ready' : '❌ Not configured'}`);
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

    // Si se solicita destrucción, tipo_donacion y uso_autorizado son ND
    const destructionRequested = consentData.biobank?.destruction === true;

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
      destructionRequested ? 'ND' : (consentData.biobank?.donationType === 'codificadas' ? 'CODIFICADAS' : 'ANONIMIZADAS'),
      destructionRequested ? 'ND' : (consentData.biobank?.authorizedUse === 'solo-prion' ? 'SOLO-PRION' : 'CUALQUIER'),
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
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const csvBuffer = await this.dropboxService.downloadFile(this.dropboxPath);
      const csvContent = csvBuffer.toString('utf-8');
      return csvContent;
    } catch (error) {
      // Check for file not found error (Dropbox error structure has nested error object)
      if (error.error && error.error.error &&
          error.error.error['.tag'] === 'path' &&
          error.error.error.path &&
          error.error.error.path['.tag'] === 'not_found') {
        // Archivo no existe, retornar null
        console.log('📝 CSV file does not exist yet, will create new one');
        return null;
      }
      // Re-throw other errors
      console.error('❌ Error downloading CSV:', error.error || error.message);
      throw error;
    }
  }

  /**
   * Subir CSV a Dropbox
   */
  async uploadCSV(csvContent) {
    if (!this.isConfigured()) {
      throw new Error('CSV Responses service not configured');
    }

    try {
      const buffer = Buffer.from(csvContent, 'utf-8');
      await this.dropboxService.uploadFile(this.dropboxPath, buffer);

      console.log(`✅ CSV uploaded successfully to ${this.dropboxPath}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Error uploading CSV to Dropbox:', error.message);
      console.error('   Error details:', JSON.stringify(error.error || error, null, 2));
      throw error;
    }
  }

  /**
   * Añadir respuesta de consentimiento al CSV
   */
  async addConsentResponse(consentData) {
    if (!this.isConfigured()) {
      console.log('⚠️  CSV Responses service not configured. Skipping CSV update.');
      return { success: false, message: 'Service not configured' };
    }

    try {
      console.log(`📊 Adding consent response to CSV: ${consentData.txprCode}`);

      // Ensure the responses directory exists first
      const responsesDir = '/ConnectingPrion/priocohort/responses';
      try {
        await this.dropboxService.createFolder(responsesDir);
      } catch (dirError) {
        // Directory might already exist or we can't create it
        console.log(`ℹ️  Directory check: ${dirError.message}`);
      }

      // Descargar CSV existente (si existe)
      let csvContent = await this.downloadCSV();
      let lines = [];
      let fileExists = false;

      if (csvContent) {
        lines = this.parseCSV(csvContent);
        fileExists = true;
      } else {
        // Crear nuevo CSV con cabeceras
        console.log('📝 Creating new CSV file with headers');
        const headers = this.getCSVHeaders();
        lines = [this.arrayToCSVLine(headers)];
        fileExists = false;
      }

      // Añadir nueva fila
      const newRow = this.consentDataToCSVRow(consentData);
      lines.push(this.arrayToCSVLine(newRow));

      // Crear contenido CSV completo
      const updatedCSV = lines.join('\n') + '\n';

      // Subir a Dropbox - usar 'add' si no existe, 'overwrite' si existe
      const buffer = Buffer.from(updatedCSV, 'utf-8');
      const uploadMode = fileExists ? 'overwrite' : 'add';
      console.log(`📤 Uploading CSV with mode: ${uploadMode}`);
      await this.dropboxService.uploadFile(this.dropboxPath, buffer, uploadMode);

      console.log(`✅ Consent response added to CSV: ${consentData.txprCode}`);
      return {
        success: true,
        message: 'Response added to CSV',
        txprCode: consentData.txprCode
      };
    } catch (error) {
      console.error('❌ Error adding consent response to CSV:', error.message);
      console.error('   Full error:', JSON.stringify(error, null, 2));
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
    return this.dropboxService && this.dropboxService.isConfigured();
  }
}

// Export singleton instance
module.exports = new CSVResponsesService();
