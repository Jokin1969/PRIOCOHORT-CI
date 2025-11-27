const pdfService = require('../services/pdf.service');
const dropboxSyncService = require('../services/dropbox-sync.service');
const emailService = require('../services/email.service');
const csvResponsesService = require('../services/csv-responses.service');
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

    // Generar PDF para el donante (solo para descarga, NO subir a Dropbox)
    const pdfBufferDonante = await pdfService.generatePDF(consentData, { copyFor: 'donante' });

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${consentData.txprCode || 'consentimiento'}.pdf"`);
    res.send(pdfBufferDonante);
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

    // Generate and upload PDFs (if signatures are present)
    let dropboxResult = null;
    let emailResult = null;
    let csvResult = null;

    try {
      if (consentData.signature) {
        // Generate PDF for donante (to Dropbox)
        const pdfBufferDonante = await pdfService.generatePDF(consentData, { copyFor: 'donante' });
        dropboxResult = await dropboxSyncService.uploadSignedConsent(
          consentData.txprCode,
          pdfBufferDonante,
          {
            name: consentData.name,
            lastName: consentData.lastName,
            txprCode: consentData.txprCode,
            submittedAt: new Date().toISOString()
          }
        );

        // Generate PDF for investigadora (to email)
        const pdfBufferInvestigadora = await pdfService.generatePDF(consentData, { copyFor: 'investigadora' });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const emailFilename = `${consentData.txprCode}_${timestamp}.pdf`;

        // Execute email and CSV in parallel (don't block each other)
        const [emailResultRaw, csvResultRaw] = await Promise.allSettled([
          // Send email to jcastilla@cicbiogune.es
          emailService.sendConsentEmail({
            to: 'jcastilla@cicbiogune.es',
            txprCode: consentData.txprCode,
            participantName: `${consentData.name} ${consentData.lastName}`,
            pdfBuffer: pdfBufferInvestigadora,
            filename: emailFilename
          }),
          // Add consent responses to CSV in Dropbox
          csvResponsesService.addConsentResponse(consentData)
        ]);

        // Extract results
        emailResult = emailResultRaw.status === 'fulfilled' ? emailResultRaw.value : { success: false, error: emailResultRaw.reason?.message };
        csvResult = csvResultRaw.status === 'fulfilled' ? csvResultRaw.value : { success: false, error: csvResultRaw.reason?.message };
      }
    } catch (error) {
      console.error('⚠️  Error al procesar PDFs:', error.message);
      // Continue even if upload/email fails
    }

    res.json({
      success: true,
      message: 'Consentimiento guardado correctamente',
      filename,
      dropboxUpload: dropboxResult?.success || false,
      emailSent: emailResult?.success || false,
      csvSaved: csvResult?.success || false
    });
  } catch (error) {
    console.error('Error guardando consentimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar consentimiento'
    });
  }
};
