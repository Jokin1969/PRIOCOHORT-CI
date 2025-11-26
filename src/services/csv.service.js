const fs = require('fs').promises;
const { parse } = require('csv-parse/sync');
const iconv = require('iconv-lite');
const jschardet = require('jschardet');
const path = require('path');

/**
 * Lee un archivo CSV con detección automática de codificación
 * @param {string} filePath - Ruta al archivo CSV
 * @returns {Promise<Array>} Array de objetos con los datos del CSV
 */
async function readCSV(filePath) {
  try {
    // Leer el archivo como buffer
    const buffer = await fs.readFile(filePath);

    // Detectar la codificación del archivo
    const detected = jschardet.detect(buffer);
    const encoding = detected.encoding || 'utf-8';

    console.log(`Codificación detectada para ${filePath}: ${encoding}`);

    // Decodificar el buffer a string usando la codificación detectada
    let content;
    if (iconv.encodingExists(encoding)) {
      content = iconv.decode(buffer, encoding);
    } else {
      // Fallback a UTF-8 si la codificación no es soportada
      content = buffer.toString('utf-8');
    }

    // Parsear el CSV
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true // Manejar BOM (Byte Order Mark)
    });

    return records;
  } catch (error) {
    console.error(`Error leyendo CSV ${filePath}:`, error);
    throw error;
  }
}

/**
 * Busca un registro por DNI en un archivo CSV
 * @param {string} dni - DNI a buscar
 * @param {string} csvFile - Archivo CSV donde buscar
 * @returns {Promise<Object|null>} Objeto con los datos encontrados o null
 */
async function findByDNI(dni, csvFile) {
  try {
    const filePath = path.join(process.cwd(), csvFile);
    const records = await readCSV(filePath);

    // Normalizar DNI (quitar espacios, mayúsculas)
    const normalizedDNI = dni.trim().toUpperCase();

    // Buscar en los registros
    const found = records.find(record => {
      return record.dni && record.dni.trim().toUpperCase() === normalizedDNI;
    });

    return found || null;
  } catch (error) {
    console.error(`Error buscando DNI ${dni} en ${csvFile}:`, error);
    throw error;
  }
}

module.exports = {
  readCSV,
  findByDNI
};
