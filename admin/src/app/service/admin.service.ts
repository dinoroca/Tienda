import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { GLOBAL } from './global'

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public url;

  constructor(
    private _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  login_admin(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url + 'login_admin', data, { headers: headers });
  }

  obtener_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.get(this.url + 'obtener_admin/' + id, {headers : headers});
  }

  //Permite obtener el token almacenado en el localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  public isAutenticated(allowRoles: String[]): Boolean {

    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(<any>token);

      if (helper.isTokenExpired(token)) {
        localStorage.clear();
        return false;
      }

      if (!decodedToken) {
        //console.log('No es valido');
        localStorage.removeItem('token');
        return false;
      }
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }

    return allowRoles.includes(decodedToken['role']);
  }

  obtener_config_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_config_admin', { headers: headers });
  }

  agregar_imagen_banner_admin(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'authorization': token });
    const fd = new FormData();
    fd.append('_id', data._id);

    fd.append('imagen', data.imagen);
    return this._http.put(this.url + 'agregar_imagen_banner_admin/' + id, fd, { headers: headers });
  }

  eliminar_imagen_banner_admin(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'eliminar_imagen_banner_admin/' + id, data, { headers: headers });
  }
  
  actualizar_config_admin(id: any, data: any, token: any): Observable<any> {
    
    if (data.logo) {
      let headers = new HttpHeaders({ 'authorization': token });
      const fd = new FormData();
      fd.append('titulo', data.titulo);
      fd.append('serie', data.serie);
      fd.append('correlativo', data.correlativo);
      fd.append('categorias', JSON.stringify(data.categorias));
      fd.append('logo', data.logo);
      
      
      return this._http.put(this.url + 'actualizar_config_admin/' + id, fd, { headers: headers });
    } else {
      
      let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
      return this._http.put(this.url + 'actualizar_config_admin/' + id, data, { headers: headers });
    }
  }
  
  obtener_config_publico(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_config_publico', { headers: headers });
  }

  obtener_mensajes_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_mensajes_admin', { headers: headers });
  }

  cerrar_mensaje_admin(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'cerrar_mensaje_admin/' + id, data, { headers: headers });
  }

  obtener_ventas_admin(desde: any, hasta: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_ventas_admin/' + desde + '/' + hasta, { headers: headers });
  }

  obtener_venta_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_venta_admin/' + id, { headers: headers });
  }

  actualizar_ventas_enviado_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_ventas_enviado_admin/' + id, {data: true}, { headers: headers });
  }

  actualizar_ventas_recibido_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_ventas_recibido_admin/' + id, {data: true}, { headers: headers });
  }

  actualizar_ventas_procesando_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_ventas_procesando_admin/' + id, {data: true}, { headers: headers });
  }

  obtener_ventas_software_admin(desde: any, hasta: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_ventas_software_admin/' + desde + '/' + hasta, { headers: headers });
  }

  enviar_correo_confirmacion_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.get(this.url + 'enviar_correo_confirmacion_admin/' + id, {headers : headers});
  }

  enviar_correo_enviado_admin(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.post(this.url + 'enviar_correo_enviado_admin/' + id, data, {headers : headers});
  }

  obtener_venta_software_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_venta_software_admin/' + id, { headers: headers });
  }

  actualizar_venta_software_pagado_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_venta_software_pagado_admin/' + id, {data: true}, { headers: headers });
  }

  eliminar_venta_software_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.delete(this.url + 'eliminar_venta_software_admin/' + id, {headers : headers});
  }

  eliminar_reservacion_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.delete(this.url + 'eliminar_reservacion_admin/' + id, {headers : headers});
  }

  obtener_detalles_orden_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.get(this.url + 'obtener_detalles_orden_cliente/' + id, {headers : headers});
  }

  //KPI
  kpi_ganancias_mensuales_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.get(this.url + 'kpi_ganancias_mensuales_admin', {headers : headers});
  }

  kpi_ganancias_programas_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.get(this.url + 'kpi_ganancias_programas_admin', {headers : headers});
  }

  //Cuentas
  registro_cuenta_admin(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.post(this.url + 'registro_cuenta_admin', data, {headers : headers});
  }

  obtener_cuenta_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.get(this.url + 'obtener_cuenta_admin/' + id, {headers : headers});
  }

  obtener_cuentas_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.get(this.url + 'obtener_cuentas_admin', {headers : headers});
  }

  eliminar_cuenta_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.delete(this.url + 'eliminar_cuenta_admin/' + id, {headers : headers});
  }

  actualizar_cuenta_admin(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.put(this.url + 'actualizar_cuenta_admin/' + id, data, { headers: headers });
  }
}
