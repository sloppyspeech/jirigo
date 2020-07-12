import { Component, OnInit,ViewChild,ElementRef,Renderer2 } from '@angular/core';
import { VacationService } from './../../services/vacations/vacation.service';
import { UtilsService } from './../../services/shared/utils.service';
import { FormGroup, Validators, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { faCalendarAlt} from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-project-calendar',
  templateUrl: './project-calendar.component.html',
  styleUrls: ['./project-calendar.component.css']
})
export class ProjectCalendarComponent implements OnInit {
  @ViewChild('vacationBtn', {read: ElementRef}) vacationBtn:ElementRef;
  vacationFG:FormGroup;
  faCalendarAlt=faCalendarAlt;
  numRows=6;
  numCols=7;
  startDate:any;
  currMonthDates:any[]=[];
  currMonthFirstDayIdx:number=0;
  currMonthLastDayIdx:number=0;
  lastDayofWeek:number=6;
  currMonth= ((new Date(Date.now()).getMonth())+1).toString();
  constructor(
      private _formBuilder:FormBuilder,
      private _utilsService:UtilsService,
      private _serVacation:VacationService,
      private _serUtils:UtilsService,
      private _renderer:Renderer2
      ) { }

  ngOnInit(): void {
    console.clear()
    this.startDate=new Date(Date.now());
    console.log(this.startDate.getMonth())
    this.startDate=new Date(this.startDate.getFullYear(),this.startDate.getMonth(),1);
    console.log(this.startDate);
    this.getCurrMonthDates(this.startDate);
    this.vacationFG= this._formBuilder.group({
      fctlVacationStartDate: new FormControl({ value: '', disabled: false }, Validators.required),
      fctlVacationEndDate: new FormControl({ value: '', disabled: false }, Validators.required),
      fctlVacationDescription: new FormControl({ value: '', disabled: false }, [Validators.required,Validators.minLength(1),Validators.maxLength(50)]),
    },{validator:this.validateStartAndEndDates});

    this.vacationFG.controls['fctlVacationStartDate'].valueChanges.subscribe(value=>{
        this.checkVacationOverlap(value);
    });
  }

  validateStartAndEndDates=(fg:AbstractControl)=>{
    console.log('validateStartAndEndDates')
    if(fg.get('fctlVacationStartDate').value){
      return this._utilsService.validateStartAndEndDates(fg.get('fctlVacationStartDate').value,fg.get('fctlVacationEndDate').value)
    }
    else{
      return null;
    }
  }

  getCurrMonthDates(currDate){
    this.currMonthDates=[];
    let newDate;
    let currMonth=currDate.getMonth();
    console.log(currDate);
    for(let i =1;i<=31;i++){
      newDate=new Date(currDate.getFullYear(),currDate.getMonth(),0+i);
      if(currMonth == newDate.getMonth()){
          this.currMonthDates.push(newDate);
        }
      }
    console.log(this.currMonthDates);
    this.lPadDates(currDate);
    this.rPadDates();
  }

  lPadDates(currDate){
    console.log('-----------Lpad-----------');
    console.log(currDate);
    let dayOfWeek=currDate.getDay();
    let newDate:any[]=[];
    this.currMonthFirstDayIdx=dayOfWeek;
    console.log(dayOfWeek);
    for (let i=dayOfWeek-1;i >=0;i--){
      newDate.push(new Date(currDate.getFullYear(),currDate.getMonth(),-i));
    }
    this.currMonthDates=[...newDate,...this.currMonthDates];
    // console.log(this.currMonthDates);
  }

  rPadDates(){
    this.currMonthLastDayIdx=this.currMonthDates.length-1;
    let endDate=this.currMonthDates[this.currMonthDates.length-1];
    let nextMonthStartDate=new Date(endDate.getFullYear(),endDate.getMonth()+1,1);
    console.log('-----------rPad-----------');
    console.log(nextMonthStartDate);
    let dayOfWeek=nextMonthStartDate.getDay();
    let newDate:any[]=[];

    console.log(dayOfWeek);
    for (let i=1;i <=(this.lastDayofWeek-dayOfWeek)+1;i++){
      newDate.push(new Date(nextMonthStartDate.getFullYear(),nextMonthStartDate.getMonth(),i));
    }
    this.currMonthDates=[...this.currMonthDates,...newDate];
    console.log(this.currMonthDates);
    console.log(this.currMonthDates.length);
  }

changeMonth(nextOrPrev){
  console.log(this.startDate);
  this.startDate= new Date(this.startDate.getFullYear(),this.startDate.getMonth()+nextOrPrev,1);
  console.log(this.startDate);
  this.getCurrMonthDates(this.startDate);
}
weekToMonth(){
  this.numCols = this.numCols == 6 ? 1 :6;
}

cancelVacation(){
  this.vacationFG.reset();
}

saveVacation(){
let inpData={
  'user_id':localStorage.getItem('loggedInUserId'),
  'start_date':this._serUtils.getDateInYYYYMMDD(this.vacationFG.get('fctlVacationStartDate').value),
  'end_date':this._serUtils.getDateInYYYYMMDD(this.vacationFG.get('fctlVacationEndDate').value),
  'description':this.vacationFG.get('fctlVacationDescription').value
};
  this._serVacation.createVacationForUser(inpData)
      .subscribe(res=>{
        console.log(res);
        if (res['dbQryStatus'] == 'Success' && res['dbQryResponse']){
          this.vacationBtn.nativeElement.click();
          this.vacationFG.reset();
        }
      })
}

checkVacationOverlap(inpVal){
  this.vacationFG.controls['fctlVacationStartDate'].setErrors({'vacationOverlapping':false});
  console.log('checkVacationOverlap');
  console.log(inpVal);
  console.log(this._serUtils.getDateInYYYYMMDD(inpVal));
  let inpData={
    'user_id':localStorage.getItem('loggedInUserId'),
    'input_date':this._serUtils.getDateInYYYYMMDD(inpVal)
    };
   if (inpData['input_date']){
        this._serVacation.checkVacationOverlap(inpData)
            .subscribe(res=>{
              console.log(res['dbQryResponse']);
              if ( res['dbQryResponse'] != null){
                 this.vacationFG.controls['fctlVacationStartDate'].setErrors({'vacationOverlapping':true});
              }
            });
   }
}

}
