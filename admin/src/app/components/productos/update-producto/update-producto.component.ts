import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/service/global';
import { ProductoService } from '../../../service/producto.service';
import { AdminService } from '../../../service/admin.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-update-producto',
  templateUrl: './update-producto.component.html',
  styleUrls: ['./update-producto.component.css']
})
export class UpdateProductoComponent implements OnInit {

  public producto: any = {};
  public file: any = undefined;
  public config: any = {};
  public config_global: any = {};
  public imgSelect: any | ArrayBuffer;
  public load_btn = false;
  public load_data = true;
  public id: any;
  public token: any;
  public url: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _adminService: AdminService,
    private _productoService: ProductoService
  ) {
    this.config = {
      height: 500
    }

    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._adminService.obtener_config_publico().subscribe(
      response => {
        //Asiganr los valores de las categorias del back
        this.config_global = response.data;
      }
    );
  }

  ngOnInit(): void {
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
              this.imgSelect = this.url + 'obtener_portada/' + this.producto.portada;
              this.load_data = false;
            }

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
      
      var data: any = {};

      if (this.file != undefined) {
        data.portada = this.file;
      }

      data.titulo = this.producto.titulo;
      data.stock = this.producto.stock;
      data.precio = this.producto.precio;
      data.descuento = this.producto.descuento;
      data.categoria = this.producto.categoria;
      data.descripcion = this.producto.descripcion;
      data.contenido = this.producto.contenido;

      this.load_btn = true;
      this._productoService.actualizar_producto_admin(data, this.id, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#35D18F',
            class: 'text-success',
            position: 'topRight',
            message: 'Se actualizó el producto'
          });

          this.load_btn = false;
          this._router.navigate(['/panel/productos']);
        },
        error => {
          console.log(error);
          this.load_btn = false;
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

      this.load_btn = false;
    }
  }

  fileChangeEvent(event: any): void {
    var file: any;

    if (event.target.files && event.target.files[0]) {
      file = <File>event.target.files[0];

    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF634F',
        class: 'text-danger',
        position: 'topRight',
        message: 'No hay imagen en el envío'
      });
    }

    if (file.size <= 4000000) {
      if (file.type == 'image/png' || file.type == 'image/webp'
        || file.type == 'image/jpg' || file.type == 'image/jpeg'
        || file.type == 'image/gif') {

        const reader = new FileReader();
        reader.onload = e => this.imgSelect = reader.result;

        reader.readAsDataURL(file);

        $('#input-portada').text(file.name);

        this.file = file;

      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF634F',
          class: 'text-danger',
          position: 'topRight',
          message: 'EL archivo debe ser una imagen'
        });

        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect = 'assets/img/01.jpg';
        this.file = undefined;
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF634F',
        class: 'text-danger',
        position: 'topRight',
        message: 'La imagen no debe ser mayor a 4MB'
      });

      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;
    }

  }

}
