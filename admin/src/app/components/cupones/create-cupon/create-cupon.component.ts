import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuponService } from '../../../service/cupon.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };


@Component({
  selector: 'app-create-cupon',
  templateUrl: './create-cupon.component.html',
  styleUrls: ['./create-cupon.component.css']
})
export class CreateCuponComponent implements OnInit {

  public cupon: any = {
    tipo: ''
  };
  public load_btn = false;
  public token: any;

  constructor(
    private _cuponService: CuponService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
  }

  registro(registroForm: any) {

    if (registroForm.valid) {
      this.load_btn = true;
      this._cuponService.registro_cupon_admin(this.cupon, this.token).subscribe(
        response => {
          console.log(response);

          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#35D18F',
            class: 'text-success',
            position: 'topRight',
            message: 'Se registró el nuevo cupón'
          });

          this.load_btn = false;
          this._router.navigate(['/panel/cupones']);
          
        },
        error => {
          console.log(error);
          this.load_btn = false;
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
