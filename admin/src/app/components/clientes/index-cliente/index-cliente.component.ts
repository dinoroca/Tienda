import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/service/cliente.service';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css']
})
export class IndexClienteComponent implements OnInit {

  public clientes : Array<any> = [];
  public filtro_apellidos = '';
  public filtro_correo = '';

  public page = 1;
  public pageSize = 10;
  public token;

  constructor(
    private _clienteService: ClienteService,
    private _adminService: AdminService
    ) {
      this.token = this._adminService.getToken();
    }

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this._clienteService.listar_clientes_filtro_admin(null, null, this.token).subscribe(
      response => {
        this.clientes = response.data;
      },
      error => {
        console.log(error);
      }
    );
  }

  filtro(tipo: any) {


    if(tipo == 'apellidos') {
      if(this.filtro_apellidos){
        this._clienteService.listar_clientes_filtro_admin(tipo, this.filtro_apellidos, this.token).subscribe(
          response => {
            this.clientes = response.data;
          },
          error => {
            console.log(error);
          }
        );
      }else {
        this.init_data();
      }

    }else if( tipo == 'correo') {
      if(this.filtro_correo){
        this._clienteService.listar_clientes_filtro_admin(tipo, this.filtro_correo, this.token).subscribe(
          response => {
            this.clientes = response.data;
          },
          error => {
            console.log(error);
          }
        );
      } else {
        this.init_data();
      }
    }

  }

}
