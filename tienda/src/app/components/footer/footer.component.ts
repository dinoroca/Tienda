import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/global';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public config_global: any = '';
  public url: any;

  public logo: any;
  public nombre: any;

  constructor(
    private _clienteService: ClienteService
  ) {
    this.url = GLOBAL.url;
    
    this._clienteService.obtener_config_publico().subscribe(
      response => {
        //Asiganr los valores de las categorias del back
        this.config_global = response.data;
        localStorage.setItem('logo', this.config_global.logo);
        localStorage.setItem('nombre', this.config_global.titulo);
      }
    );

    this.logo = localStorage.getItem('logo');
    this.nombre = localStorage.getItem('nombre');
  }

  ngOnInit(): void {
  }

}
