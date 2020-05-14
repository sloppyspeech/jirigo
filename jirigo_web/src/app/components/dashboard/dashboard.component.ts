import { Component, OnInit } from '@angular/core';
import { faCogs, faCubes, faUsers, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js';
import { TicketsDashboardService } from '../../services/dashboards/tickets-dashboard.service';
import 'chartjs-plugin-colorschemes';
import { compileNgModule } from '@angular/compiler';

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

  openIssuesCount: number = 0;
  closedIssuesCount: number = 0;
  bugsVsOthersCount: number = 0;
  highSeverityCount: number = 0;

  ticket_smry_by_isst_count: any[] = [];
  ticket_smry_by_isst_label: any[] = [];

  ticket_smry_by_istyp_count: any[] = [];
  ticket_smry_by_istyp_label: any[] = [];

  chart;
  chart2;
  weatherDates = [];


  all_data = { "list": [{ "main": { "temp": 279.946, "temp_min": 279.946, "temp_max": 279.946, "pressure": 1016.76, "sea_level": 1024.45, "grnd_level": 1016.76, "humidity": 100 }, "wind": { "speed": 4.59, "deg": 163.001 }, "clouds": { "all": 92 }, "weather": [{ "id": 500, "main": "Rain", "description": "light rain", "icon": "10n" }], "rain": { "3h": 2.69 }, "dt": 1485717216 }, { "main": { "temp": 282.597, "temp_min": 282.597, "temp_max": 282.597, "pressure": 1012.12, "sea_level": 1019.71, "grnd_level": 1012.12, "humidity": 98 }, "wind": { "speed": 4.04, "deg": 226 }, "clouds": { "all": 92 }, "weather": [{ "id": 500, "main": "Rain", "description": "light rain", "icon": "10n" }], "rain": { "3h": 0.405 }, "dt": 1485745061 }, { "main": { "temp": 279.38, "pressure": 1011, "humidity": 93, "temp_min": 278.15, "temp_max": 280.15 }, "wind": { "speed": 2.6, "deg": 30 }, "clouds": { "all": 90 }, "weather": [{ "id": 701, "main": "Mist", "description": "mist", "icon": "50d" }, { "id": 741, "main": "Fog", "description": "fog", "icon": "50d" }], "dt": 1485768552 }] };
  constructor(
    private _serTicketDashboard: TicketsDashboardService
  ) { }

  ngOnInit(): void {

    this._serTicketDashboard.getDashboardTicketGenericSummary()
      .subscribe(res => {
        console.log(res);
        this.openIssuesCount = res['dbQryResponse']['issueStatusOpen'];
        this.closedIssuesCount = res['dbQryResponse']['issueStatusClosed'];
        this.bugsVsOthersCount = res['dbQryResponse']['issueTypeBug'];
        this.highSeverityCount = res['dbQryResponse']['SeverityHigh'] + res['dbQryResponse']['SeverityCritical'];
      });

    this._serTicketDashboard.getDashboardTicketSummaryByIssueStatus()
      .subscribe(res => {
        console.log("===============================");
        console.log(res['dbQryResponse']);
        res['dbQryResponse'].forEach(e => {
          this.ticket_smry_by_isst_count.push(e['count']);
          this.ticket_smry_by_isst_label.push(e['issue_status']);
        });
        console.log("===============================");
        console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");
        console.log(this.ticket_smry_by_isst_count);
        console.log(this.ticket_smry_by_isst_label);
        console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");

        this.chart = new Chart('id_noOfOpenIssues', {
          type: 'horizontalBar',
          data: {
            labels: this.ticket_smry_by_isst_label,
            datasets: [
              {
                data: this.ticket_smry_by_isst_count,
                fill: true,
                backgroundColor: ['#803690', '#ffce56', '#36a2eb', '#cc65fe', '#ff6384', '#949FB1', '#4D5360']
              }
            ]
          },
          options: {
            plugins: {
              colorschemes: {
                scheme: 'office.Parallax6'
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
                gridLines: true,
                zeroLineColor:'black',
                ticks: {
                  fontSize: 12,
                  suggestedMin: 40,
                  stepSize: 5
                },
                scaleLabel: {
                  fontColor: "black",
                  labelString: "Count",
                  display: true,
                  fontSize: 12
                }
              }],
              yAxes: [{
                display: true,
                gridLines: {
                },
                ticks: {
                  fontColor: "black",
                  fontSize: 12,
                  padding:8
                },
                scaleLabel: {
                  fontColor: "black",
                  fontSize: 12,
                  labelString: "Issue Status",
                  display: true
                }
              }]
            }
          }

        });
      });


    let temp_max = this.all_data['list'].map(res => res.main.temp_max);
    let temp_min = this.all_data['list'].map(res => res.main.temp_min);
    let alldates = this.all_data['list'].map(res => res.dt)
    this.weatherDates = [];
    console.log("----------------");
    console.log(temp_max);
    temp_max.push(280.1);
    temp_max.push(278.1);
    temp_max.push(283.1);
    temp_min.push(276.1);
    temp_min.push(277.1);
    temp_min.push(280.1);
    console.log(alldates);
    alldates.forEach((res) => {
      let v, j;
      console.log("================");
      console.log(res * 1000);
      let jsdate = new Date(res * 1000)
      console.log(jsdate.toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' }));
      this.weatherDates.push(jsdate.toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' }))
    })
    console.log(temp_max);
    console.log(temp_min);
    console.log(this.weatherDates);


    this._serTicketDashboard.getDashboardTicketSummaryByIssueType()
    .subscribe(res => {
      console.log("===============================");
      console.log(res['dbQryResponse']);
      res['dbQryResponse'].forEach(e => {
        this.ticket_smry_by_istyp_count.push(e['count']);
        this.ticket_smry_by_istyp_label.push(e['issue_type']);
      });
      console.log("===============================");
      console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");
      console.log(this.ticket_smry_by_istyp_count);
      console.log(this.ticket_smry_by_istyp_label);
      console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");

      this.chart2 = new Chart('id_byIssuetype', {
        type: 'horizontalBar',
        data: {
          labels: this.ticket_smry_by_istyp_label,
          datasets: [
            {
              data: this.ticket_smry_by_istyp_count,
              fill: true,
              backgroundColor: ['#803690', '#ffce56', '#36a2eb', '#cc65fe', '#ff6384', '#949FB1', '#4D5360']
            }
          ]
        },
        options: {
          plugins: {
            colorschemes: {
              scheme: 'office.Parallax6'
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
              gridLines: true,
              zeroLineColor:'black',
              ticks: {
                fontSize: 12,
                suggestedMin: 40,
                stepSize: 5
              },
              scaleLabel: {
                fontColor: "black",
                labelString: "Count",
                display: true,
                fontSize: 12
              }
            }],
            yAxes: [{
              display: true,
              gridLines: {},
              ticks: {
                fontColor: "black",
                fontSize: 12,
                padding:8
              },
              scaleLabel: {
                fontColor: "black",
                fontSize: 12,
                labelString: "Issue Status",
                display: true
              }
            }]
          }
        }

      });
    });


    // this.chart2 = new Chart('id_noOfClosedIssues', {
    //   type: 'line',
    //   data: {
    //     // labels: this.weatherDates,
    //     labels: ["", "A", "B", "C", "D", "E", "F"],
    //     datasets: [
    //       {
    //         data: temp_max,
    //         fill: false
    //       },
    //       {
    //         data: temp_min,
    //         fill: false
    //       },
    //     ]
    //   },
    //   options: {
    //     plugins: {
    //       colorschemes: {
    //         scheme: 'brewer.Accent7'
    //       }
    //     },
    //     legend: {
    //       display: false
    //     },
    //     scales: {
    //       xAxes: [{
    //         display: true,
    //         gridLines: true,
    //         ticks: {
    //           fontSize: 12

    //         }
    //       }],
    //       yAxes: [{
    //         display: true,
    //         gridLines: true,
    //         ticks: {
    //           fontColor: "black",
    //           fontSize: 12,
    //           suggestedMin: 278,
    //           stepSize: 110
    //         }
    //       }]
    //     }
    //   }
    // });

    this.chart = new Chart('id_noOfBugsVsOthersIssues', {
      type: 'bar',
      data: {
        // labels: this.weatherDates,
        labels: ["A", "B", "C "],
        datasets: [
          {
            data: temp_max,
            borderColor: "#3cba9f",
            fill: true,
            backgroundColor: ['#803690', '#ffce56', '#36a2eb', '#cc65fe', '#ff6384', '#949FB1', '#4D5360']
          },
          {
            data: temp_min,
            borderColor: "#3cba9f",
            fill: true,
            backgroundColor: ['#ff6384', '#949FB1', '#4D5360', '#803690', '#ffce56', '#36a2eb', '#cc65fe']
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            gridLines: true,
            ticks: {
              fontSize: 12

            }
          }],
          yAxes: [{
            display: true,
            gridLines: true,
            ticks: {
              fontColor: "black",
              fontSize: 12,
              suggestedMin: 278,
              stepSize: 1
            }
          }]
        }
      }
    });

    this.chart = new Chart('id_noOfHighSeverityIssues', {
      type: "doughnut",
      data: {
        labels: ["Red", "Green"],
        datasets: [{
          label: "Gauge",
          data: [50, 150],
          backgroundColor: [
            "rgb(255, 99, 102)",
            "rgb(54, 162, 135)",
            "rgb(255, 205, 86)"
          ]
        }]
      },
      options: {
        circumference: Math.PI,
        rotation: Math.PI,
        cutoutPercentage: 60, // precent
        plugins: {
          datalabels: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderColor: '#ffffff',
            color: function (context) {
              return context.dataset.backgroundColor;
            },
            font: function (context) {
              var w = context.chart.width;
              return {
                size: w < 512 ? 500 : 600
              }
            },
            align: 'start',
            anchor: 'start',
            offset: 10,
            borderRadius: 4,
            borderWidth: 1,
            formatter: function (value, context) {
              var i = context.dataIndex;
              var len = context.dataset.data.length - 1;
              if (i == len) {
                return null;
              }
              return value + ' mph';
            }
          }
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });

  }

  ngAfterViewInit() {


  }


}
