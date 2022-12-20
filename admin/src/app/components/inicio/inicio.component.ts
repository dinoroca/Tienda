import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public token: any;
  public chart: any;
  public ganancia_total = 0;
  public total_mes = 0;
  public total_mes_anterior = 0;
  public count_ventas = 0;

  public ganancia_total_programas = 0;
  public total_mes_programas = 0;
  public total_mes_anterior_programas = 0;
  public count_ventas_programas = 0;

  constructor(
    private _adminService: AdminService
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this._adminService.kpi_ganancias_mensuales_admin(this.token).subscribe(
      response => {
        this.ganancia_total = response.ganancia_total;
        this.total_mes = response.total_mes;
        this.total_mes_anterior = response.total_mes_anterior;
        this.count_ventas = response.count_ventas;
        this.chart = new Chart("MyChart", {
          type: 'bar', //this denotes tha type of chart

          data: {// values on X-Axis
            labels: ['Enero',
              'Febrero',
              'Marzo',
              'Abril',
              'Mayo',
              'Junio',
              'Julio',
              'Agosto',
              'Septiembre',
              'Octubre',
              'Noviembre',
              'Diciembre'],
            datasets: [
              {
                label: "Ventas en S/.",
                data: [response.enero,
                response.febrero,
                response.marzo,
                response.abril,
                response.mayo,
                response.junio,
                response.julio,
                response.agosto,
                response.septiembre,
                response.octubre, 
                response.noviembre,
                response.diciembre],
                backgroundColor: 'rgb(75, 192, 192)'
              } //,
              // {
              //   label: "Profit",
              //   data: ['542', '542', '536', '327', '17',
              // 				 '0.00', '538', '541'],
              //   backgroundColor: 'limegreen'
              // }  
            ]
          },
          options: {
            aspectRatio: 2.4
          }

        });

        this.chart = new Chart("MyChartnv", {
          type: 'bar', //this denotes tha type of chart

          data: {// values on X-Axis
            labels: ['Enero',
              'Febrero',
              'Marzo',
              'Abril',
              'Mayo',
              'Junio',
              'Julio',
              'Agosto',
              'Septiembre',
              'Octubre',
              'Noviembre',
              'Diciembre'],
            datasets: [
              {
                label: "Ventas en unidades.",
                data: [response.nv_enero,
                response.nv_febrero,
                response.nv_marzo,
                response.nv_abril,
                response.nv_mayo,
                response.nv_junio,
                response.nv_julio,
                response.nv_agosto,
                response.nv_septiembre,
                response.nv_octubre, 
                response.nv_noviembre,
                response.nv_diciembre],
                backgroundColor: 'rgb(83, 212, 123)'
              } //,
              // {
              //   label: "Profit",
              //   data: ['542', '542', '536', '327', '17',
              // 				 '0.00', '538', '541'],
              //   backgroundColor: 'limegreen'
              // }  
            ]
          },
          options: {
            aspectRatio: 2.4
          }

        });
      }
    );

    this._adminService.kpi_ganancias_programas_admin(this.token).subscribe(
      response => {
        this.ganancia_total_programas = response.ganancia_total;
        this.total_mes_programas = response.total_mes;
        this.total_mes_anterior_programas = response.total_mes_anterior;
        this.count_ventas_programas = response.count_ventas;
        this.chart = new Chart("MyChart1", {
          type: 'bar', //this denotes tha type of chart

          data: {// values on X-Axis
            labels: ['Enero',
              'Febrero',
              'Marzo',
              'Abril',
              'Mayo',
              'Junio',
              'Julio',
              'Agosto',
              'Septiembre',
              'Octubre',
              'Noviembre',
              'Diciembre'],
            datasets: [
              {
                label: "Ventas en S/.",
                data: [response.enero,
                response.febrero,
                response.marzo,
                response.abril,
                response.mayo,
                response.junio,
                response.julio,
                response.agosto,
                response.septiembre,
                response.octubre, 
                response.noviembre,
                response.diciembre],
                backgroundColor: 'rgb(149, 99, 255)'
              } //,
              // {
              //   label: "Profit",
              //   data: ['542', '542', '536', '327', '17',
              // 				 '0.00', '538', '541'],
              //   backgroundColor: 'limegreen'
              // }  
            ]
          },
          options: {
            aspectRatio: 2.4
          }

        });
      }
    );
  }

}
