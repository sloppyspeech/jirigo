import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  projectId:string;
  constructor(private _activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.projectId=this._activatedRoute.snapshot.queryParamMap.get('project_id');
    console.log(this.projectId);
  }

}
