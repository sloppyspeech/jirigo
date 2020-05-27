import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Router,ActivatedRoute} from '@angular/router';
import {TaskTicketLinkService} from '../../services/task-ticket-links/task-ticket-link.service';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';


@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"image-manager"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET,PUT,OPTIONS,DELETE,POST',
      "Access-Control-Allow-Headers":"Content-Type"
    })
  };

  projectType: any[] = [
    {name: 'Scrum', code: 'Scrum'},
    {name: 'Kanban', code: 'Kanban'},
    {name: 'ScrumBan', code: 'ScrumBan'}
  ];
  qtd:any[] = [{
  }];
  
  data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            borderColor: '#565656'
        }
    ]
};

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

  filteredTaskTickets:any=[];
  selectedTaskTickets:any=[];
  selectedFile:any;
  debugFG: FormGroup;
  statusGrid:Array< {
                      status:string ,
                      nextStatuses:Array<{
                                          name:string,
                                          allowed:boolean
                                      }> 
                    }>=[];

  // projStatuses=['Open','Analysis','Dev'];
  projStatuses=['Open','Analysis','Dev','Code Review','QA Testing','UAT','Release','Closed'];

  constructor(private _formBuilder: FormBuilder,private _router:Router,
              private _taskTicketLinkSer:TaskTicketLinkService,
              private _httpCli:HttpClient) {
  }
 
  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
    let uploadData = new FormData();

    let url=this.sApiEndPoint+'/image'
    console.log(url);
    console.log(this.selectedFile.name)
    uploadData.append('created_by',localStorage.getItem('loggedInUserId'));
    uploadData.append('file', this.selectedFile,this.selectedFile.name);
    console.log(uploadData.has('fileName'));
    console.log(uploadData.get('fileName'));
    console.log(uploadData.get('created_by'));
    this._httpCli.post(url,uploadData)
        .subscribe(res=>{
          console.log("============");
          console.log(res);
        })
  }

  ngOnInit(): void {

    this.projStatuses.forEach(ps=>{
        let s:any[]=[];
        this.projStatuses.forEach(nxtSts=>{
          if(ps === nxtSts){
            s.push({name:nxtSts,allowed:true})
          }
          else{
            s.push({name:nxtSts,allowed:false})
          }
        });
        this.statusGrid.push({status:ps,nextStatuses:s});
    });
    console.log(this.statusGrid);

  }


}
