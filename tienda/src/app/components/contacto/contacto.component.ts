import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GuestService } from '../../services/guest.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  public contacto: any = {};
  public load_btn = false;

  constructor(
    private _title: Title,
    private _guestService: GuestService
  ) {
    localStorage.removeItem('ruta_actual');
    localStorage.removeItem('cantidad');
    localStorage.removeItem('variedad');
  }

  ngOnInit(): void {
    this._title.setTitle('Contacto');
  }

  registro(registroForm: any) {
    if(registroForm.valid) {
      this.load_btn = true;
      this._guestService.enviar_mensaje_contacto(this.contacto).subscribe(
        response =>{
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#35D18F',
            class: 'text-success',
            position: 'topRight',
            message: 'Se envió el mensaje'
          });

          this.contacto = {};
          this.load_btn = false;
        }
      );
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
