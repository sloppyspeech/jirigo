import { BarChartComponent } from './../../shared/modules/charts/bar-chart/bar-chart.component';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Router,ActivatedRoute} from '@angular/router';
import {TaskTicketLinkService} from '../../services/task-ticket-links/task-ticket-link.service';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';
import { ErrorMessageService } from '../../services/error_messages/error-message.service';
import { ReferencesService} from '../../services/references/references.service';
import * as FileSaver from 'file-saver';


declare var $:any;
@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit {
  fileName:string='';
  fileUrl:string='';
  launchIt:boolean=false;
  newModalContent:string='';
  newModalContent2:string="";
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"image-manager"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET,PUT,OPTIONS,DELETE,POST',
      "Access-Control-Allow-Headers":"Content-Type"
    })
  };

  @ViewChild('barChart') barChart:BarChartComponent;


//   ganttTasks:any=[
//     {'taskNo':'Proj-1','startDate':'2020-07-01','endDate':'2020-07-20','duration':'20','days':[1,1,1,1,1,1,1,1,1,1,1,1,1,1]},
//     {'taskNo':'Proj-2','startDate':'2020-07-05','endDate':'2020-07-10','duration':'15','days':[0,0,0,1,1,1,1,1,1,1,1,1,0,0]},
//     {'taskNo':'Proj-3','startDate':'2020-07-07','endDate':'2020-07-15','duration':'8','days':[0,0,0,0,0,1,1,1,1,1,1,1,1,0]}
// ];
  
  Tableau20 = ['#4E79A7', '#A0CBE8', '#F28E2B', '#FFBE7D', '#59A14F', '#8CD17D', '#B6992D', '#F1CE63', '#499894', '#86BCB6', '#E15759', '#FF9D9A', '#79706E', '#BAB0AC', '#D37295', '#FABFD2', '#B07AA1', '#D4A6C8', '#9D7660', '#D7B5A6'];
  assigneeColors={};
  ganttTasks:any=[
    {'taskNo':'Proj-1','startDate':'2020-07-01','endDate':'2020-07-20','duration':'20','assignee':'AAAA','days':[1,1,1,1,1,1,1,1,1,1,1,1,1,1]},
    {'taskNo':'Proj-2','startDate':'2020-07-05','endDate':'2020-07-10','duration':'15','assignee':'BBBB','days':[0,0,0,1,1,1,1,1,1,1,1,1,0,0]},
    {'taskNo':'Proj-3','startDate':'2020-07-07','endDate':'2020-07-15','duration':'8','assignee':'CCCC','days':[0,0,0,0,0,1,1,1,1,1,1,1,1,0]},
    {'taskNo':'Proj-4','startDate':'2020-07-06','endDate':'2020-07-08','duration':'6','assignee':'AAAA','days':[0,0,0,0,1,1,1,1,1,1,1,0,0,0]},
    {'taskNo':'Proj-5','startDate':'2020-07-02','endDate':'2020-07-08','duration':'6','assignee':'BBBB','days':[0,0,0,0,1,1,1,1,1,1,1,0,0,0]},
    {'taskNo':'Proj-6','startDate':'2020-07-03','endDate':'2020-07-18','duration':'6','assignee':'BBBB','days':[0,0,0,0,1,1,1,1,1,1,1,0,0,0]},
    {'taskNo':'Proj-7','startDate':'2020-07-06','endDate':'2020-07-11','duration':'6','assignee':'CCCC','days':[0,0,0,0,1,1,1,1,1,1,1,0,0,0]},
    {'taskNo':'Proj-8','startDate':'2020-07-08','endDate':'2020-07-08','duration':'6','assignee':'CCCC','days':[0,0,0,0,1,1,1,1,1,1,1,0,0,0]},
    {'taskNo':'Proj-9','startDate':'2020-07-02','endDate':'2020-07-13','duration':'6','assignee':'CCCC','days':[0,0,0,0,1,1,1,1,1,1,1,0,0,0]},
    {'taskNo':'Proj-10','startDate':'2020-07-04','endDate':'2020-07-08','duration':'6','assignee':'DDDD','days':[0,0,0,0,1,1,1,1,1,1,1,0,0,0]},
    {'taskNo':'Proj-11','startDate':'2020-07-02','endDate':'2020-07-16','duration':'6','assignee':'EEEE','days':[0,0,0,0,1,1,1,1,1,1,1,0,0,0]},
    {'taskNo':'Proj-12','startDate':'2020-07-10','endDate':'2020-07-19','duration':'6','assignee':'AAAA','days':[0,0,0,0,1,1,1,1,1,1,1,0,0,0]},
    {'taskNo':'Proj-13','startDate':'2020-07-02','endDate':'2020-07-28','duration':'6','assignee':'AAAA','days':[0,0,0,0,1,1,1,1,1,1,1,0,0,0]}
  ];

  chartOptions:any={
    chartType:'bar',
    barChartElementId:'id_mycanvas',
    barChartType:'horizontalBar',
    chartLabels:['A','B','C','D'],
    chartData:[9,1,15,4],
    xAxisLabel:'x-axis is here',
    yAxisLabel:'y-axis is here'
  }
  typeahead: FormControl = new FormControl();
  testFC: FormControl = new FormControl();
  suggestions:string[]=[];
   countries:string[]=[
      "Afghanistan",
      "Albania",
      "Algeria",
      "Andorra",
      "Angola",
      "Anguilla",
      "Antigua &amp; Barbuda",
      "Argentina",
      "Armenia",
      "Aruba",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bermuda",
      "Bhutan",
      "Bolivia",
      "Bosnia &amp; Herzegovina",
      "Botswana",
      "Brazil",
      "British Virgin Islands",
      "Brunei",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cambodia",
      "Cameroon",
      "Cape Verde",
      "Cayman Islands",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Congo",
      "Cook Islands",
      "Costa Rica",
      "Cote D Ivoire",
      "Croatia",
      "Cruise Ship",
      "Cuba",
      "Cyprus",
      "Czech Republic",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Estonia",
      "Ethiopia",
      "Falkland Islands",
      "Faroe Islands",
      "Fiji",
      "Finland",
      "France",
      "French Polynesia",
      "French West Indies",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Gibraltar",
      "Greece",
      "Greenland",
      "Grenada",
      "Guam",
      "Guatemala",
      "Guernsey",
      "Guinea",
      "Guinea Bissau",
      "Guyana",
      "Haiti",
      "Honduras",
      "Hong Kong",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland",
      "Isle of Man",
      "Israel",
      "Italy",
      "Jamaica",
      "Japan",
      "Jersey",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kuwait",
      "Kyrgyz Republic",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Macau",
      "Macedonia",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Mauritania",
      "Mauritius",
      "Mexico",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Montserrat",
      "Morocco",
      "Mozambique",
      "Namibia",
      "Nepal",
      "Netherlands",
      "Netherlands Antilles",
      "New Caledonia",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "Norway",
      "Oman",
      "Pakistan",
      "Palestine",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Puerto Rico",
      "Qatar",
      "Reunion",
      "Romania",
      "Russia",
      "Rwanda",
      "Saint Pierre &amp; Miquelon",
      "Samoa",
      "San Marino",
      "Satellite",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "South Africa",
      "South Korea",
      "Spain",
      "Sri Lanka",
      "St Kitts &amp; Nevis",
      "St Lucia",
      "St Vincent",
      "St. Lucia",
      "Sudan",
      "Suriname",
      "Swaziland",
      "Sweden",
      "Switzerland",
      "Syria",
      "Taiwan",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Timor L'Este",
      "Togo",
      "Tonga",
      "Trinidad &amp; Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Turks &amp; Caicos",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "Uruguay",
      "Uzbekistan",
      "Venezuela",
      "Vietnam",
      "Virgin Islands (US)",
      "Yemen",
      "Zambia",
      "Zimbabwe",
      "ZimbabweZimbabweZimbabweZimbabweZimbabweZimbabweZimbabweZimbabweZimbabwe"
  ];
  @ViewChild('myModal') myModal:ElementRef;
