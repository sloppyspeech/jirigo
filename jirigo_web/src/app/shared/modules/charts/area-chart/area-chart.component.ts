import { Component, OnInit,Input,Output,ElementRef,ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-plugin-colorschemes'
import * as tableau from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau.js';
import  ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css']
})
export class AreaChartComponent implements OnInit {
  @Input() showChart:boolean=false;
  @Input() chartOptions:chartOptions;
  @Output() chartContainer:any;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    let chartDataSets=[];
    console.log("--------------------------");
    console.log(this.chartOptions);
    console.log("--------------------------");
    for(let i=0;i<this.chartOptions.chartData.length;i++){
      chartDataSets.push({
        label: this.chartOptions.legendLabels[i],
        data: this.chartOptions.chartData[i],
        fill: 'origin',
        datalabels: {
          color: '#fff'
        }
      });
    }
    this.chartContainer = new Chart(this.chartOptions.areaChartElementId, {
      plugins: [ChartDataLabels],
      type:  this.chartOptions.chartType,
      data: {
        labels: this.chartOptions.chartLabels,
        datasets: this.chartOptions.chartData
      }
      ,
      options: {
        title:{
          display:this.chartOptions.displayTitle,
          text:this.chartOptions.titleText
        },
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
          display: this.chartOptions.legendDisplay
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
              suggestedMin: this.chartOptions.yTickSuggestedMin,
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
    areaChartElementId:string,
    areaChartType:string,
    chartLabels:string[],
    chartData:any[],
    xAxisLabel:string,
    yAxisLabel:string,
    xTickSuggestedMin?:number,
    yTickSuggestedMin?:number,
    xTickStepSize?:number,
    yTickStepSize?:number,
    displayTitle?:boolean,
    titleText?:string,
    legendDisplay?:boolean,
    legendLabels?:string[]
  }
  
