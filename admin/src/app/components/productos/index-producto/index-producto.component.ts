import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../service/producto.service';
import { GLOBAL } from '../../../service/global';
import { Workbook } from "exceljs";
import * as fs from 'file-saver';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {


  public load_data = true;
  public filtro = '';
  public token: any;
  public productos: Array<any> = [];
  public arr_productos: Array<any> = [];
  public url: any;
  public page = 1;
  public pageSize = 10;

  public load_btn = false;

  constructor(
    private _productoService: ProductoService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this._productoService.listar_producto_admin(this.filtro, this.token).subscribe(
      response => {
        this.productos = response.data;
        this.productos.forEach(element => {
          this.arr_productos.push({
            titulo: element.titulo,
            stock: element.stock,
            precio: element.precio,
            categoria: element.categoria,
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
      this._productoService.listar_producto_admin(this.filtro, this.token).subscribe(
        response => {
          this.productos = response.data;
  
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

  eliminar(id: any) {

    this.load_btn = true;
    this._productoService.eliminar_producto_admin(id, this.token).subscribe(
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

  download_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de productos");

    worksheet.addRow(undefined);
    for (let x1 of this.arr_productos) {
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
      {header: 'Stock', key: 'col2', width: 15},
      {header: 'Precio', key: 'col3', width: 15},
      {header: 'Categoria', key: 'col4', width: 30},
      {header: 'N° Ventas', key: 'col5', width: 15}
    ] as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
    });
    
  }

}
