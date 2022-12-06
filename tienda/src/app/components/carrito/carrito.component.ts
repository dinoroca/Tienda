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

  public venta: any = {};
  public dventa: Array<any> = [];

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
            subtotal: element.producto.precio,
            variedad: element.variedad,
            cantidad: element.cantidad,
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
    this.carrito_arr.forEach(element => {
      this.subtotal = this.subtotal + (parseInt(element.producto.precio) * element.cantidad);
      
    });

    //Tempratlemte //TODO: SE debe definir una funcion para calcular el total
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

}
