import { Component, OnInit } from '@angular/core';
import { HomepageService } from './../../services/homepage/homepage.service';
import { faTasks,faTicketAlt} from '@fortawesome/free-solid-svg-icons'
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  recentProjectActivities:any[]=[];
  yourRecentActivities:any[]=[];
  faTasks=faTasks;
  faTicketAlt=faTicketAlt;
  currentProjectName:string='';
  constructor(
    private _serHomepage: HomepageService
  ) { }

  jirigoBroadcastChannel;

  ngOnInit(): void {
    this.jirigoBroadcastChannel= new BroadcastChannel('jirigo-broadcast');
    this.jirigoBroadcastChannel.onmessage = (message) =>{
      console.log("*******broadcast*********");
      console.log(message);
      console.log("***************")
    };
    this.currentProjectName=localStorage.getItem('currentProjectName');
    this.getRecentProjectActivities();
  }

  getRecentProjectActivities(){
    let inpData={
      'project_id':localStorage.getItem('currentProjectId'),
      'current_user_id':localStorage.getItem('loggedInUserId'),
      'num_rows':7
    };

    this._serHomepage.getRecentProjActivities(inpData)
        .subscribe(res=>{
          if(res['dbQryResponse'] && res['dbQryStatus'] == "Success"){
            res['dbQryResponse'].forEach(e => {
                e.p_or_u == 'PROJECT' ? this.recentProjectActivities.push(e) :this.yourRecentActivities.push(e);
            });
          }
        });
  }

}
