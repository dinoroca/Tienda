import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
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

  constructor(
    private _clienteService: ClienteService
  ) {
    this.id = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');

    if (this.id) {
      this._clienteService.obtener_cliente(this.id, this.token).subscribe(
        response => {
          this.cliente = response.data;
          
        },
        error => {
          console.log(error);
          
        }
      );
    }
  }

  ngOnInit(): void {
  }

  actualizar(actualizarForm: any) {
    if (actualizarForm.valid) {

      this.cliente.password = $('#input_password').val();

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