//   constructor(
//     private _formBuilder: FormBuilder,
//     private _router:Router,
//     private _taskTicketLinkSer:TaskTicketLinkService,
//     private _httpCli:HttpClient,
//     private _ren2:Renderer2,
//     private _errSer:ErrorMessageService ,
//     private _serReferences:ReferencesService
//     ) {
// }
  constructor(
    private _httpCli:HttpClient,
    private _serReferences:ReferencesService
    ) {
}
  projectType: any[] = [
    {name: 'Scrum', code: 'Scrum'},
    {name: 'Kanban', code: 'Kanban'},
    {name: 'ScrumBan', code: 'ScrumBan'}
  ];
  qtd:any[] = [{
  }];
  
  data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            borderColor: '#565656'
        }
    ]
};



  filteredTaskTickets:any=[];
  selectedTaskTickets:any=[];
  ganttHeaderDates:any[]=[];
  selectedFile:any;
  debugFG: FormGroup;
  statusGrid:Array< {
                      status:string ,
                      nextStatuses:Array<{
                                          name:string,
                                          allowed:boolean
                                      }> 
                    }>=[];

  // projStatuses=['Open','Analysis','Dev'];
  projStatuses=['Open','Analysis','Dev','Code Review','QA Testing','UAT','Release','Closed'];

  ngOnInit(): void {
    this.testFC.setValue('Test Button');
    this.showGantt();
  }

  ngAfterViewInit() {
  }
  
  showGantt(){

    let startDate;
    let endDate;
    this.ganttHeaderDates=this.getDatesArray('2020-07-01', '2020-07-28');
    this.assignDevColors();
    console.log('-----------------Dates Start------------------------');
    for(let i=0;i<this.ganttTasks.length;i++){
      startDate=this.ganttTasks[i]['startDate'];
      endDate=this.ganttTasks[i]['endDate'];
      this.ganttTasks[i]['days']=this.getTaskWorkDates('2020-07-01', '2020-07-28',startDate,endDate);
    }
    console.log(this.ganttTasks);
    console.log('-----------------Dates End------------------------');
    // this.getTaskWorkDates('2020-01-01', '2020-01-15','2020-01-05', '2020-01-10');
  }

  assignDevColors(){
    let assignees=[];
    for (let i=0;i<this.ganttTasks.length;i++){
      if(!assignees.includes(this.ganttTasks[i]['assignee'])){
        assignees.push(this.ganttTasks[i]['assignee']);
      }
    }
    console.log(assignees);
    for (let i=0;i<assignees.length;i++){
      this.assigneeColors[assignees[i]]=this.Tableau20[i];
    }
    console.log(this.assigneeColors);
  }

  drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }






 
  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
    let uploadData = new FormData();

    let url=this.sApiEndPoint+'/image'
    console.log(url);
    console.log(this.selectedFile.name)
    uploadData.append('created_by',localStorage.getItem('loggedInUserId'));
    uploadData.append('file', this.selectedFile,this.selectedFile.name);
    console.log(uploadData.has('fileName'));
    console.log(uploadData.get('fileName'));
    console.log(uploadData.get('created_by'));
    this._httpCli.post(url,uploadData)
        .subscribe(res=>{
          console.log("============");
          console.log(res);
        })
  }



  // openModal(){
    
  //   this._ren2.removeClass(this.myModal.nativeElement, 'hide');
  //   this._ren2.addClass(this.myModal.nativeElement, "show");
  // }

  // closeModal(){
  //   console.log('closemodal Called');
  //   this._ren2.removeClass(this.myModal.nativeElement, 'show');
  //   this._ren2.addClass(this.myModal.nativeElement, "hide");
  // }

  testLaunch(){
    this.launchIt=!this.launchIt;
    console.log('openModal');
    this.newModalContent='HEHEREdsfdsfsdRE';
    this.newModalContent2="Helllsdweoiuweldkslmfdlsfsd";
  }


  suggestCountry(){
    this.suggestions = this.countries
      .filter(c => c.startsWith(this.typeahead.value))
      .slice(0, 5);
  }

  selectVal(s){
    console.log('select val '+s);
    this.typeahead.setValue(s);
    this.suggestions=[];
  }
  chgColor(){
    $("p").css("color","#FF7671");
    this.downloadFile();
  }
  closess(){
    console.log('blurred');
    this.suggestions=[];
  }
  initialiseDD(){
    this.suggestions=[];
  }

  makeChoice(e){
    console.log(e);
  }

  downloadFile() {
    this._serReferences.getAllRefsForShowAndEdit()
        .subscribe(data=>{
          console.log(data);
          this.fileName="NewFile.json";
          let val=this.ConvertReferencesToCSV(data['dbQryResponse'][0], ['ref_id','ref_category','ref_name','ref_value','is_active','order_id','project_id','project_name']);
          console.log(val);
          const blob = new Blob([val], { type: 'text/csv' });
          this.fileUrl= window.URL.createObjectURL(blob);
          window.URL.revokeObjectURL(this.fileUrl);
          FileSaver.saveAs(blob,'New File');
          
        });
  }

  ConvertReferencesToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';
    for (let index in headerList) {
     row += headerList[index] + ',';
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

   getDatesArray(pStartDate,pEndDate){
    let startDate= new Date(pStartDate);
    let endDate= new Date(pEndDate);
    let datesArray:any[]=[];
    let idx=0;
       while(true){
        let tempDate=new Date(pStartDate);
        tempDate.setDate(startDate.getDate()+idx)
        console.log(`${tempDate} : ${endDate}`);
        datesArray.push(tempDate);
        if (tempDate.getTime() == endDate.getTime()){
          break;
        }
        idx++;
     }
     return datesArray;
   }
   getTaskWorkDates(pSprintStartDate,pSprintEndDate,pTaskStartDate,pTaskEndDate){
     console.log('getTaskDates');
     let sprintStartDate= new Date(pSprintStartDate);
     let sprintEndDate= new Date(pSprintEndDate);
     let taskStartDate= new Date(pTaskStartDate);
     let taskEndDate= new Date(pTaskEndDate);
     let taskWorkDates:any[]=[];
     console.log(taskEndDate);

     let idx=0;
     while(true){
      let tempDate=new Date(sprintStartDate);
        tempDate.setDate(sprintStartDate.getDate()+idx)
        // console.log(`${tempDate} : ${sprintEndDate}`);
        
        if (tempDate.getTime()>= taskStartDate.getTime() && tempDate.getTime() <= taskEndDate.getTime()){
          taskWorkDates.push({'sprintDate':tempDate,'isTaskScheduledDay':true});
        }
        else{
          taskWorkDates.push({'sprintDate':tempDate,'isTaskScheduledDay':false});
        }

        if (tempDate.getTime() == sprintEndDate.getTime()){
          break;
        }
      idx++;
     }

     console.log(taskWorkDates);
     return taskWorkDates;
   }

}
