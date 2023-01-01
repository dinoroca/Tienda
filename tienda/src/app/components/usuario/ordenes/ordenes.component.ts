import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.css']
})
export class OrdenesComponent implements OnInit {

  public url: any;
  public token: any;
  public ordenes: Array<any> = [];
  public load_data = true;

  public page = 1;
  public pageSize = 5;

  constructor(
    private _clienteService: ClienteService,
    private _title: Title
  ) {
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  ngOnInit(): void {
    this._title.setTitle('Perfil | Órdenes');
    this.init_data();
  }

  init_data() {
    this._clienteService.obtener_ordenes_cliente(localStorage.getItem('_id') || sessionStorage.getItem('_id'), this.token).subscribe(
      response => {
        this.ordenes = response.data;
        this.load_data = false;
      }
    );
  }

}
