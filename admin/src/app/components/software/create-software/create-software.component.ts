import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SoftwareService } from '../../../service/software.service';
import { AdminService } from '../../../service/admin.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-create-software',
  templateUrl: './create-software.component.html',
  styleUrls: ['./create-software.component.css']
})
export class CreateSoftwareComponent implements OnInit {

  public programa: any = {};
  public file: any = undefined;
  public imgSelect: any | ArrayBuffer = 'assets/img/01.jpg';

  public config: any = {};
  public token: any;
  public load_btn = false;

  constructor(
    private _router: Router,
    private _softwareService: SoftwareService
  ) {
    this.config = {
      height: 500
    }
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
  }

  registro(registroForm: any) {

    if (registroForm.valid) {

      if (this.file == undefined) {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF634F',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe subir una imagen de portada'
        });

      } else {
        this.load_btn = true;
        this._softwareService.registro_software_admin(this.programa, this.file, this.token).subscribe(
          response => {

            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#35D18F',
              class: 'text-success',
              position: 'topRight',
              message: 'Se registró el nuevo programa'
            });

            this.load_btn = false;
            this._router.navigate(['/panel/software']);

          },
          error => {
            console.log(error);
            this.load_btn = false;
          }
        );
      }

    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF634F',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos'
      });

      this.load_btn = false;

      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;
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
