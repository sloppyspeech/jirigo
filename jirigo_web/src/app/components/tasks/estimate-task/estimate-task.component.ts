import { Component, OnInit, Output,EventEmitter,Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup,FormControl,FormArray,Validators } from '@angular/forms';
import { faPlusSquare,faTrashAlt,faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { TaskEstimateService } from './../../../services/tasks/task-estimate.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-estimate-task',
  templateUrl: './estimate-task.component.html',
  styleUrls: ['./estimate-task.component.css']
})
export class EstimateTaskComponent implements OnInit {
  taskEstimateModalOpen:boolean=false;
  @Input('task_no') task_no:string="";
  @Input('showCreateEstimateModal') showCreateEstimateModal:boolean=false;
  @Input('activityList') activityList:any;
  @ViewChild('launchEstimateModal')  launchEstimateModal:ElementRef;
  @Output() creUpdEstimatestatus= new EventEmitter();
  faPlusSquare=faPlusSquare;
  faTrashAlt=faTrashAlt;
  faTimesCircle=faTimesCircle;

  activityEstimatesFA=new FormArray([]);
  constructor(
    private _serTaskEstimates:TaskEstimateService,
    private _toastService:MessageService
  ) { }

  ngOnInit(): void {
    console.log('ngOninit Estimate tasks');
    // this.addActivityEstimate();
    this._serTaskEstimates.getTaskEstimates(this.task_no)
        .subscribe(res=>{
          console.log("----------------getTaskEstimates---------------");
          console.log(res);
          if (res['dbQryResponse'] && res['dbQryStatus'] == "Success"){
            for (let i=0;i< res['dbQryResponse']?.length;i++){
              let formInp={
                'activity':res['dbQryResponse'][i]['activity'],
                'hours': (parseInt(res['dbQryResponse'][i]['estimated_time']) - parseInt(res['dbQryResponse'][i]['estimated_time'])%60)/60,
                'minutes': parseInt(res['dbQryResponse'][i]['estimated_time'])%60,
              };
              console.log(formInp);
              this.addActivityEstimate(formInp);
            }
            console.log(this.activityEstimatesFA.getRawValue());
          }
        });
  }

  addActivityEstimate(estInpData){
    let activityFG=new FormGroup({
      'activity':new FormControl(estInpData['activity'],[Validators.required]),
      'hours':new FormControl(estInpData['hours'],[Validators.required,Validators.min(0),Validators.max(999)]),
      'minutes':new FormControl(estInpData['minutes'],[Validators.required,Validators.min(0),Validators.max(59)])
    });

    this.activityEstimatesFA.push(activityFG);
  }
  removeActivityEstimate(index:number){
    this.activityEstimatesFA.removeAt(index);
  }
  toggleEstimateModal(){
    this.taskEstimateModalOpen=true;
    this.launchEstimateModal.nativeElement.click();
  }

  saveEstimateToDB(){
    let inpData={};
    let inpRecords=[];
    let inpRecord={};
    let estimated_time=0;
    console.log(this.activityEstimatesFA.getRawValue());

    for (let i=0;i<this.activityEstimatesFA.getRawValue().length;i++){
      estimated_time=parseInt(this.activityEstimatesFA.getRawValue()[i]['hours'])*60;
      estimated_time=estimated_time+ parseInt(this.activityEstimatesFA.getRawValue()[i]['minutes']);
      inpRecord={
        'activity':this.activityEstimatesFA.getRawValue()[i]['activity'],
        'estimated_time':estimated_time
      }
      inpRecords.push(inpRecord);
    }
    inpData={
      'task_no':this.task_no,
      'task_estimates':inpRecords
    };
    console.log(inpData);
    this._serTaskEstimates.createOrUpdateTaskEstimates(inpData)
        .subscribe(res=>{
          console.log(res);
          if (res['dbQryResponse'] && res['dbQryStatus']=="Success"){
            this._toastService.add({severity:'success', summary:'Success', detail:'Estimate added successfully'});
            this.creUpdEstimatestatus.emit({"status":"success","estimated_time":res['dbQryResponse']['taskEstimatedTime']});
            this.launchEstimateModal.nativeElement.click();
          }
          else{
            this._toastService.add({severity:'error', summary:'Error', detail:'Estimate addition failed'});
            this.creUpdEstimatestatus.emit({"status":"failure"});
          }
        })

  }

  cancelEstimateTaskModal(){
    // this.activityEstimatesFA.reset();
    this.taskEstimateModalOpen=false;
  }
}
