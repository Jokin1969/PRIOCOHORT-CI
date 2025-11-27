const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isInitialized = false;
    this.initializeTransporter();
  }

  /**
   * Initialize nodemailer transporter with SMTP configuration
   */
  initializeTransporter() {
    try {
      // Check if nodemailer is available
      if (!nodemailer || typeof nodemailer.createTransporter !== 'function') {
        console.log('⚠️  Nodemailer not available. Email sending will be disabled.');
        this.isInitialized = false;
        return;
      }

      // Check if SMTP is configured
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.log('⚠️  SMTP not configured. Email sending will be disabled.');
        this.isInitialized = false;
        return;
      }

      const smtpConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      };

      this.transporter = nodemailer.createTransporter(smtpConfig);
      this.isInitialized = true;
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing email service:', error.message);
      this.isInitialized = false;
    }
  }

  /**
   * Check if email service is configured and ready
   */
  isConfigured() {
    return this.isInitialized && this.transporter !== null;
  }

  /**
   * Send consent PDF via email
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email address
   * @param {string} options.txprCode - TXPR code
   * @param {string} options.participantName - Participant full name
   * @param {Buffer} options.pdfBuffer - PDF file buffer
   * @param {string} options.filename - PDF filename
   */
  async sendConsentEmail({ to, txprCode, participantName, pdfBuffer, filename }) {
    if (!this.isConfigured()) {
      console.log('⚠️  Email service not configured. Skipping email send.');
      return {
        success: false,
        message: 'Email service not configured'
      };
    }

    try {
      const mailOptions = {
        from: `"PRIOCOHORT" <${process.env.SMTP_USER}>`,
        to: to,
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
            filename: filename,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      };

      console.log(`📧 Enviando email a ${to}...`);

      const info = await this.transporter.sendMail(mailOptions);

      console.log(`✅ Email enviado exitosamente: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
        recipient: to
      };
    } catch (error) {
      console.error('❌ Error enviando email:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test email configuration
   */
  async testConnection() {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'Email service not configured'
      };
    }

    try {
      await this.transporter.verify();
      return {
        success: true,
        message: 'Email configuration is valid'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
module.exports = new EmailService();
