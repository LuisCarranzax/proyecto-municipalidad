const express = require('express');
const cors = require('cors');
require('dotenv').config();

const tramitesRoutes = require('./routes/tramites.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite recibir JSON en el body

// Rutas base
app.use('/api/tramites', tramitesRoutes);

// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});