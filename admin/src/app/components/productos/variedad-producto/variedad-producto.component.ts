import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../service/producto.service';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from '../../../service/global';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

@Component({
  selector: 'app-variedad-producto',
  templateUrl: './variedad-producto.component.html',
  styleUrls: ['./variedad-producto.component.css']
})
export class VariedadProductoComponent implements OnInit {

  public producto: any = {};
  public id: any;
  public token: any;
  public load_data = true;
  public load_btn = false;
  public url: any;

  public nueva_variedad = '';

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService,
  ) {

    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;

    this._route.params.subscribe(
      params => {
        this.id = params['id'];

        this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
          response => {

            if (response.data == undefined) {
              this.producto = undefined;
              this.load_data = false;
            } else {
              this.producto = response.data;
              this.load_data = false;
            }
            
          },
          error => {
          }
        );

      }
    );
  }

  ngOnInit(): void {
    
  }

  agregar_variedad() {
    if (this.nueva_variedad) {
      this.producto.variedades.push({titulo: this.nueva_variedad});
      this.nueva_variedad = '';

    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF634F',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe ingresar una variedad'
      });
    }
  }

  eliminar_variedad(idx: any) {
    this.producto.variedades.splice(idx, 1);
  }

  actualizar() {
    if (this.producto.titulo_variedad) {
      if (this.producto.variedades.length >= 1) {
        //Actualizar
        this.load_btn = true;
        this._productoService.actualizar_producto_variedades_admin({
          titulo_variedad: this.producto.titulo_variedad,
          variedades: this.producto.variedades
        }, this.id, this.token).subscribe(
          response => {

            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#35D18F',
              class: 'text-success',
              position: 'topRight',
              message: 'Se actualizó las variedades'
            });

            this.load_btn = false;
          }
        );

      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF634F',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe ingresar un almenos una variedad'
        });

        this.load_btn = false;
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF634F',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe ingresar un título'
      });

      this.load_btn = false;
    }
  }

}
