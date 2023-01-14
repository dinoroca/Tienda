import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { Router } from '@angular/router';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-ventas',
  templateUrl: './index-ventas.component.html',
  styleUrls: ['./index-ventas.component.css']
})
export class IndexVentasComponent implements OnInit {

  public token: any;
  public desde: any;
  public hasta: any;

  public page = 1;
  public pageSize = 5;

  public ventas: Array<any> = [];

  public filtro_cod = '';
  public envio: any = {};
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
    this._adminService.obtener_ventas_admin(this.desde, this.hasta, this.token).subscribe(
      response => {
        this.ventas = response.data;
      }
    );
  }

  filtrar() {
    this._adminService.obtener_ventas_admin(this.desde, this.hasta, this.token).subscribe(
      response => {
        this.ventas = response.data;
      }
    );
  }

  filtrar_cod(filtro: any) {
    this._adminService.obtener_venta_admin(filtro, this.token).subscribe(
      response => {
        if (response.data != undefined) {
          this.err_msg = false;
          this._router.navigate(['/panel/ventas/' + filtro]);
        } else {
          this.err_msg = true;
        }
      }
    );
  }

  cambiar_estado_enviado (id: any) {
    this.load_btn = true;
    this._adminService.actualizar_ventas_enviado_admin(id, this.token).subscribe(
      response => {
        this._adminService.enviar_correo_enviado_admin(id, this.envio, this.token).subscribe(
          response => {
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#35D18F',
              class: 'text-success',
              position: 'topRight',
              message: 'Correo de envío de producto enviado'
            });
          }
        );
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Estado: Enviado'
        });

        $('#send-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.load_btn = false;
        this.init_data();
      }
    );
  }

  cambiar_estado_recibido (id: any) {
    this.load_btn = true;
    this._adminService.actualizar_ventas_recibido_admin(id, this.token).subscribe(
      response => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Estado: Recibido'
        });

        $('#recibe-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.load_btn = false;
        this.init_data();
      }
    );
  }
  
  cambiar_estado_procesando (id: any) {
    this.load_btn = true;
    this._adminService.actualizar_ventas_procesando_admin(id, this.token).subscribe(
      response => {
        this._adminService.enviar_correo_confirmacion_admin(id, this.token).subscribe(
          response => {
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#35D18F',
              class: 'text-success',
              position: 'topRight',
              message: 'Correo de confirmación enviado'
            });
          }
        );

        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Estado: Procesando'
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
    this._adminService.eliminar_reservacion_admin(id, this.token).subscribe(
      response => {
        
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó la venta reservada'
        });

        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.load_btn = false;
        this.init_data();
      }
    );
  }
}
