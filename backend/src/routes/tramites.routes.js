const express = require('express');
const router = express.Router();

const { getAllTramites } = require('../controllers/getTramites');
const { createTramite } = require('../controllers/createTramite');
const { deleteTramite } = require('../controllers/deleteTramite'); // Nuevo

router.get('/listar', getAllTramites);
router.post('/nuevo', createTramite);
router.delete('/eliminar/:id', deleteTramite); // Nuevo

module.exports = router;