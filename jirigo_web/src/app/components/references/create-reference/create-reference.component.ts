import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, AfterViewInit, EventEmitter } from '@angular/core';
import { FormControl,FormGroup,Validator,FormBuilder} from '@angular/forms';
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
      fctlProjectName: new FormControl(''),
      fctlRefCategory: new FormControl(''),
      fctlRefName: new FormControl(''),
      fctlRefValue: new FormControl(''),
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
    let lprojectName=this.getFctlVal('fctlProjectName')
    let lrefCategory=this.getFctlVal('fctlRefCategory');
    let lrefName=this.getFctlVal('fctlRefName');
    let lrefValue=this.getFctlVal('fctlRefValue');

    let inpData={
      'project_name': lprojectName['code'] ,
      'ref_category': typeof lrefCategory == "string" ? lrefCategory : lrefCategory['code'],
      'ref_name':typeof lrefName == "string" ? lrefName : lrefName['code'],
      'ref_value':typeof lrefValue == "string" ? lrefValue : lrefValue['code'],
      'created_by': localStorage.getItem('loggedInUserId'),
      'is_active':'Y'
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
