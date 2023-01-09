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
  public cuentas: Array<any> = [];
  public config_global: any = '';
  public tipo_cambio = 0;
  public url: any;

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
            this.venta.software = this.software._id;
            
          }
        );
      }
    );

    this._clienteService.obtener_config_publico().subscribe(
      response => {
        //Asiganr los valores de las categorias del back
        this.config_global = response.data;
        this.tipo_cambio = response.data.tipo_cambio;
      }
    );

    //Obtener cuentas
    this._clienteService.obtener_cuentas(this.token).subscribe(
      response => {
        this.cuentas = response.data;
      }
    );
  }

  ngOnInit(): void {
    this._title.setTitle('Software | ' + this.slug);

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
              value: Math.round(((this.total_pagar/this.tipo_cambio) + Number.EPSILON) * 100)/100
            },
          }]
        });

      },
      onApprove: async (data: any, actions: { order: { capture: () => any; }; }) => {
        const order = await actions.order.capture();

        this.venta.transaccion = order.purchase_units[0].payments.captures[0].id;
        this.venta.subtotal = this.total_pagar;
        this.venta.estado = 'Pagado';
        this.venta.descargado = 'Descargado';

        //Registrar venta de software lado cliente
        this._clienteService.registro_compra_software(this.venta, this.token).subscribe(
          response => {});

        //Descargar el archivo
        this.comprar();
        this._router.navigate(['/cuenta/software-compra']);
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

  pago_transferencia() {
    this.venta.transaccion = '111';
    this.venta.subtotal = this.total_pagar;
    this.venta.estado = 'Reservado';
    this.venta.descargado = 'NoDescargado';

    console.log(this.venta);
    //Registrar la venta mediante el método del controlador
    this._clienteService.registro_reservacion_software_cliente(this.venta, this.token).subscribe(
      response => {
        this._router.navigate(['/cuenta/software-compra']);
      }
    );
  }

}
