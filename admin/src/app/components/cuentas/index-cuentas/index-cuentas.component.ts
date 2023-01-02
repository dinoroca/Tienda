import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { Router } from '@angular/router';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-cuentas',
  templateUrl: './index-cuentas.component.html',
  styleUrls: ['./index-cuentas.component.css']
})
export class IndexCuentasComponent implements OnInit {

  public token: any;
  public cuentas: Array<any> = [];
  public load_btn = false;
  public load_data = true;

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
    this._adminService.obtener_cuentas_admin(this.token).subscribe(
      response => {
        this.cuentas = response.data;
        this.load_data = false;
      }
    );
  }

  eliminar(id: any) {
    this.load_btn = true;
    this._adminService.eliminar_cuenta_admin(id, this.token).subscribe(
      response => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Estado: Eliminado'
        });

        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.load_btn = false;
        this.init_data();
      }
    );
  }

}

