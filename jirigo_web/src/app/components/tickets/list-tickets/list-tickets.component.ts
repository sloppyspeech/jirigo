import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,ParamMap  } from '@angular/router';
import { TicketDetailsService  } from '../../../services/tickets/ticket-details.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import {faPlusSquare} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-list-tickets',
  templateUrl: './list-tickets.component.html',
  styleUrls: ['./list-tickets.component.css']
})
export class ListTicketsComponent implements OnInit {
  faPlusSquare=faPlusSquare;

  allTickets=[];
  showTable:boolean=false;
  showNoTicketsRetrieved:boolean=false;

  ticketDetailsCols=[
    {'header':'Ticket No','field':'ticket_no','width':'7%'},
    {'header':'Summary','field':'summary','width':'28%'},
    {'header':'Status','field':'issue_status','width':'7%'},
    {'header':'Type','field':'issue_type','width':'8%'},
    {'header':'Severity','field':'severity','width':'8%'},
    {'header':'Priority','field':'priority','width':'7%'},
    {'header':'Blocking','field':'blocking','width':'6%'},
    {'header':'Reported By','field':'reported_by','width':'9%'},
    {'header':'Reported Date','field':'reported_date','width':'10%'},
    {'header':'Assigned To','field':'assigned_to','width':'9%'}
  ];


  ctxItems=[];
  ctxSelectedRow:any;

  ticket_header_cols:string[]=[
    // 'ticket_int_id',
    'Ticket No',
    'Summary',
    'Issue Status',
    'Issue Type',
    'Severity',
    'Priority',
    'Environment',
    'Blocking',
    'Reported By',
    'Reported Date'
    // ,
    // 'Created By',
    // 'Created Date',
    // 'Modified By',
    // 'Modified Date'
  ];
  
  dtOptions: DataTables.Settings = {};

  constructor(private _router:Router,
              private _serTicketDetails:TicketDetailsService,
              private _serNgxSpinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this._serNgxSpinner.show();
    this.showNoTicketsRetrieved=false;
    this.allTickets=[];
    this.showTable=false;
    this.ctxItems = [
      { label: 'Assign To Me', icon: 'pi pi-check', command: (event) => this.assignToggle(this.ctxSelectedRow,'assign') },
      { label: 'Unassign Ticket', icon: 'pi pi-minus-circle', command: (event) => this.assignToggle(this.ctxSelectedRow,'unassign') }
  ];
    // this._serNgxSpinner.show();
    this.dtOptions = {
      // pagingType: 'full_numbers',
      pageLength: 10,
      // paging: false,
      // scrollY: "400",
      responsive: true  
    };


  }

  ngAfterViewInit() {
    this.showNoTicketsRetrieved=false;
    this._serTicketDetails.getAllTickets(localStorage.getItem('currentProjectId'))
    .then(res=>{
      console.log("_serTicketDetails Output :"+JSON.stringify(res));
      console.log("===================");
      console.log(res['dbQryResponse']);
      console.log(res['dbQryStatus']);
      console.log("===================");
      // this.allTickets['dbQryResponse']=res['dbQryResponse'];
      // for (var i=0;i<=res['dbQryResponse'].length;i++){
      //   this.allTickets.push(res['dbQryResponse'][i]);
      // }
      console.log(res['dbQryStatus']);
      console.log(res['dbQryStatus'].length);

      if (res['dbQryStatus'] == 'Success' ){
        console.log("***@@@@@******No WHERE *********");
        res['dbQryResponse'].forEach(ticket => {
          this.allTickets.push(ticket);
        });
        console.log(this.allTickets);
        this.showTable=true;
        this._serNgxSpinner.hide();
      }
    else{
      console.log("*********here *********");
      this.showTable=false;
      this.showNoTicketsRetrieved=true;
      this._serNgxSpinner.hide();
    }



    })
    .catch(e=>{
        console.log("Error Fetching all tickets getAllTickets in list-tickets-components:"+e);
        this._serNgxSpinner.hide();
    });
  }
  cellToEdit(e,val){
    alert(val);
  }
  cellToDblEdit(e,val){
    alert(val);
  }

  assignToggle(dataRow,action){
    console.log(dataRow);
    let inpData={};
    let assignee_id='';
    if (action=='assign'){
      inpData={
        'ticket_no':dataRow['ticket_no'],
        'assignee_id':localStorage.getItem('loggedInUserId'),
        'modified_by':localStorage.getItem('loggedInUserId')
      }
    }
    else{
      inpData={
        'ticket_no':dataRow['ticket_no'],
        'modified_by':localStorage.getItem('loggedInUserId')
      }
    }

    console.log(dataRow);
    console.log(action);
    console.log(inpData);
    this._serTicketDetails.updateTicketAssignee(inpData)
        .subscribe(res=>{
          console.log(res);
          if(res['dbQryStatus'] == "Success"){
            alert('Action Successful');
            this.reloadComponent();
          }
        });
  }
  reloadComponent() {
    console.log("===============reloadComponent=================");
    console.log(this._router.url);
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate([this._router.url]);
}

}
