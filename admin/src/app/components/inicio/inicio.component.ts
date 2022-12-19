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

  constructor(
    private _adminService: AdminService
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_data();
    this.createChart();
  }

  init_data() {
    this._adminService.kpi_ganancias_mensuales_admin(this.token).subscribe(
      response => {
        console.log(response);
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
                backgroundColor: 'rgba(75, 192, 192, 0.7)'
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

  createChart() {

  }

}
