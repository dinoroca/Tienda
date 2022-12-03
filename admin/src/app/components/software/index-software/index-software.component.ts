import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../../../service/global';
import { Workbook } from "exceljs";
import * as fs from 'file-saver';
import { SoftwareService } from '../../../service/software.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-software',
  templateUrl: './index-software.component.html',
  styleUrls: ['./index-software.component.css']
})
export class IndexSoftwareComponent implements OnInit {

  public load_data = true;
  public filtro = '';
  public token: any;
  public programas: Array<any> = [];
  public arr_programas: Array<any> = [];
  public url: any;
  public page = 1;
  public pageSize = 10;

  public load_btn = false;

  constructor(
    private _softwareService: SoftwareService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this._softwareService.listar_software_admin(this.filtro, this.token).subscribe(
      response => {
        this.programas = response.data;
        this.programas.forEach(element => {
          this.arr_programas.push({
            titulo: element.titulo,
            precio: element.precio,
            link: element.link,
            nventas: element.nventas
          });
        });
        
        this.load_data = false;
      },
      error => {
        console.log(error);
        
      }
    );
  }

  filtrar() {
    if (this.filtro) {
      this._softwareService.listar_software_admin(this.filtro, this.token).subscribe(
        response => {
          this.programas = response.data;

          this.load_data = false;
        },
        error => {
          console.log(error);

        }
      );
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF634F',
        class: 'text-danger',
        position: 'topRight',
        message: 'Igrese un filtro correcto'
      });
    }
  }

  reset() {
    this.filtro = '';
    this.init_data();
  }

  download_excel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de productos");

    worksheet.addRow(undefined);
    for (let x1 of this.arr_programas) {
      let x2 = Object.keys(x1);

      let temp: any = [];
      for (let y of x2) {
        temp.push(x1[y]);
      }
      worksheet.addRow(temp);
    }

    let fname = 'LIB01-';

    worksheet.columns = [
      {header: 'Producto', key: 'col1', width: 30},
      {header: 'Precio', key: 'col3', width: 15},
      {header: 'Link', key: 'col4', width: 30},
      {header: 'N° Ventas', key: 'col5', width: 15}
    ] as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
    });
    
  }

  eliminar(id: any) {

    this.load_btn = true;
    this._softwareService.eliminar_software_admin(id, this.token).subscribe(
      response => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó el producto'
        });

        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.load_btn = false;
        this.init_data();
      },
      error => {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF634F',
          class: 'text-danger',
          position: 'topRight',
          message: 'Error en el servidor'
        });
        console.log(error);
        this.load_btn = false;
        
      }
    );
  }

}
