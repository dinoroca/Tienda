import { Component, OnInit } from '@angular/core';
import { CuponService } from '../../../service/cupon.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css']
})
export class IndexCuponComponent implements OnInit {

  public cupones: Array<any> = [];
  public load_data = true;
  public load_btn = false;
  public page = 1;
  public pageSize = 10;
  public filtro = '';
  public token: any;

  constructor(
    private _cuponService: CuponService
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
      response => {
        this.cupones = response.data;
        this.load_data = false;
      },
      error => {
        console.log(error);
        
      }
    );
  }

  filtrar () {
    this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
      response => {
        this.cupones = response.data;
        this.load_data = false;
      },
      error => {
        console.log(error);
        
      }
    );
  }

  eliminar(id: any){

    this.load_btn = true;
    this._cuponService.eliminar_cupon_admin(id, this.token).subscribe(
      response => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó el cupón'
        });

        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.load_btn = false;
        this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
          response => {
            this.cupones = response.data;
            this.load_data = false;
          },
          error => {
            console.log(error);
            
          }
        );
      },
      error => {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF634F',
          class: 'text-danger',
          position: 'topRight',
          message: 'Error en el servidor'
        });
        console.log(error);
        this.load_btn = false;
        
      }
    );
  }

}
