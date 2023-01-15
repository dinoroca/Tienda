import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/global';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.css']
})
export class SoftwareComponent implements OnInit {

  public token: any;
  public config_global: any = {};
  public filter_categoria: any = '';
  public programas: Array<any> = [];
  public filter_producto = '';
  public filter_cat_productos = 'todos';

  public ruta_actual = '';

  public load_data = true;
  public url: any;
  public route_catrgoria: any;

  public page = 1;
  public pageSize = 12;

  public sort_by = 'Defecto';

  constructor(
    private _clienteService: ClienteService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _title: Title
  ) {
    this.url = GLOBAL.url;

    this.token = localStorage.getItem('token');

    this.ruta_actual = this._router.url;

    localStorage.setItem('ruta_actual', this.ruta_actual);
    sessionStorage.setItem('ruta_actual', this.ruta_actual);

    localStorage.removeItem('cantidad');
    localStorage.removeItem('variedad');

    this._clienteService.obtener_config_publico().subscribe(
      response => {
        //Asiganr los valores de las categorias del back
        this.config_global = response.data;
      }
    );

    this._route.params.subscribe(
      params => {
        this.route_catrgoria = params['titulo'];

        if (this.route_catrgoria) {
          this._clienteService.listar_software('').subscribe(
            response => {
              this.programas = response.data;
              this.programas = this.programas.filter(item => item.titulo.toLowerCase() == this.route_catrgoria);
              this.load_data = false;
            }
          );
        } else {
          this._clienteService.listar_software('').subscribe(
            response => {
              this.programas = response.data;
              this.load_data = false;
            }
          );
        }

      }
    );
    
  }

  ngOnInit(): void {
    this._title.setTitle('Software');
  }

  orden_por() {
    if (this.sort_by == 'Defecto') {
      this._clienteService.listar_software('').subscribe(
        response => {
          this.programas = response.data;
          this.load_data = false;
        }
      );
    } else if (this.sort_by == 'Popularidad') {
      this.programas.sort(function (a, b) {
        if (a.nventas < b.nventas) {
          return 1;
        }
        if (a.nventas > b.nventas) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == '+-precio') {
      this.programas.sort(function (a, b) {
        if (a.precio < b.precio) {
          return 1;
        }
        if (a.precio > b.precio) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == '-+precio') {
      this.programas.sort(function (a, b) {
        if (a.precio > b.precio) {
          return 1;
        }
        if (a.precio < b.precio) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == 'azTitulo') {
      this.programas.sort(function (a, b) {
        if (a.titulo > b.titulo) {
          return 1;
        }
        if (a.titulo < b.titulo) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == 'zaTitulo') {
      this.programas.sort(function (a, b) {
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

  reset_productos() {
    this.filter_producto = '';

    this._clienteService.listar_software('').subscribe(
      response => {
        this.programas = response.data;
        this.load_data = false;
      }
    );
  }

}
