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
  
ticker_header_cols:string[]=[
    // 'ticket_int_id',
    'Ticket No',
    'Summary',
    // 'Description',
    'Issue Status',
    'Issue Type',
    'Severity',
    'Priority',
    'Environment',
    'Blocking',
    'Reported By',
    // 'Reported Date',
    'Created By',
    // 'Created Date'
    'Modified By'
    // 'Modified Date'
    
  ];
  allTickets:any;
  // allTickets:any={
  //   "dbQryResponse": [
  //       {
  //           "created_by": 1,
  //           "created_date": "2020-04-09T21:54:20.919029",
  //           "description": "Dunno",
  //           "environment": "Dev",
  //           "is_blocking": "N",
  //           "issue_status": "Open",
  //           "issue_type": "Bug",
  //           "modified_by": null,
  //           "modified_date": null,
  //           "priority": "High",
  //           "severity": "High",
  //           "summary": "Testing First",
  //           "ticket_int_id": 6,
  //           "ticket_no": "Proj-6"
  //       },
  //       {
  //           "created_by": 1,
  //           "created_date": "2020-04-09T22:12:52.620363",
  //           "description": "Testing Second",
  //           "environment": "Prod",
  //           "is_blocking": "N",
  //           "issue_status": "Open",
  //           "issue_type": "Bug",
  //           "modified_by": null,
  //           "modified_date": null,
  //           "priority": "Low",
  //           "severity": "Low",
  //           "summary": "Testing Second",
  //           "ticket_int_id": 7,
  //           "ticket_no": "Proj-7"
  //       },
  //       {
  //           "created_by": 1,
  //           "created_date": "2020-04-09T22:33:30.53499",
  //           "description": "Testing Third",
  //           "environment": "UAT",
  //           "is_blocking": "N",
  //           "issue_status": "Open",
  //           "issue_type": "Bug",
  //           "modified_by": null,
  //           "modified_date": null,
  //           "priority": "Low",
  //           "severity": "Low",
  //           "summary": "Testing Third",
  //           "ticket_int_id": 8,
  //           "ticket_no": "Proj-8"
  //       },
  //       {
  //           "created_by": 1,
  //           "created_date": "2020-04-10T10:44:16.720484",
  //           "description": "Create Dev VM for new feature request 2.0",
  //           "environment": "Dev",
  //           "is_blocking": "N",
  //           "issue_status": "Open",
  //           "issue_type": "Enhancement",
  //           "modified_by": null,
  //           "modified_date": null,
  //           "priority": "High",
  //           "severity": "Low",
  //           "summary": "Create Dev VM",
  //           "ticket_int_id": 9,
  //           "ticket_no": "Proj-9"
  //       },
  //       {
  //           "created_by": 1,
  //           "created_date": "2020-04-10T19:49:43.902428",
  //           "description": "Create UAT VM",
  //           "environment": "UAT",
  //           "is_blocking": "N",
  //           "issue_status": "Open",
  //           "issue_type": "Bug",
  //           "modified_by": null,
  //           "modified_date": null,
  //           "priority": "Low",
  //           "severity": "Low",
  //           "summary": "Create UAT VM",
  //           "ticket_int_id": 10,
  //           "ticket_no": "Proj-10"
  //       }
  //   ],
  //   "dbQryStatus": "Success"
  // };

dtOptions: DataTables.Settings = {};
  constructor(private _router:Router,
              private _serTicketDetails:TicketDetailsService,
              private _serNgxSpinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.allTickets={};
    this._serNgxSpinner.show();
    this.dtOptions = {
      // pagingType: 'full_numbers',
      pageLength: 5
      // paging: false,
      // scrollY: "400",
      // responsive: true  
    };


    this._serTicketDetails.getAllTickets()
        .then(res=>{
          console.log("_serTicketDetails Output :"+JSON.stringify(res));
          console.log("===================");
          console.log(res['dbQryResponse']);
          console.log("===================");
          this.allTickets['dbQryResponse']=res['dbQryResponse'];
          console.log(this.allTickets);
          this._serNgxSpinner.hide();

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
