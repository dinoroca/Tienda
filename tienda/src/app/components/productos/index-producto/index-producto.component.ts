import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/global';
import { ActivatedRoute } from '@angular/router';

declare var noUiSlider: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

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

  constructor(
    private _clienteService: ClienteService,
    private _route: ActivatedRoute
  ) {
    this.url = GLOBAL.url;
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
    var slider: any = document.getElementById('slider');
    noUiSlider.create(slider, {
      start: [0, 1000],
      connect: true,

      //Rango de precios
      range: {
        'min': 0,
        'max': 1000
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
}
