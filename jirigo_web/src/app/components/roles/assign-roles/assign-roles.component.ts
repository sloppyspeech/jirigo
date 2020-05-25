import { Component, OnInit } from '@angular/core';
import { RolesService } from './../../../services/roles/roles.service';
import { faPlusSquare,faTrashAlt,faEdit} from  '@fortawesome/free-regular-svg-icons'
import { FormBuilder, FormGroup,FormControl,Validators} from '@angular/forms';
import { ProjectsService} from '../../../services/projects/projects.service';

@Component({
  selector: 'app-assign-roles',
  templateUrl: './assign-roles.component.html',
  styleUrls: ['./assign-roles.component.css']
})
export class AssignRolesComponent implements OnInit {
  allActiveRolesForProjects:any[]=[];
  allActiveRoles:any[]=[];
  allActiveProjects:any[]=[];

  faPlusSquare=faPlusSquare;
  faTrashAlt=faTrashAlt;
  faEdit=faEdit;
  assignRoleToProjFG:FormGroup;

  constructor(private _serRoles:RolesService,
              private _serFormBuilder:FormBuilder,
              private _serProjects:ProjectsService
    ) { 
      this.assignRoleToProjFG=this._serFormBuilder.group({
        'fctlRoleName':new FormControl ({ value: '', }, [Validators.required]),
        'fctlProjectName':new FormControl ({ value: '', }, [Validators.required]),
        'fctlRoleIsActive':new FormControl ({ value: '', }, [Validators.required])
      });

    }

  ngOnInit(): void {
    this.getRolesActiveForallProjects();

    this._serRoles.getActiveRoles()
        .subscribe(res=>{
          console.log('=======getActiveRoles=========');
          this.allActiveRoles=res['dbQryResponse'];
          console.log(this.allActiveRoles);
        });
    
    this._serProjects.getAllProjects()
        .subscribe(res=>{
          console.log('=======getAllProjects=========');
          this.allActiveProjects=res['dbQryResponse'];
          console.log(this.allActiveProjects);
        })

  }

  getRolesActiveForallProjects(){
    this._serRoles.getRolesActiveForAllProjects()
        .subscribe(res=>{
            console.log(res);
            this.allActiveRolesForProjects=res['dbQryResponse'];
        });
  }
}
