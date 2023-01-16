import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ClienteService } from '../../../services/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { StarRatingComponent } from 'ng-starrating';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.css']
})
export class DetalleOrdenComponent implements OnInit {

  public url: any;
  public token: any;
  public orden: any = {};
  public detalles: Array<any> = [];
  public load_data = true;
  public id: any;

  public total_star = 5;
  public review: any = {};
  public load_btn = false;

  constructor(
    private _title: Title,
    private _clienteService: ClienteService,
    private _route: ActivatedRoute
  ) {
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');

    this.url = GLOBAL.url;

    this._route.params.subscribe(
      params => {
        this.id = params['id'];

        this.init_data();
      }
    );
  }

  ngOnInit(): void {
    this._title.setTitle('Perfil | Detalle de orden');
  }

  init_data() {

    this._clienteService.obtener_detalles_orden_cliente(this.id, this.token).subscribe(
      response => {

        if (response.data != undefined) {
          this.orden = response.data;

          response.detalles.forEach((element: { producto: { _id: any; }; estado: boolean; }) => {
            this._clienteService.obtener_review_producto_cliente(element.producto._id).subscribe(
              response => {
                let emitido = false;

                response.data.forEach((element_: { cliente: string | null; }) => {
                  if (element_.cliente == localStorage.getItem('_id')) {
                    emitido = true;
                  }
                });

                element.estado = emitido;
              }
            );
          });

          this.detalles = response.detalles;
          this.load_data = false;
          this.total_star = 5;
        } else {
          this.orden = undefined;
        }
      }
    );
  }

  openModal(item: any) {
    this.review = {};
    this.review.producto = item.producto._id;
    this.review.cliente = item.cliente;
    this.review.venta = this.id;
  }

  onRate($event: {oldValue: number, newValue: number, starRating: StarRatingComponent}) {
    this.total_star = $event.newValue;
  }

  emitir(id: any) {
    if (this.review.review) {
      if (this.total_star && this.total_star >= 0) {
        this.review.estrellas = this.total_star;
        
        this._clienteService.emitir_review_producto_cliente(this.review, this.token).subscribe(
          response => {
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#35D18F',
              class: 'text-success',
              position: 'topRight',
              message: 'Se envió la reseña'
            });

            $('#review-' + id).modal('hide');
            $('.modal-backdrop').removeClass('show');

            this.init_data();
          }
        );
        
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF634F',
          class: 'text-danger',
          position: 'topRight',
          message: 'Ingrese un número de estrellas'
        });
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF634F',
        class: 'text-danger',
        position: 'topRight',
        message: 'Ingrese un mensaje'
      });
    }
  }

  cambiar_estado_recibido(id: any) {
    this.load_btn = true;
    this._clienteService.actualizar_ventas_recibido(id, this.token).subscribe(
      response => {        
        this._clienteService.enviar_correo_recepcion_admin(id, this.token).subscribe(
          response => {
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#35D18F',
              class: 'text-success',
              position: 'topRight',
              message: 'Correo enviado'
            });
          }
        );

        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Estado: Recibido'
        });

        $('#recibe-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.load_btn = false;
        this.init_data();
      }
    );
  }

}
