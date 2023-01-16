import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ClienteService } from 'src/app/services/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';

@Component({
  selector: 'app-compra-software-det',
  templateUrl: './compra-software-det.component.html',
  styleUrls: ['./compra-software-det.component.css']
})
export class CompraSoftwareDetComponent implements OnInit {

  public token: any;
  public orden: any = {};
  public load_data = true;
  public id: any;
  public url: any;

  constructor(
    private _title: Title,
    private _clienteService: ClienteService,
    private _route: ActivatedRoute
  ) {
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.url = GLOBAL.url;

    this._route.params.subscribe(
      params => {
        this.id = params['id'];

        this.init_data();
      }
    );
  }

  ngOnInit(): void {
    this._title.setTitle('Perfil | Detalle de programas');
  }

  init_data() {

    this._clienteService.obtener_detalles_venta_software(this.id, this.token).subscribe(
      response => {

        if (response.data != undefined) {
          this.orden = response.data;
        } else {
          this.orden = undefined;
        }
      }
    );
  }

  comprar() {
    //Guardar archivo
    var FileSaver = require('file-saver');
    var blob = new Blob(['--------- Pasos para instalar --------- ' + this.orden.software.slug
                        + '\n\n 1. Tutorial: ' + this.orden.software.tutorial
                        + '\n 2. Link de descarga: ' + this.orden.software.link], 
                        { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, this.orden.software.slug + ".txt");

    //Eliminar botón desde back
    this._clienteService.actualizar_venta_software_descargado(this.id, this.token).subscribe(
      response => {
        this.init_data();
      }
    );
  }
}
