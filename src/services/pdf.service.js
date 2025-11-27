const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Genera el PDF del consentimiento informado con formato oficial
 * @param {Object} data - Datos del consentimiento
 * @param {Object} options - Opciones de generación (copyFor: 'donante' | 'investigadora')
 * @returns {Promise<Buffer>} Buffer del PDF generado
 */
async function generatePDF(data, options = { copyFor: 'donante' }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 70,
          bottom: 50,
          left: 60,
          right: 60
        }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

      // Función para añadir encabezado en cada página
      const addHeader = () => {
        // Logo de Osakidetza
        const logoPath = path.join(process.cwd(), 'public/assets/logo-osakidetza.png');
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 50, 30, { width: 80 });
        }

        // Versión y copia en la parte superior derecha
        doc.fontSize(8)
           .font('Helvetica')
           .text('Versión 1 (1 de diciembre 2025)', 400, 30, { align: 'right', width: 150 });

        const copyText = options.copyFor === 'investigadora'
          ? 'Copia para la Dra. Izaro Kortazar'
          : 'Copia para el donante';

        doc.fontSize(8)
           .font('Helvetica-Bold')
           .text(copyText, 400, 45, { align: 'right', width: 150 });
      };

      // Función para añadir checkbox
      const addCheckbox = (x, y, checked = false) => {
        doc.rect(x, y, 10, 10).stroke();
        if (checked) {
          doc.fontSize(12)
             .font('Helvetica-Bold')
             .text('✓', x, y);
        }
      };

      // ==================== PÁGINA 1 ====================
      addHeader();

      // Título principal (centrado y en azul oscuro)
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#003366')
         .text('CONSENTIMIENTO PARA LA REALIZACIÓN DEL PROYECTO DE INVESTIGACIÓN', 60, 90, {
           width: pageWidth,
           align: 'center'
         })
         .fillColor('black');

      doc.moveDown(0.5);

      // Investigadora responsable
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Investigadora/Responsable clínica: ', { continued: true })
         .font('Helvetica')
         .text('Dra. Izaro Kortazar');

      doc.moveDown(0.5);

      // Título del proyecto
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('TÍTULO DEL PROYECTO: ', { continued: true })
         .font('Helvetica')
         .fillColor('blue')
         .text('Cohorte prospectiva de familias con enfermedades priónicas: recopilación de muestras biológicas para el análisis de potenciales biomarcadores diagnósticos y pronósticos y caracterización de la historia natural ', { continued: true })
         .font('Helvetica-Bold')
         .text('(PRIOCOHORT)')
         .fillColor('black');

      doc.moveDown(2);

      // Yo, ... con DNI
      doc.fontSize(10)
         .font('Helvetica')
         .text('Yo, ', { continued: true })
         .font('Helvetica-Bold')
         .text(`${data.name} ${data.lastName}`, { continued: true })
         .font('Helvetica')
         .text(' con DNI nº ', { continued: true })
         .font('Helvetica-Bold')
         .text(data.dni);

      doc.moveDown();

      // DECLARO QUE:
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text('DECLARO QUE:');

      doc.moveDown(0.3);

      // Checkbox 1: He leído la hoja de información
      let currentY = doc.y;
      addCheckbox(60, currentY, data.consent?.readInformationSheet);
      doc.fontSize(9)
         .font('Helvetica')
         .text('He leído la hoja de información al paciente, de la que se me ha entregado una copia.', 75, currentY);

      doc.moveDown(0.5);

      // Checkbox 2: He recibido información clara
      currentY = doc.y;
      addCheckbox(60, currentY, data.consent?.receivedInformation);
      doc.fontSize(9)
         .font('Helvetica')
         .text('He recibido información clara sobre las características del estudio, incluyendo:', 75, currentY);

      doc.moveDown(0.3);
      const bulletPoints1 = [
        'Los objetivos y procedimientos del estudio',
        'Los posibles beneficios y riesgos que puedo esperar',
        'Los derechos que puedo ejercitar',
        'Las previsiones sobre el tratamiento de datos y muestras'
      ];

      bulletPoints1.forEach(point => {
        doc.fontSize(9).font('Helvetica').text('• ' + point, 85);
      });

      doc.moveDown(0.5);

      // Checkbox 3: Comprendo que
      currentY = doc.y;
      addCheckbox(60, currentY, data.consent?.understand);
      doc.fontSize(9)
         .font('Helvetica')
         .text('Comprendo que:', 75, currentY);

      doc.moveDown(0.3);
      const bulletPoints2 = [
        'Se mantendrá en secreto mi identidad',
        'Mis muestras se identificarán con un sistema de codificación',
        'Soy libre de revocar mi consentimiento en cualquier momento y por cualquier motivo',
        'No tengo que dar explicaciones para retirarme',
        'Mi retirada no repercutirá negativamente sobre cualquier tratamiento médico presente o futuro'
      ];

      bulletPoints2.forEach(point => {
        doc.fontSize(9).font('Helvetica').text('• ' + point, 85);
      });

      doc.moveDown();

      // CONSENTIMIENTO PRINCIPAL
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text('CONSENTIMIENTO PRINCIPAL:', 60);

      doc.moveDown(0.3);

      currentY = doc.y;
      addCheckbox(60, currentY, data.consent?.mainConsent1);
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('SÍ DOY MI CONSENTIMIENTO ', 75, currentY, { continued: true })
         .font('Helvetica')
         .text('para que se utilicen mis muestras y los datos clínicos asociados como parte de este proyecto de investigación');

      doc.moveDown(0.5);

      currentY = doc.y;
      addCheckbox(60, currentY, data.consent?.mainConsent2);
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('CONSIENTO ', 75, currentY, { continued: true })
         .font('Helvetica')
         .text('participar voluntariamente en este estudio');

      doc.moveDown();

      // DECISIONES SOBRE RESULTADOS DEL ESTUDIO
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text('DECISIONES SOBRE LOS RESULTADOS DEL ESTUDIO:', 60);

      doc.moveDown(1.5);

      // Información sobre estado genético
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('black')
         .text('Información sobre su estado genético:');

      doc.fontSize(9)
         .font('Helvetica-Oblique')
         .text('Tras haber sido advertido sobre la posibilidad de recibir información derivada de los análisis genéticos que se realicen sobre mi muestra biológica:');

      doc.moveDown(1.5);

      const geneticYes = data.decisions?.geneticInfo === 'si-solicito';
      const geneticNo = data.decisions?.geneticInfo === 'no-quiero';

      currentY = doc.y;
      addCheckbox(60, currentY, geneticYes);
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('SÍ SOLICITO ', 75, currentY, { continued: true })
         .font('Helvetica')
         .text('información sobre mi estado de portador o no portador de la mutación asociada a la enfermedad priónica');

      doc.moveDown(0.3);

      currentY = doc.y;
      addCheckbox(60, currentY, geneticNo);
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('NO QUIERO ', 75, currentY, { continued: true })
         .font('Helvetica')
         .text('recibir información sobre mi estado genético');

      doc.moveDown();

      // Información sobre biomarcadores
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('black')
         .text('Información sobre sus biomarcadores de progresión:', 60);

      doc.fontSize(9)
         .font('Helvetica-Oblique')
         .text('Independientemente de la decisión anterior, tras haber sido advertido sobre la posibilidad de recibir información derivada de los análisis realizados sobre mis muestras:', 60);

      doc.moveDown(1.5);

      const biomarkersYes = data.decisions?.biomarkers === 'si-solicito';
      const biomarkersNo = data.decisions?.biomarkers === 'no-quiero';

      currentY = doc.y;
      addCheckbox(60, currentY, biomarkersYes);
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('SÍ SOLICITO ', 75, currentY, { continued: true })
         .font('Helvetica')
         .text('información sobre el posible inicio de la enfermedad si se detecta en mis muestras durante la investigación');

      doc.moveDown(0.3);

      currentY = doc.y;
      addCheckbox(60, currentY, biomarkersNo);
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('NO QUIERO ', 75, currentY, { continued: true })
         .font('Helvetica')
         .text('recibir información sobre progresión de la enfermedad');

      // Número de página 1
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('black')
         .text('1/2', 60, 780, { align: 'center', width: pageWidth });

      // ==================== PÁGINA 2 ====================
      doc.addPage();
      addHeader();

      doc.moveDown(2);

      // ¿QUÉ OCURRE CON SUS MUESTRAS AL TERMINAR?
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text('¿QUÉ OCURRE CON SUS MUESTRAS AL TERMINAR?', 60);

      doc.moveDown(0.5);

      doc.fontSize(9)
         .font('Helvetica')
         .text('He sido informado sobre la posibilidad de transferir y almacenar mis muestras junto con la información clínica relacionada en el Biobanco Vasco de la Fundación Vasca de Innovación e Investigación Sanitaria (BIOEF).');

      doc.moveDown(0.3);

      doc.text('He sido informado sobre la finalidad de la conservación para futuras investigaciones, el lugar de conservación (Hospital Universitario Araba), las garantías de cumplimiento de la legalidad vigente, la posibilidad de ceder las muestras para futuros proyectos de investigación, y que este consentimiento será custodiado en las instalaciones del Biobanco.');

      doc.moveDown(0.5);

      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('DOY mi consentimiento ', { continued: true })
         .font('Helvetica')
         .text('para que la Dra. Izaro Kortazar transfiera mis muestras y los datos de salud relevantes (excepto los que me identifiquen) al Biobanco Vasco.');

      doc.moveDown(0.5);

      doc.text('Si hubiera excedente de mis muestras, afirmo haber sido advertido sobre las opciones de destino al finalizar el proyecto de investigación. En este sentido:');

      doc.moveDown(0.5);

      currentY = doc.y;
      addCheckbox(60, currentY, data.biobank?.incorporation);
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('SOLICITO ', 75, currentY, { continued: true })
         .font('Helvetica')
         .text('la incorporación del excedente en el Biobanco Vasco');

      doc.moveDown(0.5);

      // Tipo de donación
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Tipo de donación:', 75);

      doc.moveDown(0.3);

      const isCoded = data.biobank?.donationType === 'codificadas';
      const isAnonymous = data.biobank?.donationType === 'anonimizadas';

      currentY = doc.y;
      addCheckbox(85, currentY, isCoded);
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('MUESTRAS CODIFICADAS ', 100, currentY, { continued: true })
         .font('Helvetica')
         .text('(puedo conocer resultados en el futuro si lo deseo)');

      doc.moveDown(0.3);

      currentY = doc.y;
      addCheckbox(85, currentY, isAnonymous);
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('MUESTRAS ANONIMIZADAS ', 100, currentY, { continued: true })
         .font('Helvetica')
         .text('(sin posibilidad de conocer resultados en el futuro)');

      doc.moveDown(0.5);

      // Uso autorizado
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Uso autorizado:', 75);

      doc.moveDown(0.3);

      const isPrionOnly = data.biobank?.authorizedUse === 'solo-prion';
      const isAny = data.biobank?.authorizedUse === 'cualquier';

      currentY = doc.y;
      addCheckbox(85, currentY, isPrionOnly);
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('SOLO ', 100, currentY, { continued: true })
         .font('Helvetica')
         .text('para investigación en enfermedades priónicas');

      doc.moveDown(0.3);

      currentY = doc.y;
      addCheckbox(85, currentY, isAny);
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('CUALQUIER ', 100, currentY, { continued: true })
         .font('Helvetica')
         .text('investigación biomédica (preferentemente en enfermedades priónicas)');

      doc.moveDown(0.5);

      currentY = doc.y;
      addCheckbox(60, currentY, data.biobank?.destruction);
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('SOLICITO ', 75, currentY, { continued: true })
         .font('Helvetica')
         .text('la destrucción de la muestra excedente');

      doc.moveDown(2);

      // FIRMAS Y FECHAS
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text('FIRMAS Y FECHAS');

      doc.moveDown(2);

      // Firma del donante
      if (data.signature) {
        try {
          const signatureBuffer = Buffer.from(data.signature.split(',')[1], 'base64');
          doc.image(signatureBuffer, 60, doc.y, {
            fit: [200, 80]
          });
          doc.moveDown(1);
        } catch (err) {
          doc.moveDown(1);
        }
      } else {
        doc.moveDown(1);
      }

      // Formatear la fecha actual
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

      doc.fontSize(9)
         .font('Helvetica')
         .text('______________________________', 60)
         .text('Firma del donante', 60)
         .text(`                                                    Fecha: ${formattedDate}`, 60);

      doc.moveDown(2);

      // Texto del investigador
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('Yo, Dra. Izaro Kortazar, ', { continued: true })
         .font('Helvetica')
         .text('como investigadora principal y responsable clínica de este proyecto, constato que:');

      doc.moveDown(0.3);

      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('He explicado ', { continued: true })
         .font('Helvetica')
         .text('las características del proyecto de investigación. ', { continued: true })
         .font('Helvetica-Bold')
         .text('He informado ', { continued: true })
         .font('Helvetica')
         .text('sobre las condiciones de conservación que se aplicarán a las muestras y datos. ', { continued: true })
         .font('Helvetica-Bold')
         .text('He respondido ', { continued: true })
         .font('Helvetica')
         .text('a todas las preguntas del participante. ', { continued: true })
         .font('Helvetica-Bold')
         .text('He verificado ', { continued: true })
         .font('Helvetica')
         .text('la comprensión del participante. ', { continued: true })
         .font('Helvetica-Bold')
         .text('He asegurado ', { continued: true })
         .font('Helvetica')
         .text('que el consentimiento se ha obtenido libremente');

      doc.moveDown(2);

      // Firma de la investigadora
      const izaroSignaturePath = path.join(process.cwd(), 'public/assets/firma-izaro.png');
      if (fs.existsSync(izaroSignaturePath)) {
        doc.image(izaroSignaturePath, 60, doc.y, {
          fit: [150, 60]
        });
        doc.moveDown(1);
      } else {
        doc.moveDown(1);
      }

      doc.fontSize(9)
         .font('Helvetica')
         .text('______________________________', 60)
         .text('Firma de la Dra. Izaro Kortazar', 60);

      // Número de página 2
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('black')
         .text('2/2', 60, 780, { align: 'center', width: pageWidth });

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
