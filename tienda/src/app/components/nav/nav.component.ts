import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public token: any;
  public id: any;
  public user: any = undefined;
  public user_lc: any = {};

  constructor(
    private _clienteService: ClienteService
  ) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');

    this.user_lc = undefined;

    if (this.token) {
      //Obtener usuario
      this._clienteService.obtener_cliente(this.id, this.token).subscribe(
        response => {
          this.user = response.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));

          if (localStorage.getItem('user_data')) {
            this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
          } else {
            this.user_lc = undefined;
          }
        },
        error => {
          console.log(error);
          this.user = undefined;
        }
      );
    }
  }

  ngOnInit(): void {
  }

}
