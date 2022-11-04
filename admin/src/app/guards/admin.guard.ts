import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AdminService } from '../service/admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private _adminService: AdminService,
    private _router: Router
  ){}

  canActivate(): any {
    if(!this._adminService.isAutenticated(['admin'])){
      this._router.navigate(['/login']);
      return false;
    }
    return true;
  }
  
}
