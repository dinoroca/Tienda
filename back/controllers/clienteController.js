"use strict";

var Cliente = require("../models/cliente");
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

const registro_cliente = async function (req, res) {
    //Obtiene los parámetros del cliente
    var data = req.body;
    var clientes_arr = [];

    //Verifica que no exista correo repetido
    clientes_arr = await Cliente.find({ email: data.email });

    if (clientes_arr.length == 0) {
        //Registro del usuario

        if(data.password){
            bcrypt.hash(data.password, null, null, async function(err, hash){
                if(hash) {
                    data.password = hash;
                    var reg = await Cliente.create(data);
                    res.status(200).send({data: reg});
                }else{
                    res.status(200).send({ message: 'Error server', data: undefined });
                }
            });
        } else {
            res.status(200).send({ message: 'No hay una contraseña', data: undefined });
        }
        
    } else {
        res.status(200).send({ message: 'El correo ya existe en la Base de Datos', data: undefined });
    }
};

const login_cliente = async function(req, res) {
    var data = req.body;
    var clientes_arr = [];

    //Busca un cliente mediante el correo
    clientes_arr = await Cliente.find({email: data.email});

    if (clientes_arr.length == 0) {
        res.status(200).send({ message: 'No se encontró el correo', data: undefined });
    }else {
        //Si existe el cliente se manda al login
        let user = clientes_arr[0];

        //Comparar contraseñas
        bcrypt.compare(data.password, user.password, async function (error, check){
            if (check) {
                res.status(200).send({
                    data: user,
                    token: jwt.createToken(user)
                });
            }else {
                res.status(200).send({ message: 'Contraseña incorrecta', data: undefined });
            }
        });
    }
}

const listar_clientes_filtro_admin = async function (req, res) {

    let tipo = req.params['tipo'];
    let filtro = req.params['filtro'];

    console.log(tipo);

    if (tipo == null || tipo == 'null') {
        let reg = await Cliente.find();
        res.status(200).send({data: reg});
    } else {
        if (tipo == 'apellidos') {
            let reg = await Cliente.find({apellidos: new RegExp(filtro, 'i')});
            res.status(200).send({data: reg});
        }else if (tipo == 'correo'){
            let reg = await Cliente.find({email: new RegExp(filtro, 'i')});
            res.status(200).send({data: reg});
        }
    }

}

module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin
};
