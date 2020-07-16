import { Component, OnInit,Input,Output,ElementRef,ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-plugin-colorschemes'
import * as tableau from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau.js';
import  ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-doughnut-pie-chart',
  templateUrl: './doughnut-pie-chart.component.html',
  styleUrls: ['./doughnut-pie-chart.component.css']
})
export class DoughnutPieChartComponent implements OnInit {
  @Input() chartOptions:chartOptions;
  @Input() showChart:boolean=false;
  @Output() chartContainer:any;

  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.chartContainer = new Chart(this.chartOptions.barChartElementId, {
      plugins: [ChartDataLabels],
      type:  this.chartOptions.chartType,
      data: {
        labels: this.chartOptions.chartLabels,
        datasets: [
          {
            data: this.chartOptions.chartData,
            fill: false,
            backgroundColor:tableau.Tableau20,
            datalabels: {
              color: '#fff'
            }
          }
          // ,
          // {
          //   data: [2,1,15,7],
          //   fill: false,
          //   backgroundColor:tableau.Tableau20,
          //   datalabels: {
          //     color: '#fff'
          //   }
          // }
        ]
      },
      options: {
        plugins: {
          colorschemes: {
            scheme:'tableau.Tableau20'
          },
          datalabels: {
            color: '#36A2EB',
            display:true
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              display:true,
              zeroLineColor:'black'
            },
            ticks: {
              fontSize: 12,
              suggestedMin: this.chartOptions.xTickSuggestedMin,
              stepSize: this.chartOptions.xTickStepSize
            },
            scaleLabel: {
              fontColor: "black",
              labelString: this.chartOptions.xAxisLabel,
              display: true,
              fontSize: 12
            }
          }],
          yAxes: [{
            display: true,
            gridLines: {
              display:false,
              zeroLineColor:'black'
            },
            ticks: {
              fontColor: "black",
              fontSize: 12,
              padding:8
            },
            scaleLabel: {
              fontColor: "black",
              fontSize: 12,
              labelString: this.chartOptions.yAxisLabel,
              display: true
            }
          }]
        }
      }
    });
  }


}



export interface chartOptions{
  chartType:string,
  barChartElementId:string,
  barChartType:string,
  chartLabels:string[],
  chartData:number[],
  xAxisLabel:string,
  yAxisLabel:string,
  xTickSuggestedMin?:number,
  yTickSuggestedMin?:number,
  xTickStepSize?:number,
  yTickStepSize?:number
}