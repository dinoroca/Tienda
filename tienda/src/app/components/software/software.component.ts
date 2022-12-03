import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.css']
})
export class SoftwareComponent implements OnInit {

  public programas: Array<any> = [];
  public sort_by = 'Defecto';
  public page = 1;
  public pageSize = 12;
  public load_data = true;

  constructor(
    private _clienteService: ClienteService
  ) { }

  ngOnInit(): void {
  }

  orden_por() {
    if (this.sort_by == 'Defecto') {
      this._clienteService.listar_productos('').subscribe(
        response => {
          this.programas = response.data;
          this.load_data = false;
        }
      );
    } else if (this.sort_by == 'Popularidad') {
      this.programas.sort(function (a, b) {
        if (a.nventas < b.nventas) {
          return 1;
        }
        if (a.nventas > b.nventas) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == '+-precio') {
      this.programas.sort(function (a, b) {
        if (a.precio < b.precio) {
          return 1;
        }
        if (a.precio > b.precio) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == '-+precio') {
      this.programas.sort(function (a, b) {
        if (a.precio > b.precio) {
          return 1;
        }
        if (a.precio < b.precio) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == 'azTitulo') {
      this.programas.sort(function (a, b) {
        if (a.titulo > b.titulo) {
          return 1;
        }
        if (a.titulo < b.titulo) {
          return -1;
        }

        return 0;
      });
    } else if (this.sort_by == 'zaTitulo') {
      this.programas.sort(function (a, b) {
        if (a.titulo < b.titulo) {
          return 1;
        }
        if (a.titulo > b.titulo) {
          return -1;
        }

        return 0;
      });
    }
  }

}
