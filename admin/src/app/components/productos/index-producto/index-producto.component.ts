import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../service/producto.service';
import { GLOBAL } from '../../../service/global';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {


  public load_data = true;
  public filtro = '';
  public token: any;
  public productos: Array<any> = [];
  public url: any;
  public page = 1;
  public pageSize = 10;

  constructor(
    private _productoService: ProductoService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this._productoService.listar_producto_admin(this.filtro, this.token).subscribe(
      response => {
        this.productos = response.data;

        this.load_data = false;
      },
      error => {
        console.log(error);
        
      }
    );
  }

  filtrar() {
    if (this.filtro) {
      this._productoService.listar_producto_admin(this.filtro, this.token).subscribe(
        response => {
          this.productos = response.data;
  
          this.load_data = false;
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
        message: 'Igrese un filtro correcto'
      });
    }
  }

  reset() {
    this.filtro = '';
    this.init_data();
  }

}
