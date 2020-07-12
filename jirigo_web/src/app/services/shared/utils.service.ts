import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { DatePipe  } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  dataPipe=new DatePipe('en-US');
  constructor() { }

  parseDateAsYYYYMMDD(inpDate){
    if(inpDate){
      console.log("--------parseDateAsYYYYMMDD--------");
      console.log(inpDate);
      var tempDate=this.dataPipe.transform(inpDate,'y-M-d').split('-');
      console.log(tempDate);
      console.log({ "year": parseInt(tempDate[0]), "month": parseInt(tempDate[1]), "day": parseInt(tempDate[2])});
      return { "year": parseInt(tempDate[0]), "month": parseInt(tempDate[1]), "day": parseInt(tempDate[2])};
    }
    else {
      return inpDate;
    }
  }

  parseDateAsYYYYMMDDHH24MISS(inpDate){
    if(inpDate){
    console.log("--------parseDateAsYYYYMMDDHH24MISS--------");
    console.log(inpDate);
    var tempDate=this.dataPipe.transform(inpDate,'y-M-d-HH-mm-ss').split('-');
    console.log(tempDate);
    console.log({ "year": parseInt(tempDate[0]), "month": parseInt(tempDate[1]), "day": parseInt(tempDate[2])});
    return { "year": parseInt(tempDate[0]), 
             "month": parseInt(tempDate[1]), 
             "day": parseInt(tempDate[2]),
             "hour":parseInt(tempDate[3]),
             "minutes":parseInt(tempDate[4]),
             "seconds":parseInt(tempDate[5])
          };
        }
    else {
        return inpDate;
    }
  }

  getDateInYYYYMMDD(inpDate,sep:string="-"){
    if(inpDate){
      console.log(inpDate)
      return inpDate['year']+sep+inpDate['month']?.toString().padStart(2,0)+sep+inpDate['day']?.toString().padStart(2,0);
    }
    else{
      return inpDate;
    }
  }

  validateStartAndEndDates(startDate,endDate){
    console.log('validateStartAndEndDates')
      console.log(startDate);
      console.log(endDate);
      if (startDate  && endDate ){
        let startDateYYYYMMDD=startDate['year']+startDate['month']+startDate['day'];
        let endDateYYYYMMDD=endDate['year']+endDate['month']+endDate['day'];
        console.log(startDateYYYYMMDD);
        console.log(endDateYYYYMMDD);
        console.log("--------------------------");
        return endDateYYYYMMDD<startDateYYYYMMDD ? {'startDateGreaterThanEndDate':true} : null;
      }
      else{
        return null;
      }
     
  }

  getAllDatesOfAMonth(inpDate:{'year':number,'month':number}){
    console.log(inpDate);
    let allDates:any[]=[];
    let newDate;
    let currMonth=inpDate['month'];
    let currYear=inpDate['year'];
    for(let i =1;i<=31;i++){
      newDate=new Date(currYear,currMonth,0+i);
      if(currMonth == newDate.getMonth()){
          allDates.push(newDate);
        }
      }
    return allDates;
  }
  
  // lPadDates(currDate){
  //   console.log('-----------Lpad-----------');
  //   console.log(currDate);
  //   let dayOfWeek=currDate.getDay();
  //   let newDate:any[]=[];
  //   let currMonthFirstDayIdx=dayOfWeek;
  //   console.log(dayOfWeek);
  //   for (let i=dayOfWeek-1;i >=0;i--){
  //     newDate.push(new Date(currDate.getFullYear(),currDate.getMonth(),-i));
  //   }
  //   this.currMonthDates=[...newDate,...this.currMonthDates];
  // }

  // rPadDates(){
  //   this.currMonthLastDayIdx=this.currMonthDates.length-1;
  //   let endDate=this.currMonthDates[this.currMonthDates.length-1];
  //   let nextMonthStartDate=new Date(endDate.getFullYear(),endDate.getMonth()+1,1);
  //   console.log('-----------rPad-----------');
  //   console.log(nextMonthStartDate);
  //   let dayOfWeek=nextMonthStartDate.getDay();
  //   let newDate:any[]=[];

  //   console.log(dayOfWeek);
  //   for (let i=1;i <=(this.lastDayofWeek-dayOfWeek)+1;i++){
  //     newDate.push(new Date(nextMonthStartDate.getFullYear(),nextMonthStartDate.getMonth(),i));
  //   }
  //   this.currMonthDates=[...this.currMonthDates,...newDate];
  //   console.log(this.currMonthDates);
  //   console.log(this.currMonthDates.length);
  // }

}
