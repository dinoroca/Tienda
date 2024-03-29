import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../../service/producto.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery: any;
declare var $: any;

import { Workbook } from "exceljs";
import * as fs from 'file-saver';

@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css']
})
export class InventarioProductoComponent implements OnInit {

  public id: any;
  public token: any;
  public _iduser: any;
  public producto: any = {};
  public inventarios: Array<any> = [];
  public arr_inventario: Array<any> = [];
  public inventario: any = {};
  public load_btn = false;
  public load_data = true;

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService,
  ) {
    this.token = localStorage.getItem('token');
    this._iduser = localStorage.getItem('_id');
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this.id = params['id'];

        this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
          response => {

            if (response.data == undefined) {
              this.producto = undefined;
              this.load_data = false;
            } else {
              this.producto = response.data;

              this._productoService.listar_inventario_admin(this.producto._id, this.token).subscribe(
                response => {
                  this.inventarios = response.data;
                  this.inventarios.forEach(element => {
                    this.arr_inventario.push({
                      admin: element.admin.nombres + ' ' + element.admin.apellidos,
                      cantidad: element.cantidad,
                      proveedor: element.proveedor
                    });
                  });
                },
                error => {

                }
              );

              this.load_data = false;
            }

          },
          error => {
          }
        );

      }
    );
  }

  eliminar(id: any) {
    this.load_btn = true;
    this._productoService.eliminar_inventario_admin(id, this.token).subscribe(
      response => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#35D18F',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó el inventario'
        });

        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.load_btn = false;
        this._productoService.listar_inventario_admin(this.producto._id, this.token).subscribe(
          response => {
            console.log(response);
            this.inventarios = response.data;
          },
          error => {
            console.log(error);

          }
        );
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

  registro_inventario(inventarioForm: any) {

    if (inventarioForm.valid) {
      console.log(this.inventario);

      let data = {
        producto: this.producto._id,
        cantidad: inventarioForm.value.cantidad,
        admin: this._iduser,
        proveedor: inventarioForm.value.proveedor
      }

      console.log(data);
      

      this._productoService.registro_inventario_admin(data, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#35D18F',
            class: 'text-success',
            position: 'topRight',
            message: 'Se agregó el nuevo stock al producto'
          });

          this._productoService.listar_inventario_admin(this.producto._id, this.token).subscribe(
            response => {
              this.inventarios = response.data;
            },
            error => {

            }
          );
          
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
        message: 'Los datos del formulario no son válidos'
      });

    }
  }

  download_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de productos");

    worksheet.addRow(undefined);
    for (let x1 of this.arr_inventario) {
      let x2 = Object.keys(x1);

      let temp: any = [];
      for (let y of x2) {
        temp.push(x1[y]);
      }
      worksheet.addRow(temp);
    }

    let fname = 'LIB01-';

    worksheet.columns = [
      {header: 'Trabajador', key: 'col1', width: 30},
      {header: 'Cantidad', key: 'col2', width: 15},
      {header: 'Proveedor', key: 'col3', width: 30}
    ] as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
    });
    
  }

}
