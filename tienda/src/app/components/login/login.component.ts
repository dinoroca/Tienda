import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

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

  constructor(
    private _clienteService: ClienteService,
    private _router: Router,
    private _title: Title
  ) {
    this.token = localStorage.getItem('token');
    this.ruta_actual = localStorage.getItem('ruta_actual');

    if (this.ruta_actual == undefined || this.ruta_actual == null) {
      this.ruta_actual = '';
    }

    if (this.token) {
      this._router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this._title.setTitle('Iniciar sesión');
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
            this.usuario = response.data;
            localStorage.setItem('token', response.token);
            localStorage.setItem('_id', response.data._id);

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
