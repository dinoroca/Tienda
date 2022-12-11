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

  public ruta_actual = '';

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

    this.url = GLOBAL.url;

    this.token = localStorage.getItem('token');

    this._route.params.subscribe(
      params => {
        this.slug = params['slug'];

        this._guestService.obtener_producto_slug(this.slug).subscribe(
          response => {
            this.producto = response.data;
            console.log(this.producto);
            

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

    this._title.setTitle('Tienda | ' + this.slug);

    setTimeout(() => {
      tns({
        container: '.cs-carousel-inner',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        navContainer: "#cs-thumbnails",
        navAsThumbnails: true,
        gutter: 15,
      });

      var e = document.querySelectorAll(".cs-gallery");
      if (e.length) {
        for (var t = 0; t < e.length; t++) {
          lightGallery(e[t], { selector: ".cs-gallery-item", download: !1, videojs: !0, youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 }, vimeoPlayerParams: { byline: 0, portrait: 0 } });
        }
      }

      tns({
        container: '.cs-carousel-inner-two',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        nav: false,
        controlsContainer: "#custom-controls-related",
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          480: {
            items: 2,
            gutter: 24
          },
          700: {
            items: 3,
            gutter: 24
          },
          1100: {
            items: 4,
            gutter: 30
          }
        }
      });
    }, 500)

    tns({
      container: '.cs-carousel-inner',
      controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
      navPosition: "top",
      controlsPosition: "top",
      mouseDrag: !0,
      speed: 600,
      autoplayHoverPause: !0,
      autoplayButtonOutput: !1,
      navContainer: "#cs-thumbnails",
      navAsThumbnails: true,
      gutter: 15,
    });

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

  agregar_producto() {

    if (this.token != undefined) {
      if (this.carrito_data.variedad) {
        if (this.carrito_data.cantidad <= this.producto.stock) {
          
          let data = {
            producto: this.producto._id,
            cliente: localStorage.getItem('_id'),
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
