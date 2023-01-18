import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { GuestService } from '../../../services/guest.service';
import { ClienteService } from '../../../services/cliente.service';
import { io } from 'socket.io-client';
import { Title } from '@angular/platform-browser';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };


declare var tns: any;
declare var lightGallery: any;

@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css']
})
export class ShowProductoComponent implements OnInit {

  public token: any;
  public slug: any;
  public producto: any = {};
  public url: any;
  public productos_rec: any = [];
  public reviews: Array<any> = [];

  public ruta_actual = '';

  public page = 1;
  public pageSize = 10;

  public count_five_stars = 0;
  public count_four_stars = 0;
  public count_three_stars = 0;
  public count_two_stars = 0;
  public count_one_stars = 0;

  public porcent_five_stars = 0;
  public porcent_four_stars = 0;
  public porcent_three_stars = 0;
  public porcent_two_stars = 0;
  public porcent_one_stars = 0;

  public total_puntos = 0;
  public max_puntos = 0;
  public porcent_rating = 0;
  public puntos_rating = 0;

  public carrito_data: any = {
    variedad: '',
    cantidad: 1
  };
  public btn_cart = false;
  public socket = io('http://localhost:4201');

  public descuento_activo: any = undefined;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _guestService: GuestService,
    private _clienteService: ClienteService,
    private _title: Title
  ) {

    this.ruta_actual = this._router.url;

    localStorage.setItem('ruta_actual', this.ruta_actual);
    sessionStorage.setItem('ruta_actual', this.ruta_actual);

    this.url = GLOBAL.url;

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');

    this.carrito_data.variedad = localStorage.getItem('variedad') || '';
    this.carrito_data.cantidad = localStorage.getItem('cantidad') || 1;

    this._route.params.subscribe(
      params => {
        this.slug = params['slug'];

        this._guestService.obtener_producto_slug(this.slug).subscribe(
          response => {
            this.producto = response.data;

            //mandar arreglo de productos a reviews
            this._guestService.obtener_reviews_producto(this.producto._id).subscribe(
              response => {

                //Contar la cantidad de estrellas de cada comentario
                response.data.forEach((element: { estrellas: number; }) => {
                  if (element.estrellas == 5) {
                    this.count_five_stars = this.count_five_stars + 1;

                  } else if (element.estrellas == 4) {
                    this.count_four_stars = this.count_four_stars + 1;

                  }else if (element.estrellas == 3) {
                    this.count_three_stars = this.count_three_stars + 1;

                  }else if (element.estrellas == 2) {
                    this.count_two_stars = this.count_two_stars + 1;

                  }else if (element.estrellas == 1) {
                    this.count_one_stars = this.count_one_stars + 1;
                  }

                  this.porcent_five_stars = (this.count_five_stars * 100)/response.data.length;
                  this.porcent_four_stars = (this.count_four_stars * 100)/response.data.length;
                  this.porcent_three_stars = (this.count_three_stars * 100)/response.data.length;
                  this.porcent_two_stars = (this.count_two_stars * 100)/response.data.length;
                  this.porcent_one_stars = (this.count_one_stars * 100)/response.data.length;

                  let puntos_cinco = 0;
                  let puntos_cuatro = 0;
                  let puntos_tres = 0;
                  let puntos_dos = 0;
                  let puntos_uno = 0;

                  puntos_cinco = this.count_five_stars * 5;
                  puntos_cuatro = this.count_four_stars * 4;
                  puntos_tres = this.count_three_stars * 3;
                  puntos_dos = this.count_two_stars * 2;
                  puntos_uno = this.count_one_stars * 1;

                  this.total_puntos = puntos_cinco + puntos_cuatro + puntos_tres + puntos_dos + puntos_uno;
                  this.max_puntos = response.data.length * 5;
                  this.porcent_rating = Math.round((this.total_puntos * 100)/this.max_puntos);
                  this.puntos_rating = (this.porcent_rating * 5)/100;

                });
                this.reviews = response.data;
              }
            );

            //Obtener productos recomendados
            this._guestService.listar_productos_recomendados(this.producto.categoria).subscribe(
              response => {
                this.productos_rec = response.data;
              }
            );
          }
        );
      }
    );
  }

  ngOnInit(): void {

    this._title.setTitle('HJM TECNOLOGÍA Y SOPORTE | ' + this.slug);

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

  guardar_variedad() {
    localStorage.setItem('variedad', this.carrito_data.variedad);
  }

  guardar_cantidad() {
    localStorage.setItem('cantidad', this.carrito_data.cantidad);
  }

  agregar_producto() {

    if (this.token != undefined) {
      if (this.carrito_data.variedad) {
        if (this.carrito_data.cantidad <= this.producto.stock) {
          
          let data = {
            producto: this.producto._id,
            cliente: localStorage.getItem('_id') || sessionStorage.getItem('_id'),
            cantidad: this.carrito_data.cantidad,
            variedad: this.carrito_data.variedad
          }
  
          this.btn_cart = true;
          this._clienteService.agregar_carrito_cliente(data, this.token).subscribe(
            response  => {
              if (response.data == undefined) {
                iziToast.show({
                  title: 'ERROR',
                  titleColor: '#FF634F',
                  class: 'text-danger',
                  position: 'topRight',
                  message: 'El producto ya existe en el carrito de compras'
                });
                
                this.btn_cart = false;
              } else {
                iziToast.show({
                  title: 'SUCCESS',
                  titleColor: '#35D18F',
                  class: 'text-success',
                  position: 'topRight',
                  message: 'Se agregó al carrito'
                });
  
                this.socket.emit('add-carrito', {data: true});
    
                this.btn_cart = false;
              }
            }
          );
        } else {
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF634F',
            class: 'text-danger',
            position: 'topRight',
            message: 'La cantidad máxima disponible es: ' + this.producto.stock
          });
        }
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF634F',
          class: 'text-danger',
          position: 'topRight',
          message: 'Seleccione una variedad'
        });
      }
    } else {
      this._router.navigate(['/login']);
    }

  }

}
