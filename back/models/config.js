'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Se crea un modelo de objeto para el admin
var configSchema = Schema({
    categorias: [{type: Object, required: true}],
    titulo: {type: String, required: true},
    tipo_cambio: {type: Number, required: true},
    logo: {type: String, required: true},
    serie: {type: String, required: true},
    correlativo: {type: String, required: true}
});

module.exports = mongoose.model('config', configSchema);