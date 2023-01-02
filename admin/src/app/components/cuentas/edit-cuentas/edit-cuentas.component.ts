import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-edit-cuentas',
  templateUrl: './edit-cuentas.component.html',
  styleUrls: ['./edit-cuentas.component.css']
})
export class EditCuentasComponent implements OnInit {

  public cuenta : any = {};
  public token;
  public id: any;
  public load_btn = false;
  public load_data = true;

  constructor(
    private _route: ActivatedRoute,
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      
      params => {
        this.id = params['id'];
        
        this._adminService.obtener_cuenta_admin(this.id, this.token).subscribe(
          response => {
            if(response.data == undefined) {
              this.cuenta = undefined;
              this.load_data = false;
            }else {
              this.cuenta = response.data;
              this.load_data = false;
            }
          }
        );
      }
    );
  }

  actualizar(actualizarForm: any){

    if(actualizarForm.valid){
      this.load_btn = true;
      this._adminService.actualizar_cuenta_admin(this.id, this.cuenta, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#35D18F',
            class: 'text-success',
            position: 'topRight',
            message: 'Se actualizó la cuenta'
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
