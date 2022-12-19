import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GuestService } from '../../services/guest.service';
import { Title } from '@angular/platform-browser';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/global';
import { saveAs } from 'file-saver';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var Cleave: any;
declare var paypal: any;

@Component({
  selector: 'app-show-sofware',
  templateUrl: './show-sofware.component.html',
  styleUrls: ['./show-sofware.component.css']
})
export class ShowSofwareComponent implements OnInit {

  @ViewChild('paypalButton', { static: true }) paypalElement!: ElementRef;
  public token: any;
  public id: any;
  public slug: any;
  public software: any = {};
  public url: any;
  public ruta_actual = '';

  public descuento_activo: any = undefined;
  public btn_cart = false;

  public subtotal = 0;
  public total_pagar = 0;
  public venta: any = {};
  public dventa: Array<any> = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _guestService: GuestService,
    private _clienteService: ClienteService,
    private _title: Title
  ) {
    this.ruta_actual = this._router.url;

    localStorage.setItem('ruta_actual', this.ruta_actual);

    this.url = GLOBAL.url;

    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
    this.venta.cliente = this.id;

    this._route.params.subscribe(
      params => {
        this.slug = params['slug'];

        this._guestService.obtener_software_slug(this.slug).subscribe(
          response => {
            this.software = response.data;
            this.total_pagar = this.software.precio;
          }
        );
      }
    );
  }

  ngOnInit(): void {
    this._title.setTitle('Software | ' + this.slug);
    //Obtener descuentos activos
    this._guestService.obtener_descuento_activo().subscribe(
      response => {

        if (response.data != undefined) {
          this.descuento_activo = response.data[0];
        } else {
          this.descuento_activo = undefined;
        }
      }
    );

    paypal.Buttons({
      style: {
        layout: 'horizontal'
      },
      createOrder: (data: any, actions: { order: { create: (arg0: { purchase_units: { description: string; amount: { currency_code: string; value: number; }; }[]; }) => any; }; }) => {

        return actions.order.create({
          purchase_units: [{
            description: 'Pago por software',
            amount: {
              currency_code: 'USD',
              value: this.total_pagar
            },
          }]
        });

      },
      onApprove: async (data: any, actions: { order: { capture: () => any; }; }) => {
        const order = await actions.order.capture();

        this.venta.transaccion = order.purchase_units[0].payments.captures[0].id;
        this.venta.subtotal = this.total_pagar;

        //Registrar venta de software lado cliente
        this._clienteService.registro_compra_software(this.venta, this.token).subscribe(
          response => {});

        //Descargar el archivo
        this.comprar();
        this._router.navigate(['/']);
      },
      onError: (err: any) => {

      },
      onCancel: function (data: any, actions: any) {

      }
    }).render(this.paypalElement.nativeElement);
  }

  comprar() {
    //Guardar archivo
    var FileSaver = require('file-saver');
    var blob = new Blob(['--------- Pasos para instalar --------- ' + this.software.slug
                        + '\n\n 1. Tutorial: ' + this.software.tutorial
                        + '\n 2. Link de descarga: ' + this.software.link], 
                        { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, this.software.slug + ".txt");
  }

}
