import { Component, OnInit,Input,Output,ElementRef,ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-plugin-colorschemes'
import * as tableau from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau.js';
import  ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  @Input() chartOptions:chartOptions;
  @Input() showChart:boolean=false;
  @Output() chartContainer:any;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    let chartDataSet:any[]=[];
    let chartDataElement:any={};
    console.log("-----------Line Chart---------------");
    console.log(this.chartOptions);
    console.log("--------------------------");

    if (this.chartOptions.multiple){
      for(let i=0;i< this.chartOptions.chartData.length;i++){
        chartDataElement={
          label:this.chartOptions.legendLabels[i],
          data:this.chartOptions.chartData[i],
          backgroundColor:tableau.Tableau20,
          fill:false,
          datalabels: {
            color: this.chartOptions.dataLabelColor ? this.chartOptions.dataLabelColor : '#ffff'
          }
        };
        chartDataSet.push(chartDataElement);
      }
    }
    else{
      chartDataElement={
          label:this.chartOptions.legendLabels[0],
          data:this.chartOptions.chartData,
          backgroundColor:tableau.Tableau20,
          fill:false,
          datalabels: {
            color: this.chartOptions.dataLabelColor ? this.chartOptions.dataLabelColor : '#ffff'
          }
      };
      chartDataSet.push(chartDataElement);
    }
    console.log(chartDataSet);
    this.chartContainer = new Chart(this.chartOptions.chartElementId, {
      plugins: [ChartDataLabels],
      type:  'line',
      data: {
        labels: this.chartOptions.chartLabels,
        datasets: chartDataSet
      },
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
          display: true
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
  chartElementId:string,
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
  multiple:boolean,
  dataLabelColor?:string,
  legendLabels?:string[]
}