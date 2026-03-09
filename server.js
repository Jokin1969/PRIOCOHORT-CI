const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import Dropbox sync service
const dropboxSyncService = require('./src/services/dropbox-sync.service');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/docs', express.static('docs'));

// Rutas API
const dniRoutes = require('./src/routes/dni.routes');
const consentRoutes = require('./src/routes/consent.routes');

app.use('/api/dni', dniRoutes);
app.use('/api/consent', consentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      hasSmtpHost: !!process.env.SMTP_HOST,
      hasSmtpUser: !!process.env.SMTP_USER,
      hasSmtpPass: !!process.env.SMTP_PASS,
      hasDropboxToken: !!process.env.DROPBOX_REFRESH_TOKEN || !!process.env.DROPBOX_ACCESS_TOKEN,
      contactEmail: process.env.CONTACT_EMAIL || 'not set'
    }
  });
});

// Ruta principal - servir el index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Función de inicialización
async function startServer() {
  try {
    // Sync CSV files from Dropbox on startup
    console.log('🔄 Iniciando sincronización de archivos CSV desde Dropbox...');
    await dropboxSyncService.syncAllCSVFiles();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor PRIOCOHORT-CI ejecutándose en puerto ${PORT}`);
      console.log(`📝 Accede a la aplicación en: http://localhost:${PORT}`);
      console.log(`\n📧 Configuración SMTP:`);
      console.log(`   Host: ${process.env.SMTP_HOST || '✗ NO configurado'}`);
      console.log(`   User: ${process.env.SMTP_USER ? '✓ Configurado' : '✗ NO configurado'}`);
      console.log(`   Pass: ${process.env.SMTP_PASS ? '✓ Configurada' : '✗ NO configurada'}`);
      console.log(`   Email destino: ${process.env.CONTACT_EMAIL || '✗ NO configurado'}`);
      console.log(`\n💡 Endpoints disponibles:`);
      console.log(`   GET  /              → Aplicación principal`);
      console.log(`   GET  /api/health    → Estado del servidor`);
      console.log(`   POST /api/consent/save → Guardar consentimiento\n`);
    });
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    console.log('⚠️  El servidor continuará usando los archivos CSV locales existentes...');

    // Start server anyway with local files
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor PRIOCOHORT-CI ejecutándose en puerto ${PORT}`);
      console.log(`📝 Accede a la aplicación en: http://localhost:${PORT}`);
      console.log(`\n📧 Configuración SMTP:`);
      console.log(`   Host: ${process.env.SMTP_HOST || '✗ NO configurado'}`);
      console.log(`   User: ${process.env.SMTP_USER ? '✓ Configurado' : '✗ NO configurado'}`);
      console.log(`   Pass: ${process.env.SMTP_PASS ? '✓ Configurada' : '✗ NO configurada'}`);
      console.log(`   Email destino: ${process.env.CONTACT_EMAIL || '✗ NO configurado'}`);
      console.log(`\n💡 Endpoints disponibles:`);
      console.log(`   GET  /              → Aplicación principal`);
      console.log(`   GET  /api/health    → Estado del servidor`);
      console.log(`   POST /api/consent/save → Guardar consentimiento\n`);
    });
  }
}

// Iniciar el servidor
startServer();

module.exports = app;
