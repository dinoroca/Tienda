
var Venta = require('../models/venta');
var Dventa = require('../models/dventa');
var Producto = require('../models/producto');
var Carrito = require('../models/carrito');

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
            var last_nventa = venta_last[0].nventa;
            var arr_nventa = last_nventa.split('-');

            if (arr_nventa[1] != '999999') {
                var new_correlativo = zfill(parseInt(arr_nventa[1]) + 1, 6);
                nventa = arr_nventa[0] + '-' + new_correlativo;

            } else if (arr_nventa[1] == '999999') {
                var new_serie = zfill(parseInt(arr_nventa[0]) + 1, 3);
                nventa = new_serie[0] + '-000001';
            }
        }
        data.nventa = nventa;
        data.estado = 'Procesando';

        console.log(data);

        let venta = await Venta.create(data);

        detalles.forEach(async element => {
            element.venta = venta._id;
            await Dventa.create(element);

            //Obtener producto de cada arreglo de datalle
            let element_producto = await Producto.findById({ _id: element.producto });
            let new_stock = element_producto.stock - element.cantidad;

            //Actualizar el stock del producto con un nuevop stock
            await Producto.findByIdAndUpdate({ _id: element.producto }, {
                stock: new_stock
            });

            //Limpiar carrito de compras al finalizar una compra
            await Carrito.remove({ cliente: data.cliente });
        });

        res.status(200).send({ venta: venta });

    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

//rellenar de 0 un arreglo
function zfill(number, width) {
    var numberOutput = Math.abs(number);
    var length = number.toString().length;
    var zero = '0';

    if (width <= length) {
        if (number < 0) {
            return ('-' + numberOutput.toString());
        } else {
            return numberOutput.toString();
        }
    } else {
        if (number < 0) {
            return ('-' + (zero.repeat(width - length)) + numberOutput.toString());
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString());
        }

    }
}

module.exports = {
    registro_compra_cliente
}