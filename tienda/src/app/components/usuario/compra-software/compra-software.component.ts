import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-compra-software',
  templateUrl: './compra-software.component.html',
  styleUrls: ['./compra-software.component.css']
})
export class CompraSoftwareComponent implements OnInit {

  public url: any;
  public token: any;
  public id: any;
  public ordenes: Array<any> = [];
  public load_data = true;

  public page = 1;
  public pageSize = 5;

  constructor(
    private _clienteService: ClienteService,
    private _title: Title
  ) {
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
  }

  ngOnInit(): void {
    this._title.setTitle('Perfil | Programas');
    this.init_data();
  }

  init_data() {
    this._clienteService.obtener_ventas_software( this.id, this.token).subscribe(
      response => {
        this.ordenes = response.data;
        this.load_data = false;
      }
    );
  }
}
