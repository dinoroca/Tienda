import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { Router } from '@angular/router';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

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

  constructor(
    private _clienteService: ClienteService,
    private _router: Router
  ) {

    this.ruta_actual = localStorage.getItem('ruta_actual');

    if (this.ruta_actual == undefined || this.ruta_actual == null) {
      this.ruta_actual = '';
    }
  }

  ngOnInit(): void {
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
