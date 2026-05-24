const express = require('express');
const router = express.Router();

const { getAllTramites } = require('../controllers/get/getTramites');
const { createTramite } = require('../controllers/post/createTramite');
const { deleteTramite } = require('../controllers/delete/deleteTramite'); // Nuevo

router.get('/listar', getAllTramites);
router.post('/nuevo', createTramite);
router.delete('/eliminar/:id', deleteTramite); // Nuevo

module.exports = router;