import {Component, OnInit,ViewChild,ElementRef,Renderer2} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Router,ActivatedRoute} from '@angular/router';
import {TaskTicketLinkService} from '../../services/task-ticket-links/task-ticket-link.service';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';
import { ErrorMessageService } from '../../services/error_messages/error-message.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit {
  launchIt:boolean=false;
  newModalContent:string='';
  newModalContent2:string="";
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"image-manager"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET,PUT,OPTIONS,DELETE,POST',
      "Access-Control-Allow-Headers":"Content-Type"
    })
  };

  @ViewChild('myModal') myModal:ElementRef;

  constructor(private _formBuilder: FormBuilder,private _router:Router,
    private _taskTicketLinkSer:TaskTicketLinkService,
    private _httpCli:HttpClient,
    private _ren2:Renderer2,
    private _errSer:ErrorMessageService 
    ) {
}
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

  ngOnInit(): void {
    // this._errSer.getErrorMessage('TASK')
    //     .subscribe(res=>{
    //       console.log('Error Message here here ');
    //       console.log(res);
    //       console.log(res.CRE_OK.text);
    //       // this.launchIt=true;
    //       // this.newModalContent=res.CRE_OK.text;
    //     })

    // this.projStatuses.forEach(ps=>{
    //     let s:any[]=[];
    //     this.projStatuses.forEach(nxtSts=>{
    //       if(ps === nxtSts){
    //         s.push({name:nxtSts,allowed:true})
    //       }
    //       else{
    //         s.push({name:nxtSts,allowed:false})
    //       }
    //     });
    //     this.statusGrid.push({status:ps,nextStatuses:s});
    // });


  }

  drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
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



  openModal(){
    
    this._ren2.removeClass(this.myModal.nativeElement, 'hide');
    this._ren2.addClass(this.myModal.nativeElement, "show");
  }

  closeModal(){
    console.log('closemodal Called');
    this._ren2.removeClass(this.myModal.nativeElement, 'show');
    this._ren2.addClass(this.myModal.nativeElement, "hide");
  }

  testLaunch(){
    this.launchIt=!this.launchIt;
    console.log('openModal');
    this.newModalContent='HEHEREdsfdsfsdRE';
    this.newModalContent2="Helllsdweoiuweldkslmfdlsfsd";
  }

}
