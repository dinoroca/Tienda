import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public user: any = {
    genero: ''
  };
  public ruta_actual: any;

  public show = false;
  public recordar = true;
  public password1 = '';
  public alert_pass = false;

  public valid = false;

  constructor(
    private _clienteService: ClienteService,
    private _router: Router,
    private _title: Title
  ) {

    this.ruta_actual = localStorage.getItem('ruta_actual');

    if (this.ruta_actual == undefined || this.ruta_actual == null) {
      this.ruta_actual = '';
    }
  }

  ngOnInit(): void {
    this._title.setTitle('Registro');
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
    if (this.password1 == this.user.password) {
      this.alert_pass = false;
      this.valid = true;

    } else if (this.password1 != this.user.password) {
      this.alert_pass = true;
      this.valid = false;
    }
  }

  registrar(registroForm: any) {
    if (registroForm.valid) {

      let data = {
        nombres: this.user.nombres,
        apellidos: this.user.apellidos,
        pais: this.user.pais,
        email: this.user.email,
        password: this.user.password,
        telefono: this.user.telefono,
        genero: this.user.genero,
        f_nacimiento: this.user.f_nacimiento,
        dni: this.user.dni
      }

      this._clienteService.registro_cliente(data).subscribe(
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
              console.log('recordando');
            }

            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('_id', response.data._id);
            console.log('Sin recordar');

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
