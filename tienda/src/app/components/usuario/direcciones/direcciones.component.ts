import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GuestService } from '../../../services/guest.service';
import { Title } from '@angular/platform-browser';

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
    principal: false,
  };

  public direcciones: Array<any> = [];

  public regiones: Array<any> = [];
  public provincias: Array<any> = [];
  public distritos: Array<any> = [];

  public regiones_arr: Array<any> = [];
  public provincias_arr: Array<any> = [];
  public distritos_arr: Array<any> = [];

  public load_direcciones = true;

  constructor(
    private _guestService: GuestService,
    private _clienteService: ClienteService,
    private _title: Title
  ) {
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');

    this._guestService.obtener_regiones().subscribe(
      response => {
        this.regiones_arr = response;
      }
    );

    this._guestService.obtener_provincias().subscribe(
      response => {
        this.provincias_arr = response;
      }
    );

    this._guestService.obtener_distritos().subscribe(
      response => {
        this.distritos_arr = response;
      }
    );
  }

  ngOnInit(): void {
    this._title.setTitle('Perfil | Direcciones');
    this.obtener_direcciones();
  }

  obtener_direcciones() {
    this._clienteService.obtener_direcciones_cliente(localStorage.getItem('_id') || sessionStorage.getItem('_id'), this.token).subscribe(
      response => {
        this.direcciones = response.data;
        this.load_direcciones = false;
      }
    );
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

  registrar(registroForm: any) {

    this.regiones_arr.forEach(element => {
      if (parseInt(element.id) == parseInt(this.direccion.region)) {
        this.direccion.region = element.name;
      }
    });

    this.provincias_arr.forEach(element => {
      if (parseInt(element.id) == parseInt(this.direccion.provincia)) {
        this.direccion.provincia = element.name;
      }
    });

    this.distritos_arr.forEach(element => {
      if (parseInt(element.id) == parseInt(this.direccion.distrito)) {
        this.direccion.distrito = element.name;
      }
    });

    if (registroForm.valid) {
      let data = {
        destinatario: this.direccion.destinatario,
        dni: this.direccion.dni,
        zip: this.direccion.zip,
        telefono: this.direccion.telefono,
        direccion: this.direccion.direccion,
        pais: this.direccion.pais,
        region: this.direccion.region,
        provincia: this.direccion.provincia,
        distrito: this.direccion.distrito,
        principal: this.direccion.principal,
        cliente: localStorage.getItem('_id') || sessionStorage.getItem('_id')
      }

      this._clienteService.registro_direccion_cliente(data, this.token).subscribe(
        response => {
          this.direccion = {
            pais: '',
            region: '',
            provincia: '',
            distrito: '',
            principal: false,
          };

          $('#region').prop('disabled', true);
          $('#provincia').prop('disabled', true);
          $('#distrito').prop('disabled', true);

          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#35D18F',
            class: 'text-success',
            position: 'topRight',
            message: 'Se registró la nueva dirección'
          });

          this.obtener_direcciones();
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
    }
  }

  establcer_principal(id: any) {
    this._clienteService.cambiar_direccion_principal(id, localStorage.getItem('_id') || sessionStorage.getItem('_id'), this.token).subscribe(
      response => {
        this.obtener_direcciones();
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Se actualizó la dirección de entrega'
        });
      }
    );
  }

  eliminar_direccion(id: any) {
    this._clienteService.eliminar_direccion_cliente(id, this.token).subscribe(
      response => {
        this.obtener_direcciones();
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó la dirección'
        });
      }
    );
  }

}
