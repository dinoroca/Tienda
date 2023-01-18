import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { Title } from '@angular/platform-browser';
import { GLOBAL } from 'src/app/services/global';
import { ActivatedRoute } from '@angular/router';
import { io } from 'socket.io-client';
import { GuestService } from '../../../services/guest.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

declare var noUiSlider: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public token: any;
  public config_global: any = {};
  public filter_categoria: any = '';
  public productos: Array<any> = [];
  public filter_producto = '';
  public filter_cat_productos = 'todos';

  public load_data = true;
  public url: any;
  public route_catrgoria: any;

  public page = 1;
  public pageSize = 12;

  public sort_by = 'Defecto';

  public carrito_data: any = {
    variedad: '',
    cantidad: 1
  };
  public btn_cart = false;
  public op_categoria = false;
  public socket = io('http://localhost:4201');

  public descuento_activo: any = undefined;

  constructor(
    private _clienteService: ClienteService,
    private _route: ActivatedRoute,
    private _title: Title,
    private _guestService: GuestService
  ) {

    this.url = GLOBAL.url;

    localStorage.removeItem('variedad');
    localStorage.removeItem('cantidad');

    this.token = localStorage.getItem('token');

    this._clienteService.obtener_config_publico().subscribe(
      response => {
        //Asiganr los valores de las categorias del back
        this.config_global = response.data;
      }
    );

    this._route.params.subscribe(
      params => {
        this.route_catrgoria = params['categoria'];

        if (this.route_catrgoria) {
          this._clienteService.listar_productos('').subscribe(
            response => {
              this.productos = response.data;
              this.productos = this.productos.filter(item => item.categoria.toLowerCase() == this.route_catrgoria);
              this.load_data = false;
            }
          );
        } else {
          this._clienteService.listar_productos('').subscribe(
            response => {
              this.productos = response.data;
              this.load_data = false;
            }
          );
        }

      }
    );
  }

  ngOnInit(): void {
    this._title.setTitle('HJM TECNOLOGÍA Y SOPORTE | Productos');

    var slider: any = document.getElementById('slider');
    noUiSlider.create(slider, {
      start: [0, 5000],
      connect: true,

      //Rango de precios
      range: {
        'min': 0,
        'max': 5000
      },
      tooltips: [true, true],
      pips: {
        mode: 'count',
        values: 5,

      }
    })

    slider.noUiSlider.on('update', function (values: any[]) {
      $('.cs-range-slider-value-min').val(values[0]);
      $('.cs-range-slider-value-max').val(values[1]);
    });
    $('.noUi-tooltip').css('font-size', '11px');

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

  buscar_categorias() {

    if (this.filter_categoria) {
      var search = new RegExp(this.filter_categoria, 'i');
      this.config_global.categorias = this.config_global.categorias.filter(
        (item: { titulo: string; }) => search.test(item.titulo)
      );
    } else {
      this._clienteService.obtener_config_publico().subscribe(
        response => {
          //Asiganr los valores de las categorias del back
          this.config_global = response.data;
        }
      );
    }
  }

  buscar_producto() {
    this._clienteService.listar_productos(this.filter_producto).subscribe(
      response => {
        this.productos = response.data;

        this.load_data = false;
      }
    );
  }

  buscar_precios() {
    this._clienteService.listar_productos(this.filter_producto).subscribe(
      response => {
        this.productos = response.data;

        let min = parseInt($('.cs-range-slider-value-min').val());
        let max = parseInt($('.cs-range-slider-value-max').val());

        this.productos = this.productos.filter((item) => {
          return item.precio >= min && item.precio <= max;
        });
      }
    );

  }

  buscar_por_categoria() {
    if (this.filter_cat_productos == 'todos') {
      this._clienteService.listar_productos(this.filter_producto).subscribe(
        response => {
          this.productos = response.data;

          this.load_data = false;
        }
      );
    } else {
      this._clienteService.listar_productos(this.filter_producto).subscribe(
        response => {
          this.productos = response.data;

          this.productos = this.productos.filter(item => item.categoria == this.filter_cat_productos);
        }
      );
    }

  }

  reset_productos() {

    this.filter_producto = '';

    this._clienteService.listar_productos('').subscribe(
      response => {
        this.productos = response.data;
        this.load_data = false;
      }
    );
  }

  orden_por() {
    if (this.sort_by == 'Defecto') {
      this._clienteService.listar_productos('').subscribe(
        response => {
          this.productos = response.data;
          this.load_data = false;
        }
      );
    } else if (this.sort_by == 'Popularidad') {
      this.productos.sort(function (a, b) {
        if (a.nventas < b.nventas) {
          return 1;
        }
        if (a.nventas > b.nventas) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == '+-precio') {
      this.productos.sort(function (a, b) {
        if (a.precio < b.precio) {
          return 1;
        }
        if (a.precio > b.precio) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == '-+precio') {
      this.productos.sort(function (a, b) {
        if (a.precio > b.precio) {
          return 1;
        }
        if (a.precio < b.precio) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == 'azTitulo') {
      this.productos.sort(function (a, b) {
        if (a.titulo > b.titulo) {
          return 1;
        }
        if (a.titulo < b.titulo) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == 'zaTitulo') {
      this.productos.sort(function (a, b) {
        if (a.titulo < b.titulo) {
          return 1;
        }
        if (a.titulo > b.titulo) {
          return -1;
        }

        return 0;
      });
    }
  }

  //TODO: Corregir
  agregar_producto(producto: any) {
    let data = {
      producto: producto._id,
      cliente: localStorage.getItem('_id'),
      cantidad: 1,
      variedad: producto.variedades[0].titulo
    }

    this.btn_cart = true;
    this._clienteService.agregar_carrito_cliente(data, this.token).subscribe(
      response => {
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
  }

  op_modalcategorias() {
    if (!this.op_categoria) {
      this.op_categoria = true;
      $('#filtersOffcanvas').addClass('show');
    } else {
      this.op_categoria = false;
      $('#filtersOffcanvas').removeClass('show');
    }
  }
}
