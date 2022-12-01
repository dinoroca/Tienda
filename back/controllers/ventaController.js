
var Venta = require('../models/venta');
var Dventa = require('../models/dventa');

const registro_compra_cliente = async function (req, res) {
    if (req.user) {

        var data = req.body;
        let detalles = data.detalles;

        console.log(data);

        var venta_last = await Venta.find().sort({ cretedAt: -1 });
        var serie;
        var correlativo;
        var nventa;

        if (venta_last.length == 0) {
            serie = '001';
            correlativo = '000001';

            nventa = serie + '-' + correlativo;
        } else {
            // Más de un registro en venta

        }
        data.nventa = nventa;
        data.estado = 'Procesando';
        
        console.log(data);

        let venta = await Venta.create(data);

        detalles.forEach(async element => {
            element.venta = venta._id;
            await Dventa.create(element);
        });

        res.status(200).send({ venta: venta });

    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

module.exports = {
    registro_compra_cliente
}