import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { Title } from '@angular/platform-browser';
declare var jQuery: any;
declare var $: any;

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public cliente: any = {};
  public id: any;
  public token: any;

  public show = false;
  public password1 = '';
  public password2 = '';
  public alert_pass = false;
  public valid = false;

  constructor(
    private _clienteService: ClienteService,
    private _title: Title
  ) {
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');    

    if (this.id) {
      this._clienteService.obtener_cliente(this.id, this.token).subscribe(
        response => {
          this.cliente = response.data;
          
        }
      );
    }
  }

  ngOnInit(): void {
    this._title.setTitle('Perfil');
  }

  show_password() {
    if (!this.show) {
      this.show = true;
      $('#signin-password').attr('type', 'text');
      $('#signin-password1').attr('type', 'text');
    } else {
      this.show = false;
      $('#signin-password').attr('type', 'password');
      $('#signin-password1').attr('type', 'password');
    }
  }

  compare_password() {
    if (this.password1 == this.password2) {
      this.alert_pass = false;
      this.valid = true;

    } else if (this.password1 != this.password2) {
      this.alert_pass = true;
      this.valid = false;
    }
  }

  actualizar(actualizarForm: any) {
    if (actualizarForm.valid) {

      this.cliente.password = $('#signin-password1').val();

      this._clienteService.actualizar_perfil_cliente(this.id, this.cliente, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#35D18F',
            class: 'text-success',
            position: 'topRight',
            message: 'Se actualizó su perfil'
          });
          
        }
      );
      
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF634F',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos'
      });
    }
  }

}
