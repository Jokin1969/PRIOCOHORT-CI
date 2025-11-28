// Try to load SendGrid, but gracefully handle if it's not available
let sgMail = null;
try {
  sgMail = require('@sendgrid/mail');
  console.log('✅ SendGrid module loaded successfully');
} catch (error) {
  console.error('❌ Failed to load @sendgrid/mail module:', error.message);
  console.error('   This usually means @sendgrid/mail is not installed.');
  console.error('   Check that package.json includes @sendgrid/mail and npm install ran successfully.');
}

class EmailService {
  constructor() {
    this.isInitialized = false;
    this.sendgridAvailable = sgMail !== null;
    this.initialize();
  }

  /**
   * Initialize SendGrid with API key
   */
  initialize() {
    try {
      // Check if SendGrid module was loaded
      if (!this.sendgridAvailable) {
        console.log('⚠️  SendGrid module not available. Email sending will be disabled.');
        console.log('   Please verify:');
        console.log('   1. @sendgrid/mail is listed in package.json dependencies');
        console.log('   2. npm install completed without errors');
        this.isInitialized = false;
        return;
      }

      // Check if API key is configured
      if (!process.env.SENDGRID_API_KEY) {
        console.log('⚠️  SendGrid API key not configured. Email sending will be disabled.');
        console.log('   Missing environment variable: SENDGRID_API_KEY');
        this.isInitialized = false;
        return;
      }

      // Initialize SendGrid with API key
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      console.log('📧 SendGrid email service initialized successfully');
      console.log(`   API Key: ${process.env.SENDGRID_API_KEY.substring(0, 10)}...`);

      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Error initializing email service:', error.message);
      console.error('   Stack trace:', error.stack);
      this.isInitialized = false;
    }
  }

  /**
   * Check if email service is configured and ready
   */
  isConfigured() {
    return this.isInitialized && this.sendgridAvailable;
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
      // Convert PDF buffer to base64 for SendGrid
      const pdfBase64 = pdfBuffer.toString('base64');

      const msg = {
        to: to,
        from: process.env.SENDGRID_FROM_EMAIL || 'joaquin.castilla@gmail.com',
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
            content: pdfBase64,
            filename: filename,
            type: 'application/pdf',
            disposition: 'attachment'
          }
        ]
      };

      console.log(`📧 Enviando email a ${to} via SendGrid...`);
      console.log(`   Tamaño del PDF: ${Math.round(pdfBuffer.length / 1024)} KB`);

      const response = await sgMail.send(msg);

      console.log(`✅ Email enviado exitosamente via SendGrid`);
      console.log(`   Status code: ${response[0].statusCode}`);

      return {
        success: true,
        messageId: response[0].headers['x-message-id'],
        recipient: to,
        statusCode: response[0].statusCode
      };
    } catch (error) {
      console.error('❌ Error enviando email via SendGrid:', error.message);
      if (error.response) {
        console.error('   Response body:', error.response.body);
      }
      return {
        success: false,
        error: error.message,
        errorCode: error.code
      };
    }
  }

  /**
   * Test email configuration (not applicable for SendGrid, but keep for compatibility)
   */
  async testConnection() {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'Email service not configured'
      };
    }

    // SendGrid doesn't have a test connection method like SMTP
    // Just return success if API key is configured
    return {
      success: true,
      message: 'SendGrid API key is configured'
    };
  }
}

// Export singleton instance
module.exports = new EmailService();
