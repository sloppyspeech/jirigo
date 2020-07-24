import { Component, OnInit,Input,Output,ElementRef,ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-plugin-colorschemes'
import * as tableau from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau.js';
import  ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  @Input() chartOptions:chartOptions;
  @Input() showChart:boolean=false;
  @Output() chartContainer:any;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    let chartDataSets=[];
    if (this.chartOptions.barChartType == 'horizontalBarGrouped'){

      for(let i=0;i<this.chartOptions.chartData.length;i++){
        chartDataSets.push({
          label: this.chartOptions.legendLabels[i],
          data: this.chartOptions.chartData[i],
          fill: false,
          datalabels: {
            color: '#fff'
          }
        });
      }

    }
    else{
      chartDataSets.push({
            data: this.chartOptions.chartData,
            fill: false,
            backgroundColor:tableau.Tableau20,
            datalabels: {
              color: '#fff'
            }
        });
    }
    console.log("--------------------------");
    console.log(this.chartOptions);
    console.log("--------------------------");
    this.chartContainer = new Chart(this.chartOptions.barChartElementId, {
      plugins: [ChartDataLabels],
      type:  this.chartOptions.chartType,
      data: {
        labels: this.chartOptions.chartLabels,
        datasets: chartDataSets
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
            stacked:this.chartOptions.stacked,
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
            stacked:this.chartOptions.stacked,
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
  barChartElementId:string,
  barChartType:string,
  chartLabels:string[],
  chartData:number[],
  xAxisLabel:string,
  yAxisLabel:string,
  xTickSuggestedMin?:number,
  yTickSuggestedMin?:number,
  xTickStepSize?:number,
  yTickStepSize?:number,
  stacked?:boolean,
  displayTitle?:boolean,
  titleText?:string,
  legendDisplay?:boolean,
  legendLabels?:string[]
}
