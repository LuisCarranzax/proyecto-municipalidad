const pool = require('../../config/db');
// const axios = require('axios'); // Lo usaremos luego para llamar a Python

const createTramite = async (req, res) => {
    try {
        const { dni_ciudadano, tipo_tramite, asunto, descripcion } = req.body;

        // 1. Aquí irá la futura llamada a la API de Python (Modelo ML)
        // const iaResponse = await axios.post('http://localhost:8000/predict', { texto: descripcion });
        // const prioridad = iaResponse.data.prioridad;
        
        // Simulación temporal mientras construimos el modelo:
        const prioridad_calculada = "Alta"; 

        // 2. Guardar en la base de datos MySQL
        const query = `
            INSERT INTO tramites (dni_ciudadano, tipo_tramite, asunto, descripcion, prioridad_ia) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(query, [
            dni_ciudadano, 
            tipo_tramite, 
            asunto, 
            descripcion, 
            prioridad_calculada
        ]);

        res.status(201).json({
            success: true,
            message: "Trámite registrado y evaluado correctamente",
            data: {
                id_tramite: result.insertId,
                prioridad_asignada: prioridad_calculada
            }
        });

    } catch (error) {
        console.error("Error al crear el trámite:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

module.exports = { createTramite };