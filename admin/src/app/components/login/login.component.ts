import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';

declare var jQuery: any;
declare var $: any;

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: any = {};
  public usuario: any = {};
  public token: any;
  public show = false;

  constructor(
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    if (this.token) {
      this._router.navigate(['/']);
    }
  }

  show_password() {
    if (!this.show) {
      this.show = true;
      $('#signin-password').attr('type', 'text');
    } else {
      this.show = false;
      $('#signin-password').attr('type', 'password');
    }
  }

  login(loginForm: { valid: any; }) {
    
    if(loginForm.valid) {
      let data = {
        email: this.user.email,
        password: this.user.password
      };

      this._adminService.login_admin(data).subscribe(
        response => {
          if(response.data == undefined) {
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FF634F',
              class: 'text-danger',
              position: 'topRight',
              message: response.message
            });
          }else{
            this.usuario = response.data;

            localStorage.setItem('token', response.token);
            localStorage.setItem('_id', response.data._id);

            this._router.navigate(['/']);
          }
        }, error => {
          console.log(error);
        });

    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF634F',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos'
      });
    }
  }

}
