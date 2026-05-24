const pool = require('../../config/db');
const axios = require('axios'); // Para la futura conexión con Python

const createTramite = async (req, res) => {
    try {
        // Desestructuramos tanto los datos del ciudadano como los del trámite
        const { 
            dni, nombre, apellidos, telefono, email, // Datos Ciudadano
            tipo_tramite, asunto, descripcion        // Datos Trámite
        } = req.body;

        // 1. Verificar si el ciudadano ya existe en la base de datos
        const [ciudadanoExistente] = await pool.execute(
            'SELECT dni FROM ciudadanos WHERE dni = ?',
            [dni]
        );

        // 2. Si el ciudadano NO existe, lo registramos primero
        if (ciudadanoExistente.length === 0) {
            await pool.execute(
                'INSERT INTO ciudadanos (dni, nombre, apellidos, telefono, email) VALUES (?, ?, ?, ?, ?)',
                [dni, nombre, apellidos, telefono, email]
            );
        }

        // 3. Llamada al modelo de IA de Python (Simulada temporalmente)
        const iaResponse = await axios.post('http://localhost:8000/predict', { texto: descripcion });
        const prioridad_calculada = iaResponse.data.prioridad;

        // 4. Guardar el trámite en la base de datos MySQL usando el DNI
        const queryTramite = `
            INSERT INTO tramites (dni_ciudadano, tipo_tramite, asunto, descripcion, prioridad_ia) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const [resultTramite] = await pool.execute(queryTramite, [
            dni, 
            tipo_tramite, 
            asunto, 
            descripcion, 
            prioridad_calculada
        ]);

        res.status(201).json({
            success: true,
            message: "Ciudadano y trámite procesados correctamente",
            data: {
                id_tramite: resultTramite.insertId,
                prioridad_asignada: prioridad_calculada
            }
        });

    } catch (error) {
        console.error("Error al registrar trámite:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

module.exports = { createTramite };