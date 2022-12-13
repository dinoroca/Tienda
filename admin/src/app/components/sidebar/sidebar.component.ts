import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/service/global';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public token: any;
  public id: any;
  public configuracion: any = {};
  public url: any;
  public logo: any;
  public nombre: any;
  public user: any = undefined;
  public user_lc: any = {};

  constructor(
    private _router: Router,
    private _adminService: AdminService
  ) {
    this.token = this._adminService.getToken();
    this.id = localStorage.getItem('_id');
    this.url = GLOBAL.url;
    this.logo = localStorage.getItem('logo');
    this.nombre = localStorage.getItem('nombre');
    this._adminService.obtener_config_publico().subscribe(
      response => {
        //Asiganr los valores de las categorias del back
        this.configuracion = response.data;

        if (this.logo == '' || this.logo == undefined) {
          this.logo = response.data.logo;
          localStorage.setItem('logo', this.logo);
        } else {
          this.logo = localStorage.getItem('logo');
        }

        if (this.nombre == '' || this.nombre == undefined) {
          this.nombre = response.data.titulo;
          localStorage.setItem('nombre', this.nombre);
        } else {
          this.nombre = localStorage.getItem('nombre');
        }
      }
    );
  }

  ngOnInit(): void {
    this._adminService.obtener_admin(this.id, this.token).subscribe(
      response => {
        this.user = response.data;
        localStorage.setItem('user_data', JSON.stringify(this.user));
        if (localStorage.getItem('user_data')) {
          this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
          
        } else {
          this.user_lc = undefined;
        }
      }
    );
  }

  cerrar_sesion() {
    localStorage.clear();
    this._router.navigate(['/login']);
  }

}
