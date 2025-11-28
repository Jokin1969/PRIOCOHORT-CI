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
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const csvBuffer = await this.dropboxService.downloadFile(this.dropboxPath);
      const csvContent = csvBuffer.toString('utf-8');
      return csvContent;
    } catch (error) {
      if (error.error && error.error['.tag'] === 'path' && error.error.path['.tag'] === 'not_found') {
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
    return this.dropboxService && this.dropboxService.isConfigured();
  }
}

// Export singleton instance
module.exports = new CSVResponsesService();
