'use strict'

var express = require('express');
var adiminController = require('../controllers/adminController');

var api = express.Router();
api.post('/registro_admin', adiminController.registro_admim);
api.post('/login_admin', adiminController.login_admin);

module.exports = api;
