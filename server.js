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

// Rutas API
const dniRoutes = require('./src/routes/dni.routes');
const consentRoutes = require('./src/routes/consent.routes');

app.use('/api/dni', dniRoutes);
app.use('/api/consent', consentRoutes);

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
      console.log(`🚀 Servidor PRIOCOHORT-CI ejecutándose en puerto ${PORT}`);
      console.log(`📝 Accede a la aplicación en: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    console.log('⚠️  El servidor continuará usando los archivos CSV locales existentes...');

    // Start server anyway with local files
    app.listen(PORT, () => {
      console.log(`🚀 Servidor PRIOCOHORT-CI ejecutándose en puerto ${PORT}`);
      console.log(`📝 Accede a la aplicación en: http://localhost:${PORT}`);
    });
  }
}

// Iniciar el servidor
startServer();

module.exports = app;
