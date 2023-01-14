import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/service/global';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../service/admin.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

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
  public envio: any = {};
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

  cambiar_estado_enviado (id: any) {
    this.load_btn = true;
    this._adminService.actualizar_ventas_enviado_admin(id, this.token).subscribe(
      response => {
        this._adminService.enviar_correo_enviado_admin(this.id, this.envio, this.token).subscribe(
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
        this._adminService.enviar_correo_confirmacion_admin(this.id, this.token).subscribe(
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
        console.log(response);
        
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
