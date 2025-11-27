const csvService = require('../services/csv.service');

/**
 * Valida el DNI contra el archivo dni.csv
 */
exports.validateDNI = async (req, res) => {
  try {
    const { dni } = req.body;

    if (!dni) {
      return res.status(400).json({
        success: false,
        message: 'DNI es requerido'
      });
    }

    // Leer y buscar en dni.csv
    const dniData = await csvService.findByDNI(dni, 'data/dni.csv');

    if (!dniData) {
      return res.status(404).json({
        success: false,
        message: 'El DNI está equivocado o no está autorizado a continuar. Si el problema persiste, póngase en contacto con la Dra. Izaro Kortazar (izaro.kortazarzubizarreta@osakidetza.eus)'
      });
    }

    // Obtener código TXPR
    const txprData = await csvService.findByDNI(dni, 'data/txpr.csv');

    res.json({
      success: true,
      data: {
        dni: dniData.dni,
        name: dniData.name,
        lastName: dniData.last_name,
        txprCode: txprData ? txprData.txpr : null
      }
    });
  } catch (error) {
    console.error('Error validando DNI:', error);
    res.status(500).json({
      success: false,
      message: 'Error al validar DNI'
    });
  }
};
