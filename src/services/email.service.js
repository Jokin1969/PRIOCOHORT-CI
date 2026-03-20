const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  /**
   * Initialize SMTP transporter with environment variables
   */
  initialize() {
    const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.log('⚠️  SMTP not configured. Email sending will be disabled.');
      console.log('   Missing variables: SMTP_HOST, SMTP_USER and/or SMTP_PASS');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '587', 10),
      secure: SMTP_SECURE === 'true',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    console.log('📧 SMTP email service initialized');
    console.log(`   Host: ${SMTP_HOST}:${SMTP_PORT || 587}`);
  }

  /**
   * Check if email service is configured and ready
   */
  isConfigured() {
    return this.transporter !== null;
  }

  /**
   * Send consent PDF via email
   * @param {string} to - Recipient email address
   * @param {string} txprCode - TXPR code
   * @param {string} participantName - Participant full name
   * @param {Buffer} pdfBuffer - PDF file buffer
   * @param {string} filename - PDF filename
   */
  async sendConsentEmail({ to, txprCode, participantName, pdfBuffer, filename }) {
    if (!this.isConfigured()) {
      console.log('⚠️  Email service not configured. Skipping email send.');
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: `Nuevo Consentimiento Informado - ${txprCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #003366;">Nuevo Consentimiento Informado Recibido</h2>

            <p>Se ha recibido un nuevo consentimiento informado firmado:</p>

            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Código TXPR:</strong> ${txprCode}</p>
              <p style="margin: 5px 0;"><strong>Participante:</strong> ${participantName}</p>
              <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
            </div>

            <p>El documento PDF del consentimiento firmado está adjunto a este correo.</p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

            <p style="font-size: 12px; color: #666;">
              Este es un mensaje automático del sistema PRIOCOHORT.<br>
              Por favor, no responder a este correo.
            </p>
          </div>
        `,
        attachments: [
          {
            filename,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      });

      console.log(`✅ Email enviado exitosamente via SMTP`);
      console.log(`   Message ID: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
        recipient: to
      };
    } catch (error) {
      console.error('❌ Error enviando email via SMTP:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test SMTP connection
   */
  async testConnection() {
    if (!this.isConfigured()) {
      return { success: false, message: 'Email service not configured' };
    }

    try {
      await this.transporter.verify();
      return { success: true, message: 'SMTP connection verified' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

// Export singleton instance
module.exports = new EmailService();
