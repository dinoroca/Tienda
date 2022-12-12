import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/service/global';
import { ProductoService } from '../../../service/producto.service';

@Component({
  selector: 'app-reviews-producto',
  templateUrl: './reviews-producto.component.html',
  styleUrls: ['./reviews-producto.component.css']
})
export class ReviewsProductoComponent implements OnInit {

  public id: any;
  public token: any;
  public _iduser: any;
  public producto: any = {};
  public reviews: Array<any> = [];
  public load_btn = false;
  public load_data = true;
  public url: any;

  public page = 1;
  public pageSize = 10;

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService,
  ) {
    this.token = localStorage.getItem('token');
    this._iduser = localStorage.getItem('_id');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this.id = params['id'];

        this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
          response => {

            if (response.data == undefined) {
              this.producto = undefined;
              this.load_data = false;
            } else {
              this.producto = response.data;
              this._productoService.obtener_reviews_producto(this.producto._id).subscribe(
                response => {
                  this.reviews = response.data;
                }
              );

              this.load_data = false;
            }

          },
          error => {
          }
        );

      }
    );
  }

}
