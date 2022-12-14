'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Se crea un modelo de objeto para el producto
var SoftwareSchema = Schema({
    titulo: {type: String, required: true},
    slug: {type: String, required: true},
    portada: {type: String, required: true},
    link: {type: String, required: true},
    tutorial: {type: String, required: false},
    precio: {type: Number, required: true},
    descripcion: {type: String, required: true},
    nventas: {type: Number, default: 0, required: true},
    npuntos: {type: Number, default: 0, required: true},
    variedades: [{type: Object, required: true}],
    titulo_variedad: {type: String, required: false},
    
    createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('software', SoftwareSchema);