import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: any = {};
  public usuario: any = {};
  public token: any;

  public ruta_actual: any;
  public show = false;
  public recordar = true;

  constructor(
    private _clienteService: ClienteService,
    private _router: Router,
    private _title: Title
  ) { }

  obtener_ruta() {
      this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
      this.ruta_actual = localStorage.getItem('ruta_actual') || sessionStorage.getItem('ruta_actual');

    if (this.ruta_actual == undefined || this.ruta_actual == null) {
      this.ruta_actual = '';
    }

    if (this.token) {
      this._router.navigate(['/' + this.ruta_actual]);
    }
  }

  ngOnInit(): void {
    this._title.setTitle('Iniciar sesión');
  }

  show_password() {
    if (!this.show) {
      this.show = true;
      $('#signin-password').attr('type', 'text');
    } else {
      this.show = false;
      $('#signin-password').attr('type', 'password');
    }
  }

  login(loginForm: any) {
    if (loginForm.valid) {
      let data = {
        email: this.user.email,
        password: this.user.password
      }

      this._clienteService.login_cliente(data).subscribe(
        response => {
          if (response.data == undefined) {
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FF634F',
              class: 'text-danger',
              position: 'topRight',
              message: response.message
            });

          } else {
            if (this.recordar) {
              localStorage.setItem('token', response.token);
              localStorage.setItem('_id', response.data._id);
            }

            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('_id', response.data._id);
            this.usuario = response.data;

            this.obtener_ruta();
            

            this._router.navigate(['/' + this.ruta_actual]);
          }
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
