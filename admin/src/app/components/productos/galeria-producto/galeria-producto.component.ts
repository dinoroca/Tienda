import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../../service/producto.service';
import { GLOBAL } from '../../../service/global';
import { v4 as uuidv4 } from 'uuid';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-galeria-producto',
  templateUrl: './galeria-producto.component.html',
  styleUrls: ['./galeria-producto.component.css']
})
export class GaleriaProductoComponent implements OnInit {

  public producto: any = {};
  public id: any;
  public token: any;
  public load_data = true;
  public load_btn = false;
  public url: any;
  public load_btn_eliminar = false;

  public file: File | any = undefined;

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService,
  ) {

    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;

    this._route.params.subscribe(
      params => {
        this.id = params['id'];

        this.init_data();

      }
    );
  }

  init_data() {
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

  ngOnInit(): void {
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

      $('#input-img').val('');

      this.file = undefined;
    }

    if (file.size <= 4000000) {
      if (file.type == 'image/png' || file.type == 'image/webp'
        || file.type == 'image/jpg' || file.type == 'image/jpeg'
        || file.type == 'image/gif') {

        const reader = new FileReader();

        reader.readAsDataURL(file);

        this.file = file;

      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF634F',
          class: 'text-danger',
          position: 'topRight',
          message: 'EL archivo debe ser una imagen'
        });

        $('#input-img').val('');

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

      $('#input-img').val('');

      this.file = undefined;
    }

    console.log(this.file);
    

  }

  subir_imagen() {

    var uuid = uuidv4();

    if (this.file != undefined) {

      console.log(uuidv4());

      let data = {
        imagen: this.file,
        _id: uuidv4()
      }

      console.log(data);

      this._productoService.agregar_imagen_galeria_admin(this.id, data, this.token).subscribe(
        response => {
          this.init_data();
          $('#input-img').val('');
        }
      );
      
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF634F',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe seleccionar una imagen'
      });
    }
  }

  eliminar(id: any) {

    this.load_btn_eliminar = true;
    this._productoService.eliminar_imagen_galeria_admin(this.id, {_id:id}, this.token).subscribe(
      response => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó la imagen'
        });

        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.load_btn_eliminar = false;
        this.init_data();
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
        this.load_btn_eliminar = false;
        
      }
    );
  }

}
