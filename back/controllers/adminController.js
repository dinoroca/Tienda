'use strict'
var Admin = require('../models/admin');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

const registro_admim = async function (req, res) {
    //Obtiene los parámetros del cliente
    var data = req.body;

    //Verifica que no exista correo repetido
    var admins_arr = await Admin.find({ email: data.email });

    if (admins_arr.length == 0) {
        //Registro del usuario

        if(data.password){
            bcrypt.hash(data.password, null, null, async function(err, hash){
                if(hash) {
                    data.password = hash;
                    var reg = await Admin.create(data);
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

const login_admin = async function(req, res) {
    var data = req.body;
    var admin_arr = [];

    //Busca un admin mediante el correo
    admin_arr = await Admin.find({email: data.email});

    if (admin_arr.length == 0) {
        res.status(200).send({ message: 'No se encontró el correo', data: undefined });
    }else {
        //Si existe el admin se manda al login
        let user = admin_arr[0];

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

module.exports = {
    registro_admim,
    login_admin
};
