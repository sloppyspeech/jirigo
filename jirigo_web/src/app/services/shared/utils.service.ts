import { Injectable } from '@angular/core';
import { DatePipe  } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  dataPipe=new DatePipe('en-US');
  constructor() { }

  parseDateAsYYYYMMDD(inpDate){
    console.log("--------parseDateAsYYYYMMDD--------");
    console.log(inpDate);
    var tempDate=this.dataPipe.transform(inpDate,'y-M-d').split('-');
    console.log(tempDate);
    console.log({ "year": parseInt(tempDate[0]), "month": parseInt(tempDate[1]), "day": parseInt(tempDate[2])});
    return { "year": parseInt(tempDate[0]), "month": parseInt(tempDate[1]), "day": parseInt(tempDate[2])};
  }

  parseDateAsYYYYMMDDHH24MISS(inpDate){
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
}
