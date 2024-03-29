import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { Router } from '@angular/router';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-ventas-sofware',
  templateUrl: './ventas-sofware.component.html',
  styleUrls: ['./ventas-sofware.component.css']
})
export class VentasSofwareComponent implements OnInit {

  public token: any;
  public desde: any;
  public hasta: any;

  public page = 1;
  public pageSize = 5;

  public ventas: Array<any> = [];

  public filtro_cod = '';
  public err_msg = false;
  public load_btn = false;

  constructor(
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this._adminService.obtener_ventas_software_admin(this.desde, this.hasta, this.token).subscribe(
      response => {
        this.ventas = response.data;
      }
    );
  }

  filtrar() {
    this._adminService.obtener_ventas_software_admin(this.desde, this.hasta, this.token).subscribe(
      response => {
        this.ventas = response.data;
      }
    );
  }

  filtrar_cod(filtro: any) {
    this._adminService.obtener_venta_software_admin(filtro, this.token).subscribe(
      response => {
        if (response.data != undefined) {
          this.err_msg = false;
          this._router.navigate(['/panel/ventas-software/' + filtro]);
        } else {
          this.err_msg = true;
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

        $('#send-' + id).modal('hide');
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
