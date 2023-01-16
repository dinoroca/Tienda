import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { io } from 'socket.io-client';
import { GuestService } from '../../services/guest.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public token: any;
  public id: any;
  public user: any = undefined;
  public user_lc: any = {};
  public config_global: any = '';
  public op_cart = false;
  public carrito_arr: Array<any> = [];
  public url: any;
  public subtotal = 0;
  public socket = io('http://localhost:4201');

  public filter_producto = '';
  public load_data = true;
  public productos: Array<any> = [];

  public logo: any;

  public descuento_activo: any = undefined;

  constructor(
    private _clienteService: ClienteService,
    private _router: Router,
    private _guestService: GuestService
  ) {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.id = localStorage.getItem('_id');
    } else {
      this.token = sessionStorage.getItem('token');
      this.id = sessionStorage.getItem('_id');
    }
    this.url = GLOBAL.url;

    this.user_lc = undefined;

    this._clienteService.obtener_config_publico().subscribe(
      response => {
        //Asignar los valores de las categorias del back
        this.config_global = response.data;
        localStorage.setItem('logo', this.config_global.logo);
      }
    );

    this.logo = localStorage.getItem('logo');

    if (this.token) {
      //Obtener usuario
      this._clienteService.obtener_cliente(this.id, this.token).subscribe(
        response => {
          this.user = response.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));

          if (localStorage.getItem('user_data')) {
            this.user_lc = JSON.parse(localStorage.getItem('user_data')!);

            this.subtotal = 0;
            this.obtener_carrito();

          } else {
            this.user_lc = undefined;
          }
        },
        error => {
          console.log(error);
          this.user = undefined;
        }
      );
    }
  }

  obtener_carrito() {
    this._clienteService.obtener_carrito_cliente(this.user_lc._id, this.token).subscribe(
      response => {
        this.carrito_arr = response.data;
        this.calcular_subtotal();
      }
    );
  }

  ngOnInit(): void {
    this.subtotal = 0;
    this.socket.on('new-carrito', this.obtener_carrito.bind(this)); //Eliminar
    this.socket.on('new-carrito-add', this.obtener_carrito.bind(this)); //Agregar

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
  }

  logout() {
    window.location.reload();
    localStorage.clear();
    sessionStorage.clear();
    this._router.navigate(['/']);
  }

  op_modalcart() {
    if (!this.op_cart) {
      this.op_cart = true;
      $('#cart').addClass('show');
    } else {
      this.op_cart = false;
      $('#cart').removeClass('show');
    }
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
        let new_precio = Math.round((parseInt(element.producto.precio) * element.cantidad) -
          (parseInt(element.producto.precio) * element.cantidad * this.descuento_activo.descuento) / 100);
        this.subtotal = this.subtotal + new_precio;
      });
    }
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
      }
    );
  }

  buscar_producto() {

    if (this.filter_producto == '') {
      this.productos = [];
    } else {
      this._clienteService.listar_productos(this.filter_producto).subscribe(
        response => {
          this.productos = response.data;

          this.load_data = false;
        }
      );
    }

  }

}
