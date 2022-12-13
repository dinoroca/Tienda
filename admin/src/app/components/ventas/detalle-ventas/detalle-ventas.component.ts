import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/service/global';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-detalle-ventas',
  templateUrl: './detalle-ventas.component.html',
  styleUrls: ['./detalle-ventas.component.css']
})
export class DetalleVentasComponent implements OnInit {

  public url: any;
  public token: any;
  public orden: any = {};
  public detalles: Array<any> = [];
  public load_data = true;
  public id: any;

  public total_star = 5;
  public review: any = {};

  constructor(
    private _route: ActivatedRoute,
    private _adminService: AdminService
  ) {
    this.token = localStorage.getItem('token');

    this.url = GLOBAL.url;

    this._route.params.subscribe(
      params => {
        this.id = params['id'];

        this.init_data();
      }
    );
  }

  ngOnInit(): void {
  }

  init_data() {

    this._adminService.obtener_detalles_orden_cliente(this.id, this.token).subscribe(
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

}
