import { Component, OnInit } from '@angular/core';
import { faCogs, faCubes, faUsers, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js';
import { TicketsDashboardService  } from '../../services/dashboards/tickets-dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  faCogs = faCogs;
  faCubes = faCubes;
  faUsers = faUsers;
  faLightbulb = faLightbulb;
  
  openIssuesCount:number;
  closedIssuesCount:number;
  bugsVsOthersCount:number;
  highSeverityCount:number;

  chart;
  weatherDates;


  all_data = { "list": [{ "main": { "temp": 279.946, "temp_min": 279.946, "temp_max": 279.946, "pressure": 1016.76, "sea_level": 1024.45, "grnd_level": 1016.76, "humidity": 100 }, "wind": { "speed": 4.59, "deg": 163.001 }, "clouds": { "all": 92 }, "weather": [{ "id": 500, "main": "Rain", "description": "light rain", "icon": "10n" }], "rain": { "3h": 2.69 }, "dt": 1485717216 }, { "main": { "temp": 282.597, "temp_min": 282.597, "temp_max": 282.597, "pressure": 1012.12, "sea_level": 1019.71, "grnd_level": 1012.12, "humidity": 98 }, "wind": { "speed": 4.04, "deg": 226 }, "clouds": { "all": 92 }, "weather": [{ "id": 500, "main": "Rain", "description": "light rain", "icon": "10n" }], "rain": { "3h": 0.405 }, "dt": 1485745061 }, { "main": { "temp": 279.38, "pressure": 1011, "humidity": 93, "temp_min": 278.15, "temp_max": 280.15 }, "wind": { "speed": 2.6, "deg": 30 }, "clouds": { "all": 90 }, "weather": [{ "id": 701, "main": "Mist", "description": "mist", "icon": "50d" }, { "id": 741, "main": "Fog", "description": "fog", "icon": "50d" }], "dt": 1485768552 }] };
  constructor(
    private _serTicketDashboard:TicketsDashboardService
  ) { }

  ngOnInit(): void {
    this._serTicketDashboard.getDashboardTicketSummary()
        .subscribe(res=>{
          console.log(res);
          this.openIssuesCount=res['dbQryResponse']['issueStatusOpen'];
          this.closedIssuesCount=res['dbQryResponse']['issueStatusClosed'];
          this.bugsVsOthersCount=res['dbQryResponse']['issueTypeBug'];
          this.highSeverityCount=res['dbQryResponse']['SeverityHigh']+res['dbQryResponse']['SeverityCritical'];
        });
  }

  ngAfterViewInit() {
    let temp_max = this.all_data['list'].map(res => res.main.temp_max);
    let temp_min = this.all_data['list'].map(res => res.main.temp_min);
    let alldates = this.all_data['list'].map(res => res.dt)
    
    let weatherDates = []
    alldates.forEach((res) => {
        let jsdate = new Date(res * 1000)
        weatherDates.push(jsdate.toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' }))
    })
    console.log(temp_max);
    console.log(temp_min);
    console.log(this.weatherDates);

    this.chart = new Chart('id_noOfOpenIssues', {
      type: 'bar',
      data: {
        labels: this.weatherDates,
        datasets: [
          {
            data: temp_max,
            borderColor: "#3cba9f",
            fill: false
          },
          {
            data: temp_min,
            borderColor: "#ffcc00",
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });

    this.chart = new Chart('id_noOfClosedIssues', {
      type: 'bar',
      data: {
        labels: this.weatherDates,
        datasets: [
          {
            data: temp_max,
            borderColor: "#3cba9f",
            fill: false
          },
          {
            data: temp_min,
            borderColor: "#ffcc00",
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });

    this.chart = new Chart('id_noOfBugsVsOthersIssues', {
      type: 'bar',
      data: {
        labels: this.weatherDates,
        datasets: [
          {
            data: temp_max,
            borderColor: "#3cba9f",
            fill: false
          },
          {
            data: temp_min,
            borderColor: "#ffcc00",
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });

    this.chart = new Chart('id_noOfHighSeverityIssues', {
      type: 'bar',
      data: {
        labels: this.weatherDates,
        datasets: [
          {
            data: temp_max,
            borderColor: "#3cba9f",
            fill: false
          },
          {
            data: temp_min,
            borderColor: "#ffcc00",
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }


}
