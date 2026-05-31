const pool = require('../config/db');

const deleteTramite = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.execute('DELETE FROM tramites WHERE id_tramite = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Trámite no encontrado" });
        }
        
        res.status(200).json({ success: true, message: "Trámite eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el trámite:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

module.exports = { deleteTramite };