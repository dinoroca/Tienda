import { Component, OnInit } from '@angular/core';
import { CuponService } from '../../../service/cupon.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

@Component({
  selector: 'app-update-cupon',
  templateUrl: './update-cupon.component.html',
  styleUrls: ['./update-cupon.component.css']
})
export class UpdateCuponComponent implements OnInit {

  public cupon: any = {
    tipo: ''
  };
  public load_btn = false;
  public load_data = false;
  public token: any;
  public id: any;

  constructor(
    private _cuponService: CuponService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this._route.params.subscribe(

      params => {
        this.id = params['id'];
        this.load_data = true;
        this._cuponService.obtener_cupon_admin(this.id, this.token).subscribe(
          response => {
            if (response.data == undefined) {
              this.cupon = undefined;
              this.load_data = false;
            } else {
              this.cupon = response.data;
              this.load_data = false;
            }
            console.log(this.cupon);
            this.load_data = false;

          },
          error => {
            console.log(error);

          }
        );
      }
    );
  }

  actualizar(actualizarForm: any) {
    if (actualizarForm.valid) {

      this.load_btn = true;
      this._cuponService.actualizar_cupon_admin(this.id, this.cupon, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#35D18F',
            class: 'text-success',
            position: 'topRight',
            message: 'Se actualizó el cupón'
          });

          this.load_btn = false;
          this._router.navigate(['/panel/cupones']);
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
