import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ClienteService } from '../../../services/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.css']
})
export class DetalleOrdenComponent implements OnInit {

  public url: any;
  public token: any;
  public orden: any = {};
  public detalles: Array<any> = [];
  public load_data = true;
  public id: any;

  constructor(
    private _title: Title,
    private _clienteService: ClienteService,
    private _route: ActivatedRoute
  ) {
    this.token = localStorage.getItem('token');

    this.url = GLOBAL.url;

    this._route.params.subscribe(
      params => {
        this.id = params['id'];

        this._clienteService.obtener_detalles_orden_cliente(this.id, this.token).subscribe(
          response => {

            if (response.data != undefined) {
              this.orden = response.data;
              this.detalles = response.detalles;
              this.load_data = false;
              
            } else {
              this.orden = undefined;
            }
          }
        );
      }
    );
  }

  ngOnInit(): void {
    this._title.setTitle('Perfil | Detalle de orden');
  }

}
