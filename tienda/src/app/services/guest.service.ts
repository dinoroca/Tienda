import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url;

  constructor(
    private _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  obtener_producto_slug(slug: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_producto_slug/' + slug, { headers: headers });
  }

  listar_productos_recomendados(categoria: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'listar_productos_recomendados/' + categoria, { headers: headers });
  }

  obtener_regiones(): Observable<any> {
    return this._http.get('./assets/regiones.json');
  }

  obtener_provincias(): Observable<any> {
    return this._http.get('./assets/provincias.json');
  }
  
  obtener_distritos(): Observable<any> {
    return this._http.get('./assets/distritos.json');
  }

  obtener_envios(): Observable<any> {
    return this._http.get('./assets/envios.json');
  }

}
