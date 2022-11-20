import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global'

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public url;

  constructor(
    private _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  login_cliente(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login_cliente', data, {headers : headers});
  }

  obtener_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.get(this.url + 'obtener_cliente/' + id, {headers : headers});
  }
}
