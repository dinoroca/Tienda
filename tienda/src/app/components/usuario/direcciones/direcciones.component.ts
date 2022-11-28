import { Component, OnInit } from '@angular/core';
import { GuestService } from '../../../services/guest.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css']
})
export class DireccionesComponent implements OnInit {

  public token: any;

  public direccion: any = {
    pais: '',
    region: '',
    provincia: '',
    distrito: '',
    principal: true,
  };

  public regiones: Array<any> = [];
  public provincias: Array<any> = [];
  public distritos: Array<any> = [];

  constructor(
    private _guestService: GuestService
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
  }

  select_pais() {
    if (this.direccion.pais == 'Peru') {
      $('#region').prop('disabled', false);
      this._guestService.obtener_regiones().subscribe(
        response => {
          response.forEach((element: { id: any; name: any; }) => {
            this.regiones.push({
              id: element.id,
              name: element.name
            });
          });
        }
      );

    } else {
      $('#region').prop('disabled', true);
      $('#provincia').prop('disabled', true);
      $('#distrito').prop('disabled', true);
      this.regiones = [];
      this.provincias = [];

      this.direccion.region = '';
      this.direccion.provincia = '';
      this.direccion.distrito = '';
    }
  }

  select_region() {
    this.provincias = [];
    $('#provincia').prop('disabled', false);
    $('#distrito').prop('disabled', true);
    this.direccion.provincia = '';
    this.direccion.distrito = '';
    this._guestService.obtener_provincias().subscribe(
      response => {
        response.forEach((element: { department_id: any; }) => {
          if (element.department_id == this.direccion.region) {
            this.provincias.push(element);
          }
        });
      }
    );
  }

  select_provincia() {
    this.distritos = [];
    $('#distrito').prop('disabled', false);
    this.direccion.distrito = '';

    this._guestService.obtener_distritos().subscribe(
      response => {
        response.forEach((element: { province_id: any; }) => {
          if (element.province_id == this.direccion.provincia) {
            this.distritos.push(element);
          }
        });
      }
    );
  }

}
