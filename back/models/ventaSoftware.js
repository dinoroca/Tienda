'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Se crea un modelo de objeto para el inventario
var VentaSoftwareSchema = Schema({
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    nventa: {type: Number, required: true},
    subtotal: {type: Number, required: true},
    transaccion: {type: String, required: true},
    
    createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('ventaSoftware', VentaSoftwareSchema);