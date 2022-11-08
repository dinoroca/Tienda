"use strict";

var Cliente = require("../models/cliente");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../helpers/jwt");

const registro_cliente = async function (req, res) {
  //Obtiene los parámetros del cliente
  var data = req.body;
  var clientes_arr = [];

  //Verifica que no exista correo repetido
  clientes_arr = await Cliente.find({ email: data.email });

  if (clientes_arr.length == 0) {
    //Registro del usuario

    if (data.password) {
      bcrypt.hash(data.password, null, null, async function (err, hash) {
        if (hash) {
          data.password = hash;
          var reg = await Cliente.create(data);
          res.status(200).send({ data: reg });
        } else {
          res.status(200).send({ message: "Error server", data: undefined });
        }
      });
    } else {
      res
        .status(200)
        .send({ message: "No hay una contraseña", data: undefined });
    }
  } else {
    res
      .status(200)
      .send({
        message: "El correo ya existe en la Base de Datos",
        data: undefined,
      });
  }
};

const login_cliente = async function (req, res) {
  var data = req.body;
  var clientes_arr = [];

  //Busca un cliente mediante el correo
  clientes_arr = await Cliente.find({ email: data.email });

  if (clientes_arr.length == 0) {
    res
      .status(200)
      .send({ message: "No se encontró el correo", data: undefined });
  } else {
    //Si existe el cliente se manda al login
    let user = clientes_arr[0];

    //Comparar contraseñas
    bcrypt.compare(data.password, user.password, async function (error, check) {
      if (check) {
        res.status(200).send({
          data: user,
          token: jwt.createToken(user),
        });
      } else {
        res
          .status(200)
          .send({ message: "Contraseña incorrecta", data: undefined });
      }
    });
  }
};

const listar_clientes_filtro_admin = async function (req, res) {
    
  if (req.user) {
    if (req.user.role == "admin") {

      let tipo = req.params["tipo"];
      let filtro = req.params["filtro"];

      console.log(tipo);

      if (tipo == null || tipo == "null") {
        let reg = await Cliente.find();
        res.status(200).send({ data: reg });
      } else {
        if (tipo == "apellidos") {
          let reg = await Cliente.find({ apellidos: new RegExp(filtro, "i") });
          res.status(200).send({ data: reg });
        } else if (tipo == "correo") {
          let reg = await Cliente.find({ email: new RegExp(filtro, "i") });
          res.status(200).send({ data: reg });
        }
      }
    } else {
        res.status(500).send({message: 'NoAccess'});
    }
  }else {
    res.status(500).send({message: 'NoAccess'});
  }
};

const registro_cliente_admin = async function(req, res){
  if(req.user){
    if(req.user.role == 'admin'){
      
      var data = req.body;
      
      bcrypt.hash('12345', null, null, async function(err, hash) {
        if(hash) {
          data.password = hash;
          let reg = await Cliente.create(data);
          res.status(200).send({data: reg});
        } else {
          res.status(200).send({message: 'Error en el servidor', data: undefined});
        }
      })

    } else {
      res.status(500).send({message: 'NoAccess'});
    }
  } else {
    res.status(500).send({message: 'NoAccess'});
  }
}

const obtener_cliente_admin = async function(req, res){
  if(req.user){
    if(req.user.role == 'admin'){
      
      var id = req.params['id'];
      
      try {
        var reg = await Cliente.findById({_id:id});
        res.status(200).send({data: reg});
        
      } catch (error) {
        res.status(200).send({data: undefined});
      }

    } else {
      res.status(500).send({message: 'NoAccess'});
    }
  } else {
    res.status(500).send({message: 'NoAccess'});
  }
}

const actualizar_cliente_admin = async function(req, res) {
  if(req.user){
    if(req.user.role == 'admin'){
      
      var id = req.params['id'];
      var data = req.body;

      var reg = await Cliente.findByIdAndUpdate({_id: id}, {
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        telefono: data.telefono,
        f_nacimiento: data.f_nacimiento,
        dni: data.dni,
        genero: data.genero
      });

      res.status(200).send({data: reg});

    } else {
      res.status(500).send({message: 'NoAccess'});
    }
  } else {
    res.status(500).send({message: 'NoAccess'});
  }
}

const eliminar_cliente_admin = async function(req, res){
  if(req.user){
    if(req.user.role == 'admin'){
      
      var id = req.params['id'];
      let reg = await Cliente.findByIdAndRemove({_id: id});
      res.status(200).send({data: reg});

    } else {
      res.status(500).send({message: 'NoAccess'});
    }
  } else {
    res.status(500).send({message: 'NoAccess'});
  }
}

module.exports = {
  registro_cliente,
  login_cliente,
  listar_clientes_filtro_admin,
  registro_cliente_admin,
  obtener_cliente_admin,
  actualizar_cliente_admin,
  eliminar_cliente_admin
};
