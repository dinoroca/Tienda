import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/service/global';
import { AdminService } from '../../service/admin.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-detalle-ventas-sofware',
  templateUrl: './detalle-ventas-sofware.component.html',
  styleUrls: ['./detalle-ventas-sofware.component.css']
})
export class DetalleVentasSofwareComponent implements OnInit {

  public url: any;
  public token: any;
  public orden: any = {};
  public load_data = true;
  public id: any;

  public total_star = 5;
  public review: any = {};
  public load_btn = false;

  constructor(
    private _route: ActivatedRoute,
    private _adminService: AdminService
  ) {
    this.token = localStorage.getItem('token');

    this.url = GLOBAL.url;

    this._route.params.subscribe(
      params => {
        this.id = params['id'];
      }
    );
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this._adminService.obtener_venta_software_admin(this.id, this.token).subscribe(
      response => {

        if (response.data != undefined) {
          this.orden = response.data;

          this.load_data = false;
        } else {
          this.orden = undefined;
        }
        
      }
    );
  }

  cambiar_estado_pagado (id: any) {
    this.load_btn = true;
    this._adminService.actualizar_venta_software_pagado_admin(id, this.token).subscribe(
      response => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Estado: Pagado'
        });

        $('#confirm-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.load_btn = false;
        this.init_data();
      }
    );
  }

  eliminar(id: any) {
    this.load_btn = true;
    this._adminService.eliminar_venta_software_admin(id, this.token).subscribe(
      response => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó la venta de software'
        });

        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.load_btn = false;
        this.init_data();
      }
    );
  }

}
