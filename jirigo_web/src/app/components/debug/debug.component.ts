import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Router,ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit {
  vals = [
    {name: 'aaa'},
    {name: 'eee'},
    {name: 'fff'},
    {name: 'ggg'},
    {name: 'ttt'}
  ];

  projectType: any[] = [
    {name: 'Scrum', code: 'Scrum'},
    {name: 'Kanban', code: 'Kanban'},
    {name: 'ScrumBan', code: 'ScrumBan'}
  ];


  debugFG: FormGroup;

  constructor(private _formBuilder: FormBuilder,private _router:Router) {
  }

  ngOnInit(): void {
    this.debugFG = this._formBuilder.group({
      emailControl: new FormControl({value: '', disabled: false}, [Validators.required, Validators.email]),
      fctlProjectType: new FormControl({value: '', disabled: false}, Validators.required),
      fctlParentProject: new FormControl({value: '', disabled: false})
    });
    console.log(this._router.url);
    console.log(this._router.getCurrentNavigation());
  }

  createDebug() {
    console.log('Inside Create Debug');
  }

  setProjectType(pt) {
    console.log(pt);
    // this.debugFG.get('fctlProjectType').setValue(pt);
  }

  setParentProject(pp) {
    console.log(pp.target.value);
    this.debugFG.get('fctlParentProject').setValue(pp);
  }

}
