{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 .SFNS-Regular_wdth_opsz110000_GRAD_wght2580000;}
{\colortbl;\red255\green255\blue255;\red16\green16\blue16;\red255\green255\blue255;}
{\*\expandedcolortbl;;\cssrgb\c7843\c7843\c7451;\cssrgb\c100000\c100000\c100000;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\b\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
const express = require('express');\
const path = require('path');\
const fs = require('fs');\
require('dotenv').config();\
\
const app = express();\
const PORT = process.env.PORT || 3000;\
\
// Middleware\
app.use(express.json());\
app.use(express.urlencoded(\{ extended: true \}));\
app.use(express.static('public'));\
\
// Rutas API\
const dniRoutes = require('./src/routes/dni.routes');\
const consentRoutes = require('./src/routes/consent.routes');\
\
app.use('/api/dni', dniRoutes);\
app.use('/api/consent', consentRoutes);\
\
// Ruta principal - servir el index.html\
app.get('/', (req, res) => \{\
  res.sendFile(path.join(__dirname, 'public', 'index.html'));\
\});\
\
// Manejo de errores\
app.use((err, req, res, next) => \{\
  console.error(err.stack);\
  res.status(500).json(\{\
    error: 'Error interno del servidor',\
    message: err.message\
  \});\
\});\
\
// Iniciar servidor\
app.listen(PORT, () => \{\
  console.log(`\uc0\u55357 \u56960  Servidor PRIOCOHORT-CI ejecut\'e1ndose en puerto $\{PORT\}`);\
  console.log(`\uc0\u55357 \u56541  Accede a la aplicaci\'f3n en: http://localhost:$\{PORT\}`);\
\});\
\
module.exports = app;\
}