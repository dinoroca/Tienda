import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.css']
})
export class DetalleOrdenComponent implements OnInit {

  constructor(
    private _title: Title
  ) { }

  ngOnInit(): void {
    this._title.setTitle('Perfil | Detalle de orden');
  }

}
