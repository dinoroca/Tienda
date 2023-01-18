import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/global';
import { GuestService } from '../../services/guest.service';

declare var tns: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public config_global: any = '';
  public load_categorias = true;
  public descuento_activo: any = undefined;
  public url: any;

  public load_data = true;

  public productos_nuevos: Array<any> = [];
  public load_nuevos = true;
  public productos_descuento: Array<any> = [];
  public load_descuento = true;
  public productos_mas_vendidos: Array<any> = [];
  public load_mas_vendidos = true;

  constructor(
    private _title: Title,
    private _guestService: GuestService,
    private _clienteService: ClienteService
  ) {
    this.url = GLOBAL.url;

    this._clienteService.obtener_config_publico().subscribe(
      response => {
        //Asiganr los valores de las categorias del back
        this.config_global = response.data;
        console.log(this.config_global.banners.length);
        
        this.load_categorias = false;
      }
    );

    localStorage.removeItem('ruta_actual');
    localStorage.removeItem('cantidad');
    localStorage.removeItem('variedad');
  }

  ngOnInit(): void {
    this._title.setTitle('HJM TECNOLOGÍA Y SOPORTE');

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

    //Listar productos nuevos
    this._guestService.listar_productos_nuevos().subscribe(
      response => {
        this.productos_nuevos = response.data;
        this.load_nuevos = false;
      }
    );

    //Obtener priductos más vendidos
    this._guestService.listar_productos_mas_vendidos().subscribe(
      response => {
        this.productos_mas_vendidos = response.data;
        this.load_mas_vendidos = false;
      }
    );

    //Obtener productos
    this._guestService.listar_productos_descuento().subscribe(
      response => {
        this.productos_descuento = response.data;
        this.load_descuento = false;
      }
    );
  }

}
