'use strict'

var express = require('express');
var softwareController = require('../controllers/softwareController');

var api = express.Router();
var auth = require('../middlewares/authenticate');
var multiparty = require('connect-multiparty');
const path = multiparty({uploadDir: './uploads/productos'});

api.post('/registro_software_admin', [auth.auth, path], softwareController.registro_software_admin);
api.get('/listar_software_admin/:filtro?', auth.auth, softwareController.listar_sofware_admin);
api.delete('/eliminar_software_admin/:id', auth.auth, softwareController.eliminar_software_admin);
api.get('/obtener_portada/:img', softwareController.obtener_portada);
api.get('/obtener_software_admin/:id', auth.auth, softwareController.obtener_software_admin);
api.put('/actualizar_software_admin/:id', [auth.auth, path], softwareController.actualizar_software_admin);
api.put('/actualizar_software_variedades_admin/:id', auth.auth, softwareController.actualizar_software_variedades_admin);
api.get('/listar_software/:filtro?', softwareController.listar_software);
api.get('/obtener_software_slug/:slug', softwareController.obtener_software_slug);

module.exports = api;