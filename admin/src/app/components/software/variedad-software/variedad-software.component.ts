import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/service/global';
import { SoftwareService } from '../../../service/software.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };


@Component({
  selector: 'app-variedad-software',
  templateUrl: './variedad-software.component.html',
  styleUrls: ['./variedad-software.component.css']
})
export class VariedadSoftwareComponent implements OnInit {

  public programa: any = {};
  public id: any;
  public token: any;
  public load_data = true;
  public load_btn = false;
  public url: any;

  public nueva_variedad = '';

  constructor(
    private _route: ActivatedRoute,
    private _softwareService: SoftwareService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;

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
      this.programa.variedades.push({ titulo: this.nueva_variedad });
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
    this.programa.variedades.splice(idx, 1);
  }

  actualizar() {
    if (this.programa.titulo_variedad) {
      if (this.programa.variedades.length >= 1) {
        //Actualizar
        this.load_btn = true;
        this._softwareService.actualizar_software_variedades_admin({
          titulo_variedad: this.programa.titulo_variedad,
          variedades: this.programa.variedades
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
