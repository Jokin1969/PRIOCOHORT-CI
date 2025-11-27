const pdfService = require('../services/pdf.service');
const dropboxSyncService = require('../services/dropbox-sync.service');
const fs = require('fs').promises;
const path = require('path');

/**
 * Genera el PDF del consentimiento informado
 */
exports.generateConsentPDF = async (req, res) => {
  try {
    const consentData = req.body;

    // Validar datos requeridos
    if (!consentData.dni || !consentData.name || !consentData.lastName) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos'
      });
    }

    // Generar PDF
    const pdfBuffer = await pdfService.generatePDF(consentData);

    // Upload to Dropbox (non-blocking)
    dropboxSyncService.uploadSignedConsent(
      consentData.dni,
      pdfBuffer,
      {
        name: consentData.name,
        lastName: consentData.lastName,
        txprCode: consentData.txprCode,
        submittedAt: new Date().toISOString()
      }
    ).catch(error => {
      console.error('⚠️  No se pudo subir a Dropbox, pero el PDF se generó correctamente:', error.message);
    });

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${consentData.txprCode || 'consentimiento'}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar PDF'
    });
  }
};

/**
 * Guarda el consentimiento con sincronización en Dropbox
 */
exports.saveConsent = async (req, res) => {
  try {
    const consentData = req.body;

    // Guardar localmente
    const savePath = path.join(__dirname, '../../data/signed-consents');
    await fs.mkdir(savePath, { recursive: true });

    const filename = `${consentData.txprCode || 'consent'}_${Date.now()}.json`;
    const localPath = path.join(savePath, filename);
    await fs.writeFile(localPath, JSON.stringify(consentData, null, 2));

    // Upload to Dropbox (if configured)
    let dropboxResult = null;
    try {
      // Generate PDF if signatures are present
      if (consentData.patientSignature || consentData.representativeSignature) {
        const pdfBuffer = await pdfService.generatePDF(consentData);
        dropboxResult = await dropboxSyncService.uploadSignedConsent(
          consentData.dni,
          pdfBuffer,
          {
            name: consentData.name,
            lastName: consentData.lastName,
            txprCode: consentData.txprCode,
            submittedAt: new Date().toISOString()
          }
        );
      }
    } catch (dropboxError) {
      console.error('⚠️  Error al subir a Dropbox:', dropboxError.message);
      // Continue even if Dropbox upload fails
    }

    res.json({
      success: true,
      message: 'Consentimiento guardado correctamente',
      filename,
      dropboxUpload: dropboxResult?.success || false
    });
  } catch (error) {
    console.error('Error guardando consentimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar consentimiento'
    });
  }
};
