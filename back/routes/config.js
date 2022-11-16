'use strict'

var express = require('express');
var configController = require('../controllers/configController');

var api = express.Router();
var auth = require('../middlewares/authenticate');
var multiparty = require('connect-multiparty');
const path = multiparty({uploadDir: './uploads/configs'});

api.put('/actualizar_config_admin/:id', [auth.auth, path], configController.actualizar_config_admin);
api.get('/obtener_config_admin', auth.auth, configController.obtener_config_admin);

module.exports = api;
