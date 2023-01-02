import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../service/cliente.service';
import { AdminService } from '../../../service/admin.service';
import { Router } from '@angular/router';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };


@Component({
  selector: 'app-create-cuentas',
  templateUrl: './create-cuentas.component.html',
  styleUrls: ['./create-cuentas.component.css']
})
export class CreateCuentasComponent implements OnInit {

  public cuenta : any = {
    color: '#FFFFFF'
  };
  public token;
  public load_btn = false;

  constructor(
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
      this._adminService.registro_cuenta_admin(this.cuenta, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#35D18F',
            class: 'text-success',
            position: 'topRight',
            message: 'Se registró la nueva cuenta'
          });

          this.cuenta = {
            banco   : '',
            titular : '',
            cuenta : 0,
            cci : 0,
            color : ''
          }
          
          this.load_btn = false;
          this._router.navigate(['/panel/cuentas']);
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
