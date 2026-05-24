const express = require('express');
const router = express.Router();

// Importamos los controladores desde sus respectivas carpetas modulares
const { getAllTramites } = require('../controllers/get/getTramites');
const { createTramite } = require('../controllers/post/createTramite');

// Definición de endpoints
router.get('/listar', getAllTramites);
router.post('/nuevo', createTramite);

module.exports = router;