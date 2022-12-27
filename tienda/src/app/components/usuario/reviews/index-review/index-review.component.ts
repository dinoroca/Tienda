import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ClienteService } from '../../../../services/cliente.service';

@Component({
  selector: 'app-index-review',
  templateUrl: './index-review.component.html',
  styleUrls: ['./index-review.component.css']
})
export class IndexReviewComponent implements OnInit {

  public load_data = false;
  public id: any;
  public token: any;
  public reviews: Array<any> = [];

  public page = 1;
  public pageSize = 5;

  constructor(
    private _title: Title,
    private _clienteService: ClienteService
  ) {
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  ngOnInit(): void {
    this._title.setTitle('Perfil | Reseñas');

    this._clienteService.obtener_reviews_cliente(this.id, this.token).subscribe(
      response => {
        this.reviews = response.data;
      }
    );
  }

}
