import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scrum-board',
  templateUrl: './scrum-board.component.html',
  styleUrls: ['./scrum-board.component.css']
})
export class ScrumBoardComponent implements OnInit {
  availableCars:any=
 [
          {"brand": "VW", "year": 2012, "color": "Orange", "vin": "dsad231ff"},
          {"brand": "Audi", "year": 2011, "color": "Black", "vin": "gwregre345"},
          {"brand": "Renault", "year": 2005, "color": "Gray", "vin": "h354htr"},
          {"brand": "BMW", "year": 2003, "color": "Blue", "vin": "j6w54qgh"},
          {"brand": "Mercedes", "year": 1995, "color": "Orange", "vin": "hrtwy34"},
          {"brand": "Volvo", "year": 2005, "color": "Black", "vin": "jejtyj"},
          {"brand": "Honda", "year": 2012, "color": "Yellow", "vin": "g43gr"},
          {"brand": "Jaguar", "year": 2013, "color": "Orange", "vin": "greg34"},
          {"brand": "Ford", "year": 2000, "color": "Black", "vin": "h54hw5"},
          {"brand": "Fiat", "year": 2013, "color": "Red", "vin": "245t2s"}
];


  selectedCars:any[]=[];

  draggedCar: any[]=[];

  constructor() { }

  ngOnInit(): void {
  }

  dragStart(event,car: any) {
    console.log("dragging car :"+JSON.stringify(car));
    this.draggedCar = car;
}

drop(event) {
    if (this.draggedCar) {
        console.log(JSON.stringify(this.draggedCar));
        let draggedCarIndex = this.findIndex(this.draggedCar);
        // this.selectedCars = [...this.selectedCars, this.draggedCar];
        this.selectedCars.push(this.draggedCar);
        this.availableCars = this.availableCars.filter((val,i) => i!=draggedCarIndex);
        this.draggedCar = null;
    }
}

dragEnd(event) {
    this.draggedCar = null;
}

findIndex(car: any) {
    let index = -1;
    for(let i = 0; i < this.availableCars.length; i++) {
        if (car.vin === this.availableCars[i].vin) {
            index = i;
            break;
        }
    }
    return index;
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