import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/global';
import { ClienteService } from '../../services/cliente.service';
import { io } from 'socket.io-client';
import { GuestService } from '../../services/guest.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var Cleave: any;
declare var StickySidebar: any;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

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

  constructor(
    private _clienteService: ClienteService,
    private _guestService: GuestService
  ) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
    this.url = GLOBAL.url;

    this._clienteService.obtener_carrito_cliente(this.id, this.token).subscribe(
      response => {
        this.carrito_arr = response.data;
        this.calcular_subtotal();
      }
    );

    this._guestService.obtener_envios().subscribe(
      response => {
        this.envios = response;
      }
    );
    this.calcular_subtotal();
  }

  init_carrito() {
    this._clienteService.obtener_carrito_cliente(this.id, this.token).subscribe(
      response => {
        this.carrito_arr = response.data;
      }
    );
  }

  ngOnInit(): void {
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

      var sidebar = new StickySidebar('.sidebar-sticky', {topSpacing: 20});
    });

    this.obtener_direccion_principal();
    this.calcular_total();
  }

  obtener_direccion_principal() {
    this._clienteService.obtener_direccion_principal_cliente(localStorage.getItem('_id'), this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this.direccion_principal = undefined;
        } else {
          this.direccion_principal = response.data;
        }
      }
    );
  }

  calcular_subtotal() {
    this.carrito_arr.forEach(element => {
      this.subtotal = this.subtotal + parseInt(element.producto.precio);
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

        this.init_carrito();
      }
    );
  }

  calcular_total() {
    this.total_pagar = this.subtotal + parseInt(this.precio_envio);
  }

}
