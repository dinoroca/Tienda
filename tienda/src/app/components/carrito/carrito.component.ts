import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/global';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  public token: any;
  public id: any;
  public url: any;
  public carrito_arr: Array<any> = [];
  public subtotal = 0;
  public total_pagar = 0;

  constructor(
    private _clienteService: ClienteService
  ) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
    this.url = GLOBAL.url;

    this._clienteService.obtener_carrito_cliente(this.id, this.token).subscribe(
      response => {
        this.carrito_arr = response.data;
        this.calcular_subtotal();
      }
    );
  }

  ngOnInit(): void {
  }

  calcular_subtotal() {
    this.carrito_arr.forEach(element => {
      this.subtotal = this.subtotal + parseInt(element.producto.precio);
    });

    //Tempratlemte //TODO: SE debe definir una funcion para calcular el total
    this.total_pagar = this.subtotal;
  }

}
