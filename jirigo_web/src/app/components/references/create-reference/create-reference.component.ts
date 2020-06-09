import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, AfterViewInit, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validator, FormBuilder, Validators } from '@angular/forms';
import { ReferencesService } from './../../../services/references/references.service';

@Component({
  selector: 'app-create-reference',
  templateUrl: './create-reference.component.html',
  styleUrls: ['./create-reference.component.css']
})
export class CreateReferenceComponent implements OnInit {

  @Input () showAddRefModal : boolean=false;
  @Input () inpProjectList:any;
  @Input () inpRefCategories:any;
  @Input () inpRefNames:any;
  @Output () refModalClosed = new EventEmitter;
  @Output () onSuccessRefereshRefGrid = new EventEmitter;

  ddProjectList:any[]=[];
  ddRefCategories:any[]=[];
  ddRefNames:any[]= [];

  hasError:boolean=false;
  errorMessage:string="";
  createRefFG:FormGroup;

  constructor(private _formBuilder:FormBuilder,
              private _serReferences:ReferencesService) { }

  ngOnInit(): void {
    this.hasError=false;
    this.errorMessage="";

    this.createRefFG= this._formBuilder.group({
      fctlProjectName: new FormControl('',{validators:[Validators.required]}),
      fctlRefCategory: new FormControl('',{validators:[Validators.required]}),
      fctlRefName: new FormControl('',{validators:[Validators.required]}),
      fctlRefValue: new FormControl('',{validators:[Validators.required]}),
      fctlOrderId: new FormControl(0,{validators:[Validators.required]})
    });

    console.log("--------------------");
    console.log(this.inpProjectList);
    console.log(this.inpRefCategories);
    console.log(this.inpRefNames);
    this.inpProjectList.forEach(element => {
      this.ddProjectList.push({name:element,code:element});
    });
    this.inpRefCategories.forEach(element => {
      this.ddRefCategories.push({name:element,code:element});
    });
    this.inpRefNames.forEach(element => {
      this.ddRefNames.push({name:element,code:element});
    });
    console.log(this.ddProjectList);
    console.log(this.ddRefCategories);
    console.log(this.ddRefNames);
  
  }

  getFctlVal(formControlName){
    return this.createRefFG.get(formControlName).value;
  }

  cancelReference(){
    this.refModalClosed.emit(true);
  }
  createReference(){
    console.log("=====createReference====");

    let inpData={
      'project_name': this.getFctlVal('fctlProjectName') ,
      'ref_category': this.getFctlVal('fctlRefCategory'),
      'ref_name':this.getFctlVal('fctlRefName'),
      'ref_value':this.getFctlVal('fctlRefValue'),
      'created_by': localStorage.getItem('loggedInUserId'),
      'is_active':'Y',
      'order_id':this.getFctlVal('fctlOrderId')
    };

    console.log(inpData);

    this._serReferences.createReference(inpData)
        .subscribe(res=>{
          console.log(res);
          if (res['dbQryStatus'] == "Success"){
            this.showAddRefModal=false;
            this.onSuccessRefereshRefGrid.emit('Success')
          }
          else{
              this.hasError=true;
              this.errorMessage=res['dbQryResponse']
          }
        });
  }

}
