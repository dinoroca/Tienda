import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/service/global';
import { AdminService } from '../../../service/admin.service';
import { SoftwareService } from '../../../service/software.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-update-software',
  templateUrl: './update-software.component.html',
  styleUrls: ['./update-software.component.css']
})
export class UpdateSoftwareComponent implements OnInit {

  public programa: any = {};
  public file: any = undefined;
  public config: any = {};
  public imgSelect: any | ArrayBuffer;
  public load_btn = false;
  public load_data = true;
  public id: any;
  public token: any;
  public url: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _softwareService: SoftwareService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this.id = params['id'];

        this._softwareService.obtener_software_admin(this.id, this.token).subscribe(
          response => {

            if (response.data == undefined) {
              this.programa = undefined;
              this.load_data = false;
            } else {
              this.programa = response.data;
              this.imgSelect = this.url + 'obtener_portada/' + this.programa.portada;
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

      data.titulo = this.programa.titulo;
      data.precio = this.programa.precio;
      data.link = this.programa.link;
      data.tutorial = this.programa.tutorial;
      data.descripcion = this.programa.descripcion;

      this.load_btn = true;
      this._softwareService.actualizar_software_admin(data, this.id, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#35D18F',
            class: 'text-success',
            position: 'topRight',
            message: 'Se actualizó el software'
          });

          this.load_btn = false;
          this._router.navigate(['/panel/software']);
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
