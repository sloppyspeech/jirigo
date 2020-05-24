import { Component, OnInit } from "@angular/core";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faCube, faCubes } from "@fortawesome/free-solid-svg-icons";
import { Router, ActivatedRoute } from "@angular/router";
import { TicketDetailsService } from "../../../services/tickets/ticket-details.service";
import { TaskDetailsService } from "../../../services/tasks/task-details.service";
@Component({
  selector: "app-my-tasks-tickets",
  templateUrl: "./my-tasks-tickets.component.html",
  styleUrls: ["./my-tasks-tickets.component.css"],
})
export class MyTasksTicketsComponent implements OnInit {
  showTable:boolean=false;
  myItemList:any[]=[];

  itemDetailsCols=[
    {'header':'Item No','field':'item_no','width':'8%'},
    {'header':'Summary','field':'summary','width':'30%'},
    {'header':'Status','field':'issue_status','width':'8%'},
    {'header':'Type','field':'issue_type','width':'8%'},
    {'header':'Severity','field':'severity','width':'8%'},
    {'header':'Priority','field':'priority','width':'8%'},
    // {'header':'Environment','field':'environment','width':'7%'},
    // {'header':'Estimation (hrs)','field':'estimated_time','width':'7%'},
    {'header':'Reported By','field':'reported_by','width':'14%'},
    {'header':'Reported Date','field':'reported_date','width':'12%'},
  ];

    faBookmark = faBookmark;
    faCubes = faCubes;
    faCube = faCube;
    myItemType: string = "";
    ticketCriteria: {
      project_id: string;
      assignee_id: string;
      created_by: string;
      modified_by: string;
    } = {
      project_id: localStorage.getItem("currentProjectId"),
      assignee_id: "",
      created_by: "",
      modified_by: "",
    };
    taskCriteria: {
      project_id: string;
      assignee_id: string;
      created_by: string;
      modified_by: string;
    } = {
      project_id: localStorage.getItem("currentProjectId"),
      assignee_id: "",
      created_by: "",
      modified_by: "",
    };

  constructor(
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _serTicketDetails: TicketDetailsService,
    private _serTaskDetails: TaskDetailsService
  ) {}

  ngOnInit(): void {
    console.log(this._router.getCurrentNavigation());
    console.log(this._activeRoute.routeConfig);
    this.myItemType = this._activeRoute.routeConfig.path;

    if (this.myItemType == "tickets") {
      this.ListItems('AssignedToMe');
    } else if (this.myItemType == "tasks") {
      this.ListItems('AssignedToMe');
    }
  }

  ListItems(criterion){
    console.log('this.myItemType :'+this.myItemType);
    console.log('criterion:'+criterion);
    this.myItemList=[];

     if (this.myItemType=='tickets'){
      this.resetTicketCriteria();

        if(criterion=='CreatedByMe'){
          this.ticketCriteria.created_by = localStorage.getItem("loggedInUserId");
        }
        else if(criterion=='ModifiedByMe'){
          this.ticketCriteria.modified_by = localStorage.getItem("loggedInUserId");
        }
        else if(criterion=='AssignedToMe'){
          this.ticketCriteria.assignee_id = localStorage.getItem("loggedInUserId");
        } 

        this._serTicketDetails
              .getAllTicketsByCriterion(this.ticketCriteria)
                .subscribe((res) => {
                    console.log(res);
                    if(res['dbQryStatus']=='Success'){
                      this.myItemList=res['dbQryResponse'];
                      res['dbQryResponse'].forEach(element => {
                        element['item_no']=element['ticket_no'];
                        element['url']='/tickets/view-edit-tickets'
                      });
                      this.showTable=true;
                    }
        });

     }
     else if(this.myItemType=='tasks'){
       this.resetTaskCriterion();
        console.log('In Criterion :'+criterion);
        if(criterion=='CreatedByMe'){
          this.taskCriteria.created_by = localStorage.getItem("loggedInUserId");
        }
        else if(criterion=='ModifiedByMe'){
          this.taskCriteria.modified_by = localStorage.getItem("loggedInUserId");
        }
        else if(criterion=='AssignedToMe'){
          this.taskCriteria.assignee_id = localStorage.getItem("loggedInUserId");
        } 
        this._serTaskDetails
              .getAllTasksByCriterion(this.taskCriteria)
                .subscribe((res) => {
                    console.log(res);
                    if(res['dbQryStatus']=='Success'){
                      this.myItemList=res['dbQryResponse'];
                      res['dbQryResponse'].forEach(element => {
                        element['item_no']=element['task_no'];
                        element['url']='/tasks/view-edit-task'
                      });
                      this.showTable=true;
                      console.log(this.myItemList);
                    }
        });
     }

  }

  resetTicketCriteria() {
    this.showTable=false;
    this.ticketCriteria = {
      project_id: localStorage.getItem("currentProjectId"),
      assignee_id: "",
      created_by: "",
      modified_by: "",
    };
  }

  resetTaskCriterion() {
    this.showTable=false;
    this.taskCriteria = {
      project_id: localStorage.getItem("currentProjectId"),
      assignee_id: "",
      created_by: "",
      modified_by: "",
    };
  }
}
