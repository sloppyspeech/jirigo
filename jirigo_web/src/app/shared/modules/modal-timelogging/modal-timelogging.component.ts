import { Component, OnInit,Input,Output,EventEmitter,SimpleChanges,Renderer2,ElementRef,ViewChild,ChangeDetectorRef } from '@angular/core';
import { FormControl,FormGroup,FormBuilder,Validators} from '@angular/forms';

@Component({
  selector: 'm-modal-timelogging',
  templateUrl: './modal-timelogging.component.html',
  styleUrls: ['./modal-timelogging.component.css']
})
export class ModalTimeloggingComponent implements OnInit {
  @Input('show-time-logger') showTimeLoggerModal;
  @Input('title') modalTitle:string;
  @Input('cancel-label') cancelLabel:string;
  @Input('confirm-label') confirmLabel:string;
  @Input('activity-list') activityList:any[]=[];
  
  @Output('cancelled') canceledEventEmitter = new EventEmitter();
  @Output('confirmed') confirmedEventEmitter = new EventEmitter();

  @ViewChild('openModal',{static: false})  openModal:ElementRef;
  
  loggedTime:number=0;
  selectedActivity:string="";
  otherActivity:string="";
  actualDate:any=Date.now();
  comment:string="";
  enableOtherActivityInput:boolean=false;
  invalidHoursMsg:string='';
  invalidMinutesMsg:string='';
  tActivityList:any[]=[];

  modalCheckslist:any[]=[
    {'name':'hoursValid','active':true},
    {'name':'minutesValid','active':true},
    {'name':'otherActivityCommentValid','active':true}
  ];
  readonly errorMessages={
    'hoursValid':'Invalid Hours, should be between 0 - 23',
    'minutesValid':'Invalid Minutes, should be between 0 - 23',
    'otherActivityCommentValid':"If Activity is 'Other Activity', activity comment field is mandatory"
  }

  modTimeLogFG:FormGroup;

  errorList:any[]=[];
  
  constructor(private _formBuilder:FormBuilder,private _cdr:ChangeDetectorRef) {
    this.modTimeLogFG= this._formBuilder.group({
      fctlHours: new FormControl(0,{validators:[Validators.required,Validators.min(0),Validators.max(23)],updateOn:'blur'}),
      fctlMinutes: new FormControl(0,{validators:[Validators.minLength(0),Validators.min(0),Validators.max(59)],updateOn:'blur'}),
      fctlActivity: new FormControl(null,{validators:[Validators.required]}),
      fctlActivityDate: new FormControl(null,{validators:[Validators.required]}),
      fctlActivityComment: new FormControl(''),
      fctlOtherActivityComment: new FormControl('')
    });

   }

  ngOnInit(){
    console.log("ModalTimeLoggingComponentInit");
    this.modTimeLogFG.reset();


    
  }

ngAfterContentChecked() {
    
  this.modTimeLogFG.get('fctlActivity').valueChanges
  .subscribe(value => {
    if(value == "Other Activity") {
      this.modTimeLogFG.get('fctlOtherActivityComment').setValidators(Validators.required)
    } else {
      this.modTimeLogFG.get('fctlOtherActivityComment').clearValidators();
    }
  }
  );
}

  openMod(){
    
    this.modTimeLogFG.reset();
    this.modTimeLogFG.get('fctlMinutes').setValue(0);
    this.tActivityList=this.tActivityList.length >0 ? this.tActivityList :this.activityList;
    this.modalTitle = this.modalTitle ? this.modalTitle : "Log Time";
    this.cancelLabel = this.cancelLabel ? this.cancelLabel : "Cancel";
    this.confirmLabel = this.confirmLabel ? this.confirmLabel : "Confirm";

    console.log('Open Mod called');
    console.log(this.activityList.length);
    console.log(this.tActivityList.length);
    console.log(this.tActivityList);
    console.log(this.activityList);

    if(this.activityList){
      let tempDateVar:any[]=[];
      this.tActivityList.forEach(ele=>{
        tempDateVar.push(ele['name']);
      });
      this.activityList=tempDateVar;
    }
    this.openModal.nativeElement.click();
  }


  closeMod(){
    console.log('Closed Mod called');
    this.openModal.nativeElement.click();
  }

  // resetAllFields(){
  //   console.log("---------------------")
  //   console.log(this.inpHours.nativeElement.value)
  //   console.log(this.inpMinutes.nativeElement.value)
  //   console.log("---------------------")
  //   this.modTimeLogFG.reset();
  // };

  cancelTimeLog(){
    console.log('cancelTimeLog');
    this.showTimeLoggerModal=false;
    this.canceledEventEmitter.next(false);
    this.modTimeLogFG.reset();
    return false;
  }

  confirmTimeLog(){
    console.log(this.modTimeLogFG.getRawValue());
    console.log(this.modTimeLogFG.get('fctlHours').errors);
    console.log(this.modTimeLogFG.get('fctlHours').hasError('required'));
    console.log(this.modTimeLogFG.get('fctlMinutes').errors);
    console.log(this.modTimeLogFG.get('fctlMinutes').hasError('required'));
    // console.log(this.modTimeLogFG.get('fctlMinutes').);
    let outputData={
      'loggedTime':(this.modTimeLogFG.get('fctlHours').value*60 )+ this.modTimeLogFG.get('fctlMinutes').value,
      'selectedActivity':this.modTimeLogFG.get('fctlActivity').value,
      'otherActivity':this.modTimeLogFG.get('fctlOtherActivityComment').value,
      'actualDate':this.modTimeLogFG.get('fctlActivityDate').value,
      'comment':this.modTimeLogFG.get('fctlActivityComment').value
    };
    console.log(outputData);
      if(this.modTimeLogFG.valid){
        this.confirmedEventEmitter.next(outputData);
        this.closeMod();
        return false;
      }


  }

  activitySelected(val){
    console.log('activitySelected');
    this.enableOtherActivityInput=false;
    this.selectedActivity=val;
    this.otherActivity='';

    console.log(val);
    if (val == "Other Activity"){
      this.enableOtherActivityInput=true;
    }
  }

}
