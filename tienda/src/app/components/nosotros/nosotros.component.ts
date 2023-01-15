import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent implements OnInit {

  public config_global: any = '';

  constructor(
    private _clienteService: ClienteService,
    private _title: Title
  ) {

    localStorage.removeItem('ruta_actual');
    localStorage.removeItem('cantidad');
    localStorage.removeItem('variedad');
    
    this._clienteService.obtener_config_publico().subscribe(
      response => {
        //Asignar los valores de las categorias del back
        this.config_global = response.data;
      }
    );
  }

  ngOnInit(): void {
    this._title.setTitle('Nosotros');
  }

}
