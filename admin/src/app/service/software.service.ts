import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GLOBAL } from './global'

@Injectable({
  providedIn: 'root'
})
export class SoftwareService {

  public url;

  constructor(
    private _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  registro_software_admin(data: any, file: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'authorization': token });
    const fd = new FormData();
    fd.append('titulo', data.titulo);
    fd.append('link', data.link);
    fd.append('precio', data.precio);
    fd.append('descripcion', data.descripcion);

    fd.append('portada', file);
    return this._http.post(this.url + 'registro_software_admin', fd, { headers: headers });
  }

  listar_software_admin(filtro: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'listar_software_admin/' + filtro, { headers: headers });
  }

  eliminar_software_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.delete(this.url + 'eliminar_software_admin/' + id, { headers: headers });
  }

  obtener_software_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_software_admin/' + id, { headers: headers });
  }

  actualizar_software_admin(data: any, id: any, token: any): Observable<any> {

    if (data.portada) {
      let headers = new HttpHeaders({ 'authorization': token });
      const fd = new FormData();
      fd.append('titulo', data.titulo);
      fd.append('link', data.link);
      fd.append('precio', data.precio);
      fd.append('descripcion', data.descripcion);

      fd.append('portada', data.portada);
      return this._http.put(this.url + 'actualizar_software_admin/' + id, fd, { headers: headers });
    } else {

      let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
      return this._http.put(this.url + 'actualizar_software_admin/' + id, data, { headers: headers });
    }

  }

  actualizar_software_variedades_admin(data: any, id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_software_variedades_admin/' + id, data, { headers: headers });
  }
}
