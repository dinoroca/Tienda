'use strict'

var express = require('express');
var adiminController = require('../controllers/adminController');

var api = express.Router();
var auth = require('../middlewares/authenticate');

api.post('/registro_admin', adiminController.registro_admim);
api.post('/login_admin', adiminController.login_admin);
api.get('/obtener_admin/:id', auth.auth, adiminController.obtener_admin);
api.get('/obtener_logo/:img', adiminController.obtener_logo);
api.get('/obtener_mensajes_admin', auth.auth, adiminController.obtener_mensajes_admin);
api.put('/cerrar_mensaje_admin/:id', auth.auth, adiminController.cerrar_mensaje_admin);

api.get('/obtener_ventas_admin/:desde?/:hasta?', auth.auth, adiminController.obtener_ventas_admin);

module.exports = api;
