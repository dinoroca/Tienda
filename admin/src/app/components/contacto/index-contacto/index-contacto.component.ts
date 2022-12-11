import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../service/admin.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-contacto',
  templateUrl: './index-contacto.component.html',
  styleUrls: ['./index-contacto.component.css']
})
export class IndexContactoComponent implements OnInit {

  public mensajes: Array<any> = [];
  public load_data = true;
  public load_btn = false;
  public page = 1;
  public pageSize = 10;
  public filtro = '';
  public token: any;

  constructor( 
    private _adminService: AdminService
   ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this._adminService.obtener_mensajes_admin(this.token).subscribe(
      response => {
        this.mensajes = response.data;
        this.load_data = false;
      }
    );
  }

  cerrar(id: any) {
    this.load_btn = true;
    this._adminService.cerrar_mensaje_admin(id, {data: undefined}, this.token).subscribe(
      response => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Se cerró el mensaje'
        });

        $('#estadoModal-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.load_btn = false;
        this.init_data();
      },
      error => {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF634F',
          class: 'text-danger',
          position: 'topRight',
          message: 'Error en el servidor'
        });
        console.log(error);
        this.load_btn = false;
        
      }
    );
  }

}
