const pool = require('../../config/db');

const getAllTramites = async (req, res) => {
    try {
        const query = `
            SELECT t.id_tramite, t.tipo_tramite, t.asunto, t.descripcion, t.prioridad_ia, t.estado, t.fecha_creacion,
                   c.dni, c.nombre, c.apellidos, c.telefono, c.email 
            FROM tramites t
            JOIN ciudadanos c ON t.dni_ciudadano = c.dni
            ORDER BY t.fecha_creacion DESC
        `;
        const [rows] = await pool.execute(query);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Error al obtener los trámites:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

module.exports = { getAllTramites };