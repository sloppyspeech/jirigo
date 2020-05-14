import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, AfterViewInit, EventEmitter } from '@angular/core';
import { FormControl,FormGroup,Validator,FormBuilder} from '@angular/forms';
import { ReferencesService } from './../../../services/references/references.service';


@Component({
  selector: 'app-edit-reference',
  templateUrl: './edit-reference.component.html',
  styleUrls: ['./edit-reference.component.css']
})
export class EditReferenceComponent implements OnInit {
  @Input () showEditRefModal : boolean=false;
  @Input () inpRefValuesToEdit:any[];
  @Output () refModalClosed = new EventEmitter;
  @Output () onSuccessRefereshRefGrid = new EventEmitter;

  hasError:boolean=false;
  errorMessage:string="";
  editRefFG:FormGroup;

  constructor(private _formBuilder:FormBuilder,
    private _serReferences:ReferencesService) { }

  ngOnInit(): void {
    this.hasError=false;
    this.errorMessage="";

    this.editRefFG= this._formBuilder.group({
      fctlProjectName: new FormControl({value:this.inpRefValuesToEdit['project_name'],disabled:true}),
      fctlRefCategory: new FormControl({value:this.inpRefValuesToEdit['ref_category'],disabled:true}),
      fctlRefName: new FormControl({value:this.inpRefValuesToEdit['ref_name'],disabled:true}),
      fctlRefValue: new FormControl(this.inpRefValuesToEdit['ref_value']),
      fctlIsActive: new FormControl(this.inpRefValuesToEdit['is_active']),
      fctlRefId: new FormControl(this.inpRefValuesToEdit['ref_id']),
      fctlOrderId: new FormControl(this.inpRefValuesToEdit['order_id'])
    });
  }

  getFctlVal(formControlName){
    return this.editRefFG.get(formControlName).value;
  }

  cancelReference(){
    this.refModalClosed.emit(true);
  }
  editReference(){
    console.log("=====createReference====");
    let lprojectName=this.getFctlVal('fctlProjectName')
    let lrefCategory=this.getFctlVal('fctlRefCategory');
    let lrefName=this.getFctlVal('fctlRefName');
    let lrefValue=this.getFctlVal('fctlRefValue');
    let lisActive=this.getFctlVal('fctlIsActive');
    let lrefId=this.getFctlVal('fctlRefId');
    let lorderId=this.getFctlVal('fctlOrderId');

    let inpData={
      'project_name': lprojectName ,
      'ref_category':  lrefCategory ,
      'ref_name': lrefName ,
      'ref_value': lrefValue ,
      'modified_by': localStorage.getItem('loggedInUserId'),
      'is_active':lisActive,
      'ref_id':lrefId,
      'order_id':lorderId
    };

    console.log(inpData);

    this._serReferences.editReference(inpData)
        .subscribe(res=>{
          console.log(res);
          if (res['dbQryStatus'] == "Success"){
            this.showEditRefModal=false;
            this.onSuccessRefereshRefGrid.emit('Success')
          }
          else{
              this.hasError=true;
              this.errorMessage=res['dbQryResponse']
          }
        });
  }

}
