import { DataExtractsService } from './../../services/data-extracts/data-extracts.service';
import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-data-extracts',
  templateUrl: './data-extracts.component.html',
  styleUrls: ['./data-extracts.component.css']
})
export class DataExtractsComponent implements OnInit {
  startDate:any;
  endDate:any;
  extractType:string="Tasks";
  constructor(
    private _serDataExtracts:DataExtractsService
  ) { }

  ngOnInit(): void {
  }

  setExtractType(extractType:string){
    this.extractType=extractType;
  }

  getData(){
    console.log(this.extractType);
    console.log(this.startDate);
    console.log(this.endDate);
    let ticketHeader=["ticket_no","summary","description","issue_status","issue_type","severity","priority","environment","is_blocking","creeated_by","created_date","modified_by","modified_date","reported_by","reported_date","project_name","assigned_to","module","channel","activity","time_spent","actual_date","time_logged_by","other_activity_comment","timelog_comment"]
    let taskHeader=["task_no","summary","description","issue_status","issue_type","severity","priority","environment","is_blocking","creeated_by","created_date","modified_by","modified_date","reported_by","reported_date","project_name","assigned_to","module_name","activity","time_spent_mins","actual_date","time_logged_by","other_activity_comment","timelog_comment"]
    let inpData={
      'start_date':`${this.startDate['year']}-${this.startDate['month']}-${this.startDate['day']}`,
      'end_date':`${this.endDate['year']}-${this.endDate['month']}-${this.endDate['day']}`,
    };

    if(this.extractType == 'Tickets'){
      this._serDataExtracts.getAllTicketsByDateRange(inpData)
          .subscribe(res=>{
              // console.log(JSON.stringify(res,undefined,'\t'));
              if(res['dbQryResponse'] && res['dbQryStatus'] =="Success"){
                  this.getCsvOutput(res['dbQryResponse'], ticketHeader,'TicketExtract.csv');
              }
          });
    }
    else if(this.extractType == 'Tasks'){
      this._serDataExtracts.getAllTasksByDateRange(inpData)
          .subscribe(res=>{
              // console.log(JSON.stringify(res,undefined,'\t'));
              if(res['dbQryResponse'] && res['dbQryStatus'] =="Success"){
                  this.getCsvOutput(res['dbQryResponse'], taskHeader,'Tasks.csv');
              }
          });
    }

  
  
  }

  getCsvOutput(data,headers,fileName){
    let val=this.ConvertJSONToCSV(data, headers);
    const blob = new Blob([val], { type: 'text/csv' });
    let fileUrl= window.URL.createObjectURL(blob);
    window.URL.revokeObjectURL(fileUrl);
    FileSaver.saveAs(blob,fileName);
  }

  ConvertJSONToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';
    for (let index in headerList) {
     row += headerList[index] + '§';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
     let line = (i+1)+'';
     for (let index in headerList) {
      let head = headerList[index];
      line += ',' + array[i][head];
     }
     str += line + '\r\n';
    }
    return str;
   }
}
