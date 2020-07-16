import { map } from 'rxjs/operators';
import { Component, OnInit,ElementRef,ViewChild,Renderer2 } from '@angular/core';
import { Router} from '@angular/router';
import { faCogs, faCubes, faUsers, faLightbulb,faBug,faFire,faThumbsUp,faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js';
import { TicketsDashboardService } from '../../services/dashboards/tickets-dashboard.service';
import 'chartjs-plugin-colorschemes';
import { compileNgModule } from '@angular/compiler';
import * as tableau from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

options = {
title: {
    display: false,
    text: 'My Title',
    fontSize: 2
},
legend: {
    display:false,
    position: 'bottom'
},
            scales: {
              xAxes: [{
                display: true,
                gridLines: true,
                zeroLineColor:'white',
                ticks: {
                  fontSize: 2,
                  stepSize: 5,
                  padding:8,
                  fontColor:'white'
                },
                scaleLabel: {
                  fontColor: "black",
                  labelString: "Last "+" days",
                  display: false,
                  fontSize: 2
                }
              }],
              yAxes: [{
                display: false,
                gridLines: {},
                ticks: {
                  fontColor: "black",
                  fontSize: 2,
                  padding:15,
                },
                scaleLabel: {
                  fontColor: "white",
                  fontSize: 2,
                  labelString: "Count Of Open Tickets",
                  display: false
                }
              }]
            }
};
  
  
 /****/
  faCogs = faCogs;
  faCubes = faCubes;
  faUsers = faUsers;
  faLightbulb = faLightbulb;
  faBug=faBug;
  faFire=faFire;
  faThumbsUp=faThumbsUp;
  faFolderOpen=faFolderOpen;

  openIssuesCount: number = 0;
  closedIssuesCount: number = 0;
  bugsVsOthersCount: number = 0;
  highSeverityCount: number = 0;

  ticket_smry_by_isst_count: any[] = [];
  ticket_smry_by_isst_label: any[] = [];

  ticket_smry_by_istyp_count: any[] = [];
  ticket_smry_by_istyp_label: any[] = [];

  ticket_cre_last_n_days_count: any[] = [];
  ticket_cre_last_n_days_label: any[] = [];

  ticket_stillopen_last_n_days_count: any[] = [];
  ticket_stillopen_last_n_days_label: any[] = [];

  ticket_stillopen_bymodule_last_n_days_count: any[] = [];
  ticket_stillopen_bymodule_last_n_days_label: any[] = [];

  ticket_count_bychannel_last_n_days_count: any[] = [];
  ticket_count_bychannel_last_n_days_label: any[] = [];


  ticketIssueStatusBarChart;
  ticketIssueTypeBarChart;
  ticketCreatedPerDayChart;
  ticketOpenLastNDaysChart;
  ticketOpenByModuleLastNDaysChart;
  ticketCountByChannelLastNDaysChart;

  weatherDates = [];
  globalChartIntervalInDays=7;
  lgCardsData:boolean=false;

  showSummaryBlocks:boolean=false;
  showErrorNoDatasummaryByIssueStatus:boolean=false;
  showErrorNoDatasummaryByIssueType:boolean=false;
  showErrorNoDataticketCreatedPerDayInLastNdays:boolean=false;
  showErrorNoDataticketsStillOpenLastNDays:boolean=false;
  showErrorNoDataticketsOpenByModuleLastNDays:boolean=false;
  showErrorNoDataticketsCountByChannelLastNDays:boolean=false;

  constructor(
    private _serTicketDashboard: TicketsDashboardService,
    private _renderer:Renderer2
  ) { }

  ngOnInit(): void {
    this.loadDataAndCharts()

  }

  loadDataAndCharts(){
        
    this.showErrorNoDatasummaryByIssueStatus=false;
    this.showErrorNoDatasummaryByIssueType=false;
    this.showErrorNoDataticketCreatedPerDayInLastNdays=false;
    this.showErrorNoDataticketsStillOpenLastNDays=false;
    this.initializeVars();
    this._serTicketDashboard.getDashboardTicketGenericSummary(this.globalChartIntervalInDays)
      .subscribe(res => {
        if (res['dbQryResponse']){
          console.log(res);
          this.openIssuesCount = res['dbQryResponse']['issueStatusOpen']?res['dbQryResponse']['issueStatusOpen']:0;
          this.closedIssuesCount = res['dbQryResponse']['issueStatusClosed']?res['dbQryResponse']['issueStatusClosed']:0;
          this.bugsVsOthersCount = res['dbQryResponse']['issueTypeBug']?res['dbQryResponse']['issueTypeBug']:0;
          this.highSeverityCount = res['dbQryResponse']['SeverityHigh']?res['dbQryResponse']['SeverityHigh']:0 + 
                                   res['dbQryResponse']['SeverityCritical']?res['dbQryResponse']['SeverityCritical']:0;
          console.log(this.openIssuesCount);
          this.lgCardsData=true;
        }
        else{
          this.initializeVars();
          this.lgCardsData=false;
        }
      });

    this._serTicketDashboard.getDashboardTicketSummaryByIssueStatus(this.globalChartIntervalInDays)
      .subscribe(res => {
        console.log("===============================");
        console.log(res['dbQryResponse']);
          if(res['dbQryResponse']){
            res['dbQryResponse'].forEach(e => {
              this.ticket_smry_by_isst_count.push(e['count']);
              this.ticket_smry_by_isst_label.push(e['issue_status']);
            });
            console.log("===============================");
            console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");
            console.log(this.ticket_smry_by_isst_count);
            console.log(this.ticket_smry_by_isst_label);
            console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");

            if (this.ticketIssueStatusBarChart){
              this.ticketIssueStatusBarChart.destroy();
            }
            this.ticketIssueStatusBarChart = new Chart('id_summaryByIssueStatus', {
              type: 'horizontalBar',
              data: {
                labels: this.ticket_smry_by_isst_label,
                datasets: [
                  {
                    data: this.ticket_smry_by_isst_count,
                    fill: true,
                    // backgroundColor: ['#803690', '#ffce56', '#36a2eb', '#cc65fe', '#ff6384', '#949FB1', '#4D5360']
                    backgroundColor:tableau.Tableau20
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
                    gridLines: {
                      zeroLineColor:'black'
                    },
                    ticks: {
                      fontSize: 12,
                      suggestedMin: 1,
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
                      labelString: "Ticket Issue Status",
                      display: true
                    }
                  }]
                }
              }
            });
          }
          else{
            console.log('getDashboardTicketSummaryByIssueStatus is NULL');
            this.initializeVars();
            this.showErrorNoDatasummaryByIssueStatus=true;
          }
        
      });



    this._serTicketDashboard.getDashboardTicketSummaryByIssueType(this.globalChartIntervalInDays)
    .subscribe(res => {
      console.log("===============================");
      console.log(res['dbQryResponse']);

      if(res['dbQryResponse']){
        res['dbQryResponse'].forEach(e => {
          this.ticket_smry_by_istyp_count.push(e['count']);
          this.ticket_smry_by_istyp_label.push(e['issue_type']);
        });
        console.log("===============================");
        console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");
        console.log(this.ticket_smry_by_istyp_count);
        console.log(this.ticket_smry_by_istyp_label);
        console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");

        if (this.ticketIssueTypeBarChart){
          this.ticketIssueTypeBarChart.destroy();
        }

        this.ticketIssueTypeBarChart = new Chart('id_summaryByIssueType', {
          type: 'horizontalBar',
          data: {
            labels: this.ticket_smry_by_istyp_label,
            datasets: [
              {
                data: this.ticket_smry_by_istyp_count,
                fill: true,
                // backgroundColor: ['#803690', '#ffce56', '#36a2eb', '#cc65fe', '#ff6384', '#949FB1', '#4D5360']
                backgroundColor:tableau.Tableau20
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
                gridLines: {
                  display:true,
                },
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
                  labelString: "Ticket Issue Type",
                  display: true
                }
              }]
            },
            tooltips:{
              enabled:true
            }
          }

        });
      }
    else{
      this.initializeVars();
      this.showErrorNoDatasummaryByIssueType=true;
    }
    });


    this._serTicketDashboard.getDashboardTicketsCreatedPerDayForNDays(this.globalChartIntervalInDays)
    .subscribe(res => {
      console.log("===============getDashboardTicketsCreatedPerDayForNDays================");
      console.log(res);

      if(res['dbQryResponse']){
          res['dbQryResponse'].forEach(e => {
            this.ticket_cre_last_n_days_count.push(e['count']);
            this.ticket_cre_last_n_days_label.push(e['created_date']);
          });
          console.log("===============================");
          console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");
          console.log(this.ticket_cre_last_n_days_count);
          console.log(this.ticket_cre_last_n_days_label);
          console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");

          if (this.ticketCreatedPerDayChart){
            this.ticketCreatedPerDayChart.destroy();
          }

          this.ticketCreatedPerDayChart = new Chart('id_ticketCreatedPerDayInLastNdays', {
            type: 'line',
            data: {
              labels: this.ticket_cre_last_n_days_label,
              datasets: [
                {
                  data: this.ticket_cre_last_n_days_count,
                  fill: false,
                  borderWidth: 2,
                  borderColor: '#17D1EC',
                }
              ]
            },
            options: {
              plugins: {
                colorschemes: {
                  scheme: 'office.Parallax6'
                }
              },
              title:{
                display:true,
                text:'# Tickets Created Per Day'
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
                    stepSize: 5,
                    padding:8
                  },
                  scaleLabel: {
                    fontColor: "black",
                    labelString: "Last "+this.globalChartIntervalInDays+" days",
                    display: true,
                    fontSize: 12
                  },
                  type:'time',
                  time: {
                    parser: 'YYYY-MM-DD',
                    tooltipFormat: 'll HH:mm',
                    unit: 'day',
                    unitStepSize: 1,
                    displayFormats: {
                      'day': 'DD/MMM'
                    }
                  }
                }],
                yAxes: [{
                  display: true,
                  gridLines: {},
                  ticks: {
                    fontColor: "black",
                    fontSize: 12,
                    padding:8,
                    max:Math.max(...this.ticket_cre_last_n_days_count) +1
                  },
                  scaleLabel: {
                    fontColor: "black",
                    fontSize: 12,
                    labelString: "Ticket Creation Per Day",
                    display: true
                  }
                }]
              }
            }

          });
      }
      else{
        this.initializeVars();
        this.showErrorNoDataticketCreatedPerDayInLastNdays=true;
      }
    });


    this._serTicketDashboard.getDashboardTicketStillOpenInLastNDays(this.globalChartIntervalInDays)
    .subscribe(res => {
      console.log("===============getDashboardTicketStillOpenInLastNDays================");
      console.log(res['dbQryResponse']);
      
      if(res['dbQryResponse']){
          res['dbQryResponse'].forEach(e => {
            this.ticket_stillopen_last_n_days_count.push(e['count']);
            this.ticket_stillopen_last_n_days_label.push(e['created_date']);
          });
          console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");
          console.log(this.ticket_stillopen_last_n_days_count);
          console.log(this.ticket_stillopen_last_n_days_label);
          console.log(Math.max(...this.ticket_stillopen_last_n_days_count));
          console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");

          if (this.ticketOpenLastNDaysChart){
            this.ticketOpenLastNDaysChart.destroy();
          }

          this.ticketOpenLastNDaysChart = new Chart('id_ticketsStillOpenLastNDays', {
            type: 'line',
            data: {
              labels: this.ticket_stillopen_last_n_days_label,
              datasets: [
                {
                  data: this.ticket_stillopen_last_n_days_count,
                  fill: false,
                  borderWidth: 1,
                  borderColor: 'red'
                }
              ]
            },
            options: {
              plugins: {
                colorschemes: {
                  scheme: 'office.Parallax6'
                }
              },
              title:{
                display:true,
                text:'# Tickets Still Open,count by Created Date'
              }
              ,
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
                    stepSize: 5,
                    padding:8
                  },
                  scaleLabel: {
                    fontColor: "black",
                    labelString: "Last "+this.globalChartIntervalInDays+" days",
                    display: true,
                    fontSize: 12
                  },
                  type:'time',
                  time: {
                    parser: 'YYYY-MM-DD',
                    tooltipFormat: 'll HH:mm',
                    unit: 'day',
                    unitStepSize: 1,
                    displayFormats: {
                      'day': 'DD/MMM'
                    }
                  }
                }],
                yAxes: [{
                  display: true,
                  gridLines: {},
                  ticks: {
                    fontColor: "black",
                    fontSize: 12,
                    padding:5,
                    max:Math.max(...this.ticket_stillopen_last_n_days_count) +2
                  },
                  scaleLabel: {
                    fontColor: "black",
                    fontSize: 12,
                    labelString: "Count Of Open Tickets",
                    display: true
                  }
                }]
              }
            }

          });
          

        }
        else{
          this.initializeVars();
          this.showErrorNoDataticketsStillOpenLastNDays=true;
        }
      
    });
    
  this._serTicketDashboard.getDashboardTicketOpenByModuleInLastNDays(this.globalChartIntervalInDays)
    .subscribe(res => {
      console.log("===============getDashboardTicketOpenByModuleInLastNDays================");
      console.log(res['dbQryResponse']);
        if(res['dbQryResponse']){
          res['dbQryResponse'].forEach(e => {
            this.ticket_stillopen_bymodule_last_n_days_count.push(e['count']);
            this.ticket_stillopen_bymodule_last_n_days_label.push(e['module']);
          });
          console.log("===============================");
          console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");
          console.log(this.ticket_stillopen_bymodule_last_n_days_count);
          console.log(this.ticket_stillopen_bymodule_last_n_days_label);
          console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");

          if (this.ticketOpenByModuleLastNDaysChart){
            this.ticketOpenByModuleLastNDaysChart.destroy();
          }
          this.ticketOpenByModuleLastNDaysChart = new Chart('id_openByModuleLastNDays', {
            type: 'horizontalBar',
            data: {
              labels: this.ticket_stillopen_bymodule_last_n_days_label,
              datasets: [
                {
                  data: this.ticket_stillopen_bymodule_last_n_days_count,
                  fill: true,
                  // backgroundColor: ['#803690', '#ffce56', '#36a2eb', '#cc65fe', '#ff6384', '#949FB1', '#4D5360']
                  backgroundColor:tableau.Tableau20
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
                  gridLines: {
                    display:true,
                    zeroLineColor:'black'
                  },
                  ticks: {
                    fontSize: 12,
                    suggestedMin: 1,
                    stepSize: 5
                  },
                  scaleLabel: {
                    fontColor: "black",
                    labelString: "Count For Last " +this.globalChartIntervalInDays+" days",
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
                    labelString: "Open By Module",
                    display: true
                  }
                }]
              }
            }
          });
        }
        else{
          console.log('getDashboardTicketOpenByModuleInLastNDays is NULL');
          this.initializeVars();
          this.showErrorNoDataticketsOpenByModuleLastNDays=true;
        }
      
    });

    this._serTicketDashboard.getDashboardTicketCountByChannelInLastNDays(this.globalChartIntervalInDays)
    .subscribe(res => {
      console.log("===============getDashboardTicketOpenByModuleInLastNDays================");
      console.log(res['dbQryResponse']);
        if(res['dbQryResponse']){
          res['dbQryResponse'].forEach(e => {
            this.ticket_count_bychannel_last_n_days_count.push(e['count']);
            this.ticket_count_bychannel_last_n_days_label.push(e['channel']);
          });
          console.log("===============================");
          console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");
          console.log(this.ticket_count_bychannel_last_n_days_count);
          console.log(this.ticket_count_bychannel_last_n_days_label);
          console.log("=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*");

          if (this.ticketCountByChannelLastNDaysChart){
            this.ticketCountByChannelLastNDaysChart.destroy();
          }
          this.ticketCountByChannelLastNDaysChart = new Chart('id_ticketCountByChannel', {
            type: 'horizontalBar',
            data: {
              labels: this.ticket_count_bychannel_last_n_days_label,
              datasets: [
                {
                  data: this.ticket_count_bychannel_last_n_days_count,
                  fill: true,
                  // backgroundColor: ['#803690', '#ffce56', '#36a2eb', '#cc65fe', '#ff6384', '#949FB1', '#4D5360']
                  backgroundColor:tableau.Tableau20
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
                  gridLines: {
                    display:true,
                    zeroLineColor:'black'
                  },
                  ticks: {
                    fontSize: 12,
                    suggestedMin: 1,
                    stepSize: 5
                  },
                  scaleLabel: {
                    fontColor: "black",
                    labelString: "Count For Last " +this.globalChartIntervalInDays+" days",
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
                    labelString: "Count By Channel",
                    display: true
                  }
                }]
              }
            }
          });
        }
        else{
          console.log('getDashboardTicketCountByChannelInLastNDays is NULL');
          this.initializeVars();
          this.showErrorNoDataticketsCountByChannelLastNDays=true;
        }
      
    });



    

  }

  setLastNDaysForDashBoard(lastNDays){
    console.log('setLastNDaysForDashBoard :'+lastNDays);
    this.globalChartIntervalInDays=lastNDays;
    this.loadDataAndCharts();
  }

  initializeVars(){
    this.lgCardsData=false;
    this.openIssuesCount= 0;
    this.closedIssuesCount= 0;
    this.bugsVsOthersCount = 0;
    this.highSeverityCount = 0;
  
    this.ticket_smry_by_isst_count = [];
    this.ticket_smry_by_isst_label  = [];
  
    this.ticket_smry_by_istyp_count = [];
    this.ticket_smry_by_istyp_label = [];
  
    this.ticket_cre_last_n_days_count  = [];
    this.ticket_cre_last_n_days_label = [];
  
    this.ticket_stillopen_last_n_days_count = [];
    this.ticket_stillopen_last_n_days_label = [];

    this.ticket_stillopen_bymodule_last_n_days_count=[];
    this.ticket_stillopen_bymodule_last_n_days_label=[];

    this.ticket_count_bychannel_last_n_days_count=[];
    this.ticket_count_bychannel_last_n_days_label=[];

  }

}
