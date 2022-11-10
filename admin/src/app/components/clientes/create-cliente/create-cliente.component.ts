import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../service/cliente.service';
import { AdminService } from '../../../service/admin.service';
import { Router } from '@angular/router';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.css']
})
export class CreateClienteComponent implements OnInit {

  public cliente : any = {
    genero: ''
  };

  public token;
  public load_btn = false;

  constructor(
    private _clienteService: ClienteService,
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
  }

  registro(registroForm: any){

    if(registroForm.valid){
      this.load_btn = true;
      this._clienteService.registro_cliente_admin(this.cliente, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#35D18F',
            class: 'text-success',
            position: 'topRight',
            message: 'Se registró el nuevo cliente'
          });

          this.cliente = {
            nombres   : '',
            apellidos : '',
            genero : '',
            telefono : '',
            f_nacimiento : '',
            dni : '',
            email : ''
          }
          
          this.load_btn = false;
          this._router.navigate(['/panel/clientes']);
        },
        error => {
          console.log(error);
        }
      );
    }else {
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
