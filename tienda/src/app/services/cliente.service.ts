import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
import { JwtHelperService } from "@auth0/angular-jwt";

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

  
  actualizar_perfil_cliente(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.put(this.url + 'actualizar_perfil_cliente/' + id, data, {headers : headers});
  }
  
  public isAutenticated(): Boolean {
    
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
        localStorage.clear();
        return false;
      }
    } catch (error) {
      localStorage.clear();
      return false;
    }
    
    return true;
  }
  
  obtener_config_publico(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_config_publico', { headers: headers });
  }
  
  listar_productos(filtro: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'listar_productos/' + filtro, { headers: headers });
  }

  agregar_carrito_cliente(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.post(this.url + 'agregar_carrito_cliente', data, {headers : headers});
  }

  obtener_carrito_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.get(this.url + 'obtener_carrito_cliente/' + id, {headers : headers});
  }

  eliminar_carrito_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.delete(this.url + 'eliminar_carrito_cliente/' + id, {headers : headers});
  }
  
  registro_cliente(data: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this._http.post(this.url + 'registro_cliente', data, {headers : headers});
  }
  
  registro_direccion_cliente(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.post(this.url + 'registro_direccion_cliente', data, {headers : headers});
  }

  
  obtener_direcciones_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.get(this.url + 'obtener_direcciones_cliente/' + id, {headers : headers});
  }
  
  cambiar_direccion_principal(id: any, cliente: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.put(this.url + 'cambiar_direccion_principal/' + id + '/' + cliente, {data: true}, {headers : headers});
  }
  
  eliminar_direccion_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.delete(this.url + 'eliminar_direccion_cliente/' + id, {headers : headers});
  }
  
  obtener_direccion_principal_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.get(this.url + 'obtener_direccion_principal_cliente/' + id, {headers : headers});
  }

  registro_compra_cliente(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'authorization': token});
    return this._http.post(this.url + 'registro_compra_cliente', data, {headers : headers});
  }

  listar_software(filtro: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'listar_software/' + filtro, { headers: headers });
  }
}