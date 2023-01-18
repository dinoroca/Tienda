import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { v4 as uuidv4 } from 'uuid';
import { GLOBAL } from '../../service/global';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  public token: any;
  public config: any = {};
  public url: any;
  public titulo_cat = '';
  public icono_cat = '';
  public file: File | any = undefined;
  public imgSelect: any | ArrayBuffer;

  public load_btn_eliminar = false;
  public load_data = true;
  public load_btn = false;

  constructor(
    private _adminService: AdminService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this.init_data();
  }

  ngOnInit(): void {
  }

  init_data() {
    this._adminService.obtener_config_admin(this.token).subscribe(
      response => {
        this.config = response.data;
        this.imgSelect = this.url + 'obtener_logo/' + this.config.logo;
        this.load_data = false;
      }
    );
  }

  agregar_cat() {
    var uuid = uuidv4();

    if (this.titulo_cat && this.icono_cat) {
      console.log(uuidv4());

      this.config.categorias.push({
        titulo: this.titulo_cat,
        icono: this.icono_cat,
        _id: uuidv4()
      });

      this.titulo_cat = '';
      this.icono_cat = '';

    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF634F',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe ingresar un título e ícono'
      });
    }
  }

  actualizar(configForm: any) {
    if (configForm.valid) {

      let data = {
        titulo: configForm.value.titulo,
        serie: configForm.value.serie,
        correlativo: configForm.value.correlativo,
        categorias: this.config.categorias,
        tipo_cambio: this.config.tipo_cambio,
        logo: this.file,
        mision: this.config.mision,
        vision: this.config.vision,
        term_cond: this.config.term_cond,
        politica_privacidad: this.config.politica_privacidad
      }

      console.log(data);
      
      this._adminService.actualizar_config_admin('637452564a440ec5894e43a7', data, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#35D18F',
            class: 'text-success',
            position: 'topRight',
            message: 'Se actualizó la configuración'
          });
        }
      );


    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF634F',
        class: 'text-danger',
        position: 'topRight',
        message: 'Complete correctamente los campos'
      });
    }

    window.location.reload();
    localStorage.setItem('nombre', '');
    localStorage.setItem('logo', '');
  }

  fileChangeEvent(event: any) {
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
        $('.cs-file-drop-icon').addClass('cs-file-drop-preview img-thumbnail rounded');
        $('.cs-file-drop-icon').removeClass('cs-file-drop-icon cxi-upload');
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

  fileChangeEventBan(event: any): void {
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

  ngDoCkeck(): void {
    //Permite subor imagen al detectar cambios
    $('.cs-file-drop-preview').html("<img src=\"" + this.imgSelect + "\">");
  }

  eliminar_categoria(idx: any) {
    this.config.categorias.splice(idx, 1);
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

      this._adminService.agregar_imagen_banner_admin('637452564a440ec5894e43a7', data, this.token).subscribe(
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
    this._adminService.eliminar_imagen_banner_admin('637452564a440ec5894e43a7', {_id:id}, this.token).subscribe(
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
