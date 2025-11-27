const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor PRIOCOHORT-CI ejecutándose en puerto ${PORT}`);
  console.log(`📝 Accede a la aplicación en: http://localhost:${PORT}`);
});

module.exports = app;
