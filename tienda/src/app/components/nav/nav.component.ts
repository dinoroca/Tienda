import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';

declare var jQuery: any;
declare var $: any;

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
  public config_global: any = '';
  public op_cart = false;
  public carrito_arr: Array<any> = [];
  public url: any;
  public subtotal = 0;

  constructor(
    private _clienteService: ClienteService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
    this.url = GLOBAL.url;

    this.user_lc = undefined;

    this._clienteService.obtener_config_publico().subscribe(
      response => {
        //Asiganr los valores de las categorias del back
        this.config_global = response.data;
      }
    );

    if (this.token) {
      //Obtener usuario
      this._clienteService.obtener_cliente(this.id, this.token).subscribe(
        response => {
          this.user = response.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));

          if (localStorage.getItem('user_data')) {
            this.user_lc = JSON.parse(localStorage.getItem('user_data')!);

            this._clienteService.obtener_carrito_cliente(this.user_lc._id, this.token).subscribe(
              response => {
                this.carrito_arr = response.data;
                this.calcular_subtotal();
              }
            );
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

  logout() {
    window.location.reload();
    localStorage.clear();
    this._router.navigate(['/']);
  }

  op_modalcart() {
    if (!this.op_cart) {
      this.op_cart = true;
      $('#cart').addClass('show');
    } else {
      this.op_cart = false;
      $('#cart').removeClass('show');
    }
  }

  calcular_subtotal() {
    this.carrito_arr.forEach(element => {
      this.subtotal = this.subtotal + parseInt(element.producto.precio);
    });
  }

}
