'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Se crea un modelo de objeto para el inventario
var VentaSoftwareSchema = Schema({
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    software: {type: Schema.ObjectId, ref: 'software', required: true},
    nventa: {type: Number, required: true},
    subtotal: {type: Number, required: true},
    transaccion: {type: String, required: true},
    estado: {type: String, required: true},
    descargado: {type: String, required: false},
    
    createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('ventaSoftware', VentaSoftwareSchema);