import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GLOBAL } from 'src/app/services/global';
import { ClienteService } from '../../services/cliente.service';
import { io } from 'socket.io-client';
import { GuestService } from '../../services/guest.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var Cleave: any;
declare var StickySidebar: any;
declare var paypal: any;

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  @ViewChild('paypalButton', { static: true }) paypalElement!: ElementRef;
  public token: any;
  public id: any;
  public url: any;
  public carrito_arr: Array<any> = [];
  public subtotal = 0;
  public total_pagar = 0;
  public socket = io('http://localhost:4201');

  public direccion_principal: any = {};
  public envios: Array<any> = [];

  public precio_envio = '';
  public descuento = 0;

  public venta: any = {};
  public dventa: Array<any> = [];

  public error_cupon = '';

  public descuento_activo: any = undefined;

  constructor(
    private _clienteService: ClienteService,
    private _guestService: GuestService,
    private _title: Title,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
    this.venta.cliente = this.id;
    this.url = GLOBAL.url;

    this._guestService.obtener_envios().subscribe(
      response => {
        this.envios = response;
      }
    );
    this.calcular_subtotal();
  }

  ngOnInit(): void {

    this._title.setTitle('Carrito de compras');

    //Obtener descuentos activos
    this._guestService.obtener_descuento_activo().subscribe(
      response => {

        if (response.data != undefined) {
          this.descuento_activo = response.data[0];
        } else {
          this.descuento_activo = undefined;
        }
      }
    );

    //Inicializa los valores de inicio
    this.init_data();

    //Validación para número de tarjeta de crédito
    setTimeout(() => {
      new Cleave('#cc-number', {
        creditCard: true,
        onCreditCardTypeChanged: function (type: any) {
          // update UI ...
        }
      });

      //Validación para la fecha de vencimiento
      new Cleave('#cc-exp-date', {
        date: true,
        datePattern: ['m', 'y']
      });

      var sidebar = new StickySidebar('.sidebar-sticky', { topSpacing: 20 });
    });

    this.obtener_direccion_principal();

    paypal.Buttons({
      style: {
        layout: 'horizontal'
      },
      createOrder: (data: any, actions: { order: { create: (arg0: { purchase_units: { description: string; amount: { currency_code: string; value: number; }; }[]; }) => any; }; }) => {

        return actions.order.create({
          purchase_units: [{
            description: 'Pago en la tienda HJM',
            amount: {
              currency_code: 'USD',
              value: this.subtotal
            },
          }]
        });

      },
      onApprove: async (data: any, actions: { order: { capture: () => any; }; }) => {
        const order = await actions.order.capture();

        this.venta.transaccion = order.purchase_units[0].payments.captures[0].id;
        this.venta.detalles = this.dventa;

        //Registrar la venta mediante el método del controlador
        this._clienteService.registro_compra_cliente(this.venta, this.token).subscribe(
          response => {
            this._clienteService.enviar_correo_cliente(response.venta._id, this.token).subscribe(
              response => {
                this._router.navigate(['/']);
              }
            );
          }
        );
      },
      onError: (err: any) => {

      },
      onCancel: function (data: any, actions: any) {

      }
    }).render(this.paypalElement.nativeElement);

  }

  init_data() {
    this.subtotal = 0;
    this._clienteService.obtener_carrito_cliente(this.id, this.token).subscribe(
      response => {
        this.carrito_arr = response.data;
        //Recorrer todos los elementos del arreglo de carrito
        this.carrito_arr.forEach(element => {
          this.dventa.push({
            producto: element.producto._id,
            variedad: element.variedad,
            cantidad: element.cantidad,
            subtotal: element.producto.precio * element.cantidad,
            cliente: localStorage.getItem('_id')
          });
        });
        this.calcular_subtotal();
      }
    );
  }

  obtener_direccion_principal() {
    this._clienteService.obtener_direccion_principal_cliente(localStorage.getItem('_id'), this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this.direccion_principal = undefined;
        } else {
          this.direccion_principal = response.data;
          this.venta.direccion = this.direccion_principal._id;
        }
      }
    );
  }

  calcular_subtotal() {
    this.subtotal = 0;
    if (this.descuento_activo == undefined) {
      //NO hay descuento
      this.carrito_arr.forEach(element => {
        this.subtotal = this.subtotal + (parseInt(element.producto.precio) * element.cantidad);
      });
    } else if (this.descuento_activo != undefined) {
      //Hay descuento
      this.carrito_arr.forEach(element => {
        let new_precio =  Math.round((parseInt(element.producto.precio) * element.cantidad) - 
                                      (parseInt(element.producto.precio) * this.descuento_activo.descuento)/100);
        this.subtotal = this.subtotal + new_precio;
      });
    }
    this.total_pagar = this.subtotal;
  }

  eliminar_item(id: any) {
    this.subtotal = 0;
    this._clienteService.eliminar_carrito_cliente(id, this.token).subscribe(
      response => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó el producto'
        });
        //Eliminar cliente en real time con socket.io
        this.socket.emit('delete-carrito', { data: response.data });

        this.init_data();
      }
    );
  }

  calcular_total(envio_titulo: any) {
    this.total_pagar = this.subtotal + parseInt(this.precio_envio);
    this.venta.subtotal = this.total_pagar;
    this.venta.envio_precio = parseInt(this.precio_envio);
    this.venta.envio_titulo = envio_titulo;
  }

  validar_cupon() {
    if (this.venta.cupon) {

      if (this.venta.cupon.toString().length <= 10) {
        this._clienteService.validar_cupon_cliente(this.venta.cupon, this.token).subscribe(
          response => {
            if (response.data != undefined) {
              //Procede con el descuento
              this.error_cupon = '';

              if (response.data.tipo == 'Valor fijo') {
                this.descuento = response.data.valor;
                this.total_pagar = this.total_pagar - this.descuento;

              } else if (response.data.tipo == 'Porcentaje') {
                this.descuento = (this.total_pagar * response.data.valor) / 100;
                this.total_pagar = this.total_pagar - this.descuento;
                this.subtotal = this.total_pagar;
              }

            } else {
              this.error_cupon = 'El cupón no se pudo canjear';
            }
            console.log(response);
          }
        );

      } else {
        //no es válido
        this.error_cupon = 'El cupón debe tener menos de 10 caracteres';
      }
    } else {
      this.error_cupon = 'El cupón no es válido';
    }
  }

}
