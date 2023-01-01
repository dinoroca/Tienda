import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-term-condiciones',
  templateUrl: './term-condiciones.component.html',
  styleUrls: ['./term-condiciones.component.css']
})
export class TermCondicionesComponent implements OnInit {

  public config_global: any = '';

  constructor(
    private _clienteService: ClienteService,
    private _title: Title
  ) {
    this._clienteService.obtener_config_publico().subscribe(
      response => {
        //Asignar los valores de las categorias del back
        this.config_global = response.data;
      }
    );
  }

  ngOnInit(): void {
    this._title.setTitle('Términos y condiciones');
  }

}
