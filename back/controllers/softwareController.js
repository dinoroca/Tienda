'use strict'

var Software = require('../models/software');
var fs = require('fs');
var path = require('path');

const registro_software_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let data = req.body;

            var img_path = req.files.portada.path;
            var name = img_path.split('\\');
            var portada_name = name[2];

            data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g, '');
            data.portada = portada_name;

            let reg = await Software.create(data);

            res.status(200).send({ data: reg });
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const listar_sofware_admin = async function (req, res) {

    if (req.user) {
        if (req.user.role == 'admin') {

            var filtro = req.params['filtro'];

            let reg = await Software.find({ titulo: new RegExp(filtro, 'i') });
            res.status(200).send({ data: reg });
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const obtener_portada = async function (req, res) {
    var img = req.params['img'];

    fs.stat('./uploads/productos/' + img, function (err) {
        if (!err) {
            let path_img = './uploads/productos/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

const eliminar_software_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {

            var id = req.params['id'];
            let reg = await Software.findByIdAndRemove({ _id: id });
            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const obtener_software_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {

            var id = req.params['id'];

            try {
                var reg = await Software.findById({ _id: id });
                res.status(200).send({ data: reg });

            } catch (error) {
                res.status(200).send({ data: undefined });
            }

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const actualizar_software_admin = async function (req, res) {

    if (req.user) {
        if (req.user.role == 'admin') {

            let id = req.params['id'];
            let data = req.body;

            if (req.files) {
                //Hay imagen
                var img_path = req.files.portada.path;
                var name = img_path.split('\\');
                var portada_name = name[2];

                let reg = await Software.findByIdAndUpdate({ _id: id }, {
                    titulo: data.titulo,
                    precio: data.precio,
                    link: data.link,
                    tutorial: data.tutorial,
                    descripcion: data.descripcion,
                    portada: portada_name
                });

                fs.stat('./uploads/softwares/' + reg.portada, function (err) {
                    if (!err) {
                        fs.unlink('./uploads/softwares/' + reg.portada, (err) => {
                            if (err) throw err;
                        });
                    }
                });

                res.status(200).send({ data: reg });

            } else {
                let reg = await Software.findByIdAndUpdate({ _id: id }, {
                    titulo: data.titulo,
                    precio: data.precio,
                    link: data.link,
                    tutorial: data.tutorial,
                    descripcion: data.descripcion,
                });

                res.status(200).send({ data: reg });
            }

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const actualizar_software_variedades_admin = async function (req, res) {

    if (req.user) {
        if (req.user.role == 'admin') {

            let id = req.params['id'];
            let data = req.body;

            let reg = await Software.findByIdAndUpdate({ _id: id }, {
                titulo_variedad: data.titulo_variedad,
                variedades: data.variedades
            });

            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const listar_software = async function (req, res) {

    var filtro = req.params['filtro'];

    let reg = await Software.find({ titulo: new RegExp(filtro, 'i') }).sort({ createdAt: -1 });
    res.status(200).send({ data: reg });
}

const obtener_software_slug = async function (req, res) {

    var slug = req.params['slug'];

    let reg = await Software.findOne({ slug: slug });
    res.status(200).send({ data: reg });
}

module.exports = {
    registro_software_admin,
    listar_sofware_admin,
    obtener_portada,
    eliminar_software_admin,
    obtener_software_admin,
    actualizar_software_admin,
    actualizar_software_variedades_admin,
    listar_software,
    obtener_software_slug
}