import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-calendar',
  templateUrl: './project-calendar.component.html',
  styleUrls: ['./project-calendar.component.css']
})
export class ProjectCalendarComponent implements OnInit {
  numRows=6;
  numCols=7;
  startDate:any;
  currMonthDates:any[]=[];
  currMonthFirstDayIdx:number=0;
  currMonthLastDayIdx:number=0;
  lastDayofWeek:number=6;
  currMonth= ((new Date(Date.now()).getMonth())+1).toString();
  constructor() { }

  ngOnInit(): void {
    console.clear()
    this.startDate=new Date(Date.now());
    console.log(this.startDate.getMonth())
    this.startDate=new Date(this.startDate.getFullYear(),this.startDate.getMonth(),1);
    console.log(this.startDate);
    this.getCurrMonthDates(this.startDate);
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

}
