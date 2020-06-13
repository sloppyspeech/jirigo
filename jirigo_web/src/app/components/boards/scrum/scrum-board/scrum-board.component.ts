import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,ParamMap  } from '@angular/router';

import { SprintDetailsService  }  from '../../../../services/sprints/sprint-details.service';
import { ScrumBoardService  } from '../../../../services/boards/scrum/scrum-board.service';



@Component({
  selector: 'app-scrum-board',
  templateUrl: './scrum-board.component.html',
  styleUrls: ['./scrum-board.component.css']
})
export class ScrumBoardComponent implements OnInit {
  sprint_id:string;
  t_todos:any[]=[];
  t_doings:any[]=[];
  t_reviews:any[]=[];
  t_dones:any[]=[];
  showBoard:boolean=false;

  constructor(
    private _router:Router,
    private _activatedRoute : ActivatedRoute,
    private _serSprintDetails:SprintDetailsService,
    private _serScrumBoard:ScrumBoardService
  ) { }

  ngOnInit(): void {
    this.t_todos=[];
    this.t_doings=[];
    this.t_reviews=[];
    this.t_dones=[];
  
    this.sprint_id=this._activatedRoute.snapshot.queryParamMap.get("sprint_id");
    console.log("Inside Init sprint_id :"+this.sprint_id);
    this._serScrumBoard.getAllTasksOfASprintForScrumBoard(this.sprint_id)
        .subscribe(res =>{
          console.log("getAllTasksOfASprintForScrumBoard Response is :");
          console.log(res['dbQryResponse']);
          res['dbQryResponse'].forEach(task_status => {
            // console.log(task_status);
            if (typeof(task_status['To Do']) !== "undefined"){
              // console.log("To Do");
              task_status['To Do'].forEach(val => {
                this.t_todos.push(val);
              });
              // console.log(this.t_todos);
            }
            else if (typeof(task_status['Doing']) !== "undefined"){
              // console.log("Doing");
              task_status['Doing'].forEach(val => {
                this.t_doings.push(val);
              });
              // console.log(JSON.stringify(this.t_doings));
            }
            else if (typeof(task_status['Review']) !== "undefined"){
              // console.log("Review");
              task_status['Review'].forEach(val => {
                this.t_reviews.push(val);
              });
              // console.log(this.t_reviews);
            }
            else if (typeof(task_status['Done']) !== "undefined"){
              // console.log("Done");
              task_status['Done'].forEach(val => {
                this.t_dones.push(val);
              });
              // console.log(this.t_dones);
            }
            else {
            //   null;
            }
          });
          this.showBoard=true;
        });
  }
  ngAfterViewInit() {
    
  }

  dragStart(event,car: any) {
    console.log("dragging car :"+JSON.stringify(car));
    // this.draggedCar = car;
}

drop(event) {
    // if (this.draggedCar) {
    //     console.log(JSON.stringify(this.draggedCar));
    //     let draggedCarIndex = this.findIndex(this.draggedCar);
    //     // this.selectedCars = [...this.selectedCars, this.draggedCar];
    //     this.selectedCars.push(this.draggedCar);
    //     this.availableCars = this.availableCars.filter((val,i) => i!=draggedCarIndex);
    //     this.draggedCar = null;
    // }
}

dragEnd(event) {
    // this.draggedCar = null;
}

findIndex(car: any) {
    let index = -1;
    // for(let i = 0; i < this.availableCars.length; i++) {
    //     if (car.vin === this.availableCars[i].vin) {
    //         index = i;
    //         break;
    //     }
    // }
    // return index;
}

}

/*
https://www.codeply.com/go/kJuy0MV7sk/bootstrap-4-kanban-layout
var drag = function(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
  }
  
  var allowDrop = function(ev) {
    ev.preventDefault();
    if (hasClass(ev.target,"dropzone")) {
      addClass(ev.target,"droppable");
    }
  }
  
  var clearDrop = function(ev) {
      removeClass(ev.target,"droppable");
  }
  
  var drop = function(event){
    event.preventDefault();
    var data = event.dataTransfer.getData("text/plain");
    var element = document.querySelector(`#${data}`);
    try {
      // delete the spacer in dropzone
      event.target.removeChild(event.target.firstChild);
      // add the draggable content
      event.target.appendChild(element);
      // remove the dropzone parent
      unwrap(event.target);
    } catch (error) {
      console.warn("can't move the item to the same place")
    }
    updateDropzones();
  }
  
  var updateDropzones = function(){
       //after dropping, refresh the drop target areas
        //so there is a dropzone after each item
        //using jQuery here for simplicity 
      
        var dz = $('<div class="dropzone rounded" ondrop="drop(event)" ondragover="allowDrop(event)" ondragleave="clearDrop(event)"> &nbsp; </div>');
      
        // delete old dropzones
        $('.dropzone').remove();
    
        // insert new dropdzone after each item   
        dz.insertAfter('.card.draggable');
        
        // insert new dropzone in any empty swimlanes
        $(".items:not(:has(.card.draggable))").append(dz);
    };
    
    // helpers
    function hasClass(target, className) {
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
    }
    
    function addClass(ele,cls) {
      if (!hasClass(ele,cls)) ele.className += " "+cls;
    }
    
    function removeClass(ele,cls) {
      if (hasClass(ele,cls)) {
        var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
        ele.className=ele.className.replace(reg,' ');
      }
    }
    
    function unwrap(node) {
        node.replaceWith(...node.childNodes);
    }
    

*/