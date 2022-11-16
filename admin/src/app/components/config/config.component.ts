import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { v4 as uuidv4 } from 'uuid';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  public token: any;
  public config: any = {};
  public titulo_cat = '';
  public icono_cat = '';

  constructor(
    private _adminService: AdminService
  ) {
    this.token = localStorage.getItem('token');
    this._adminService.obtener_config_admin(this.token).subscribe(
      response => {
        this.config = response.data;
      },
      error => {
        console.log(error);
        
      }
    );
  }

  ngOnInit(): void {
  }

  agregar_cat() {
    var uuid = uuidv4();

    if (this.titulo_cat && this.icono_cat) {
      console.log(uuidv4());
      
      this.config.categorias.push({
        titulo: this.titulo_cat,
        icono: this.icono_cat,
        _id : uuidv4()
      });

      this.titulo_cat = '';
      this.icono_cat = '';
      
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF634F',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe ingresar un título e ícono'
      });
    }
  }

}
