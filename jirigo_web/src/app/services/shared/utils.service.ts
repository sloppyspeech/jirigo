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

  
}
