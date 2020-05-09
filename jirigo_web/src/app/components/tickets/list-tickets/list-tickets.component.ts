import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,ParamMap  } from '@angular/router';
import { TicketDetailsService  } from '../../../services/tickets/ticket-details.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list-tickets',
  templateUrl: './list-tickets.component.html',
  styleUrls: ['./list-tickets.component.css']
})
export class ListTicketsComponent implements OnInit {
  allTickets=[];
  showTable:boolean=false;

  ticketDetailsCols=[
    {'header':'Ticket No','field':'ticket_no'},
    {'header':'Summary','field':'summary'},
    {'header':'Issue Status','field':'issue_status'},
    {'header':'Issue Type','field':'issue_type'},
    {'header':'Severity','field':'severity'},
    {'header':'Priority','field':'priority'},
    {'header':'Environment','field':'environment'},
    {'header':'Blocking','field':'blocking'},
    {'header':'Reported By','field':'reported_by'},
    {'header':'Reported Date','field':'reported_date'},
  ];


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
// dtOptions: DataTables.Settings = {
//   "columnDefs": [
//     { "orderable": false, "targets": 0 },
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null
//   ],
//   "columns": [
//     { "orderable": false,"width":"80%" },
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null
//   ]
// };
  constructor(private _router:Router,
              private _serTicketDetails:TicketDetailsService,
              private _serNgxSpinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.allTickets=[];
    this.showTable=false;
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
    this._serTicketDetails.getAllTickets()
    .then(res=>{
      console.log("_serTicketDetails Output :"+JSON.stringify(res));
      console.log("===================");
      console.log(res['dbQryResponse']);
      console.log("===================");
      // this.allTickets['dbQryResponse']=res['dbQryResponse'];
      for (var i=0;i<=res['dbQryResponse'].length;i++){
        this.allTickets.push(res['dbQryResponse'][i]);
      }
      // this.allTickets=res['dbQryResponse'];
      console.log(this.allTickets);
      this.showTable=true;
      // setTimeout(() => {
      //   this._serNgxSpinner.hide();
      //   // $(()=>{
      //   //   $('#testTicket').html("List Tickets");
      //   // });
      // }, 1000);

    })
    .catch(e=>{
        console.log("Error Fetching all tickets getAllTickets in list-tickets-components:"+e);
    });
  }
  cellToEdit(e,val){
    alert(val);
  }
  cellToDblEdit(e,val){
    alert(val);
  }

  gotoHeroes(inp) {
    // let heroId = hero ? hero.id : null;
    // Pass along the hero id if available
    // so that the HeroList component can select that hero.
    // Include a junk 'foo' property for fun.
    this._router.navigate(['/view-edit-tickets', { id: "heroId", foo: 'foo' }]);
  }


}
