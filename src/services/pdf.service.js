const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Genera el PDF del consentimiento informado
 * @param {Object} data - Datos del consentimiento
 * @returns {Promise<Buffer>} Buffer del PDF generado
 */
async function generatePDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Configurar fuentes y estilos
      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

      // Función auxiliar para añadir título
      const addTitle = (text) => {
        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text(text, { align: 'center' })
           .moveDown();
      };

      // Función auxiliar para añadir subtítulo
      const addSubtitle = (text) => {
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text(text)
           .moveDown(0.5);
      };

      // Función auxiliar para añadir texto normal
      const addText = (text) => {
        doc.fontSize(10)
           .font('Helvetica')
           .text(text, { align: 'justify' })
           .moveDown(0.5);
      };

      // === PÁGINA 1: PORTADA ===
      addTitle('CONSENTIMIENTO INFORMADO');
      doc.moveDown();
      addTitle('PRIOCOHORT');
      doc.moveDown(2);

      addSubtitle('Datos del paciente:');
      addText(`Nombre: ${data.name} ${data.lastName}`);
      addText(`DNI: ${data.dni}`);
      addText(`Código TXPR: ${data.txprCode || 'N/A'}`);
      addText(`Fecha: ${new Date(data.timestamp).toLocaleString('es-ES')}`);
      doc.moveDown(2);

      // Metadatos del dispositivo
      if (data.deviceInfo) {
        addSubtitle('Información del dispositivo:');
        addText(`User Agent: ${data.deviceInfo.userAgent || 'N/A'}`);
        addText(`IP: ${data.deviceInfo.ip || 'N/A'}`);
        addText(`Timestamp: ${data.deviceInfo.timestamp || 'N/A'}`);
      }

      doc.addPage();

      // === PÁGINA 2: RESPUESTAS ===
      addTitle('CONFIRMACIÓN DE LECTURA Y COMPRENSIÓN');
      doc.moveDown();

      if (data.consent) {
        addSubtitle('1. Lectura de la hoja informativa:');
        addText(`☑ He leído la hoja de información al paciente: ${data.consent.readInformationSheet ? 'SÍ' : 'NO'}`);
        doc.moveDown();

        addSubtitle('2. Información recibida:');
        addText(`☑ He recibido información clara sobre las características del estudio: ${data.consent.receivedInformation ? 'SÍ' : 'NO'}`);
        doc.moveDown();

        addSubtitle('3. Comprensión:');
        addText(`☑ Comprendo las condiciones del estudio: ${data.consent.understand ? 'SÍ' : 'NO'}`);
        doc.moveDown(2);

        addTitle('CONSENTIMIENTO PRINCIPAL');
        doc.moveDown();
        addText(`☑ Acepto participar en el estudio: ${data.consent.mainConsent1 ? 'SÍ' : 'NO'}`);
        addText(`☑ Confirmo mi consentimiento: ${data.consent.mainConsent2 ? 'SÍ' : 'NO'}`);
        doc.moveDown(2);
      }

      // === DECISIONES ===
      if (data.decisions) {
        addTitle('DECISIONES SOBRE RESULTADOS');
        doc.moveDown();

        addSubtitle('Información sobre estado genético:');
        addText(`Opción seleccionada: ${data.decisions.geneticInfo || 'N/A'}`);
        doc.moveDown();

        addSubtitle('Información sobre biomarcadores de progresión:');
        addText(`Opción seleccionada: ${data.decisions.biomarkers || 'N/A'}`);
        doc.moveDown();
      }

      // === BIOBANCO ===
      if (data.biobank) {
        addTitle('GESTIÓN DE MUESTRAS');
        doc.moveDown();

        addSubtitle('Incorporación al Biobanco Vasco:');
        addText(`${data.biobank.incorporation ? '☑ SÍ, solicito' : '☐ NO solicito'} la incorporación del excedente`);
        doc.moveDown();

        addSubtitle('Destrucción de muestra:');
        addText(`${data.biobank.destruction ? '☑ SÍ, solicito' : '☐ NO solicito'} la destrucción de la muestra`);
        doc.moveDown();

        addSubtitle('Tipo de donación:');
        addText(`${data.biobank.donationType || 'N/A'}`);
        doc.moveDown();

        addSubtitle('Uso autorizado:');
        addText(`${data.biobank.authorizedUse || 'N/A'}`);
      }

      doc.addPage();

      // === FIRMAS ===
      addTitle('FIRMAS Y FECHAS');
      doc.moveDown(2);

      addSubtitle('Firma del paciente:');
      doc.moveDown();

      // Si hay firma (imagen base64), insertarla
      if (data.signature) {
        try {
          // Convertir base64 a buffer
          const signatureBuffer = Buffer.from(data.signature.split(',')[1], 'base64');
          doc.image(signatureBuffer, {
            fit: [200, 100],
            align: 'left'
          });
        } catch (err) {
          addText('[Firma capturada digitalmente]');
        }
      } else {
        addText('[Sin firma]');
      }

      doc.moveDown(2);
      addText(`Fecha: ${new Date(data.timestamp).toLocaleDateString('es-ES')}`);
      doc.moveDown(3);

      // Firma del investigador
      addSubtitle('Firma del investigador:');
      doc.moveDown();

      // Intentar cargar firma de Izaro si existe
      const izaroSignaturePath = path.join(process.cwd(), 'public/assets/firma-izaro.png');
      if (fs.existsSync(izaroSignaturePath)) {
        doc.image(izaroSignaturePath, {
          fit: [200, 100],
          align: 'left'
        });
      } else {
        addText('[Firma Dra. Izaro Kortazar]');
      }

      doc.moveDown();
      addText('Dra. Izaro Kortazar');
      addText('Hospital Universitario Araba');
      addText('izaro.kortazarzubizarreta@osakidetza.eus');

      // Finalizar documento
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generatePDF
};
