import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../service/cliente.service';
import { AdminService } from '../../../service/admin.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})
export class EditClienteComponent implements OnInit {

  public cliente: any = {};
  public id: any;
  public token;
  public load_btn = false;
  public load_data = true;

  constructor(
    private _route: ActivatedRoute,
    private _clienteService: ClienteService,
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      
      params => {
        this.id = params['id'];
        
        this._clienteService.obtener_cliente_admin(this.id, this.token).subscribe(
          response => {
            console.log(response);

            if(response.data == undefined) {
              this.cliente = undefined;
              this.load_data = false;
            }else {
              this.cliente = response.data;
              this.load_data = false;
            }
          },
          error => {
          }
        );
      }
    );
  }

  actualizar(updateForm: any) {

    if(updateForm.valid) {
      this.load_btn = true;
      this._clienteService.actualizar_cliente_admin(this.id, this.cliente, this.token).subscribe(
        response => {
          console.log(response);
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#35D18F',
            class: 'text-success',
            position: 'topRight',
            message: 'Se actualizó el cliente'
          });

          this.load_btn = false;
          this._router.navigate(['/panel/clientes']);
        },
        error => {
          console.log(error);
          
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
