import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,ParamMap  } from '@angular/router';
@Component({
  selector: 'app-list-tickets',
  templateUrl: './list-tickets.component.html',
  styleUrls: ['./list-tickets.component.css']
})
export class ListTicketsComponent implements OnInit {
  cars:any={
    "data": [
        {"brand": "VW", "year": 2012, "color": "Orange", "vin": "dsad231ff"},
        {"brand": "Audi", "year": 2011, "color": "Black", "vin": "gwregre345"},
        {"brand": "Renault", "year": 2005, "color": "Gray", "vin": "h354htr"},
        {"brand": "BMW", "year": 2003, "color": "Blue", "vin": "j6w54qgh"},
        {"brand": "Mercedes", "year": 1995, "color": "Orange", "vin": "hrtwy34"},
        {"brand": "Volvo", "year": 2005, "color": "Black", "vin": "jejtyj"},
        {"brand": "Honda", "year": 2012, "color": "Yellow", "vin": "g43gr"},
        {"brand": "Jaguar", "year": 2013, "color": "Orange", "vin": "greg34"},
        {"brand": "Ford", "year": 2000, "color": "Black", "vin": "h54hw5"},
        {"brand": "Fiat", "year": 2013, "color": "Red", "vin": "245t2s"},
        {"brand": "VW", "year": 2012, "color": "Orange", "vin": "dsad231ff"},
        {"brand": "Audi", "year": 2011, "color": "Black", "vin": "gwregre345"},
        {"brand": "Renault", "year": 2005, "color": "Gray", "vin": "h354htr"},
        {"brand": "BMW", "year": 2003, "color": "Blue", "vin": "j6w54qgh"},
        {"brand": "Mercedes", "year": 1995, "color": "Orange", "vin": "hrtwy34"},
        {"brand": "Volvo", "year": 2005, "color": "Black", "vin": "jejtyj"},
        {"brand": "Honda", "year": 2012, "color": "Yellow", "vin": "g43gr"},
        {"brand": "Jaguar", "year": 2013, "color": "Orange", "vin": "greg34"},
        {"brand": "Ford", "year": 2000, "color": "Black", "vin": "h54hw5"},
        {"brand": "Fiat", "year": 2013, "color": "Red", "vin": "245t2s"}
    ]
};
ticker_header_cols:string[]=[
    // 'ticket_int_id',
    'Ticket No',
    'Summary',
    'Description',
    'Issue Status',
    'Issue Type',
    'Severity',
    'Priority',
    'Environment',
    'Blocking',
    'Created By',
    'Created Date',
    'Modified By',
    'Modified Date',
    
  ];
  tickets_data_temp:any={
    "dbQryResponse": [
        {
            "created_by": 1,
            "created_date": "2020-04-09T21:54:20.919029",
            "description": "Dunno",
            "environment": "Dev",
            "is_blocking": "N",
            "issue_status": "Open",
            "issue_type": "Bug",
            "modified_by": null,
            "modified_date": null,
            "priority": "High",
            "severity": "High",
            "summary": "Testing First",
            "ticket_int_id": 6,
            "ticket_no": "Proj-6"
        },
        {
            "created_by": 1,
            "created_date": "2020-04-09T22:12:52.620363",
            "description": "Testing Second",
            "environment": "Prod",
            "is_blocking": "N",
            "issue_status": "Open",
            "issue_type": "Bug",
            "modified_by": null,
            "modified_date": null,
            "priority": "Low",
            "severity": "Low",
            "summary": "Testing Second",
            "ticket_int_id": 7,
            "ticket_no": "Proj-7"
        },
        {
            "created_by": 1,
            "created_date": "2020-04-09T22:33:30.53499",
            "description": "Testing Third",
            "environment": "UAT",
            "is_blocking": "N",
            "issue_status": "Open",
            "issue_type": "Bug",
            "modified_by": null,
            "modified_date": null,
            "priority": "Low",
            "severity": "Low",
            "summary": "Testing Third",
            "ticket_int_id": 8,
            "ticket_no": "Proj-8"
        },
        {
            "created_by": 1,
            "created_date": "2020-04-10T10:44:16.720484",
            "description": "Create Dev VM for new feature request 2.0",
            "environment": "Dev",
            "is_blocking": "N",
            "issue_status": "Open",
            "issue_type": "Enhancement",
            "modified_by": null,
            "modified_date": null,
            "priority": "High",
            "severity": "Low",
            "summary": "Create Dev VM",
            "ticket_int_id": 9,
            "ticket_no": "Proj-9"
        },
        {
            "created_by": 1,
            "created_date": "2020-04-10T19:49:43.902428",
            "description": "Create UAT VM",
            "environment": "UAT",
            "is_blocking": "N",
            "issue_status": "Open",
            "issue_type": "Bug",
            "modified_by": null,
            "modified_date": null,
            "priority": "Low",
            "severity": "Low",
            "summary": "Create UAT VM",
            "ticket_int_id": 10,
            "ticket_no": "Proj-10"
        }
    ],
    "dbQryStatus": "Success"
  };

dtOptions: DataTables.Settings = {};
  constructor(private _router:Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true  
    };
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
