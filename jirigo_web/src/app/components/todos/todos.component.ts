import { Component, OnInit,ViewChild,ElementRef,Renderer2,ChangeDetectorRef } from '@angular/core';
import { UtilsService } from './../../services/shared/utils.service';
import { TodosService } from './../../services/todos/todos.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { faCircle,faDotCircle,faLayerGroup,faTrashAlt,faSearch,faTh,faListUl} from '@fortawesome/free-solid-svg-icons';
import { faEdit,faPlusSquare,faArrowAltCircleLeft,faArrowAltCircleRight }  from '@fortawesome/free-regular-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { Router  } from '@angular/router';
import * as $ from 'jquery'

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  faCircle=faCircle;
  faEdit=faEdit;
  faDotCircle=faDotCircle;
  faLayerGroup=faLayerGroup;
  faTrashAlt=faTrashAlt;
  faPlusSquare=faPlusSquare;
  faArrowAltCircleLeft=faArrowAltCircleLeft;
  faArrowAltCircleRight=faArrowAltCircleRight;
  faTh=faTh;
  faListUl=faListUl;
  faSearch=faSearch;
  todosBroadcast:any;
  rows_limit:number=5;
  row_offset:number=0;

  toggleTodoListToColumns=true;
  showTodoCntBadgeFor:any={
    'AllTodos':false,
    '0Days':false,
    '7Days':false,
    '30Days':false,
    'Done':false
  };

  showColorPicker:boolean=false;

  @ViewChild('addTodoModalButton', { static: false }) addTodoModalButton: ElementRef;
  @ViewChild('openAddCategoryModalButton', { static: true }) openAddCategoryModalButton: ElementRef;
  @ViewChild('categoryCircles', { static: true }) categoryCircle:ElementRef;
  @ViewChild('addLabel', { static: false }) addLabel:ElementRef;
  @ViewChild('nextTodosForSevenDays', { static: false }) nextTodosForSevenDays:ElementRef;

  categoryEdit:boolean=false;
  todoEdit:boolean=false;
  enableCategoryEditIcon:boolean=false;
  allToDos:todo[]=[];
  allToDos$: BehaviorSubject <todo[]> ;
  allToDosFromDB:todo[]=[];
  todoFG:FormGroup;
  categoryFG:FormGroup;
  labelFG:FormGroup;
  todoCategories:any={};
  todoCategoriesArr:any[]=[]
  todoLabels:any[]=[];
  minDate:any;
  toggleShowCategories:boolean=false;
  toggleShowLabels:boolean=false;
  todoStrtArrIdx:number=0;
  todoNumRows:number=5;
  todoPagination=0;
  todoEndArrIdx:number=0;
  Math=Math;

  constructor(
    private _serTodos:TodosService,
    private _formBuilder:FormBuilder,
    private _renderer:Renderer2,
    private _serUtils:UtilsService,
    private _changeDetectRef:ChangeDetectorRef,
    private _router:Router

  ) { }

  ngOnInit(): void {
    let todaysDate= new Date();
    this.minDate= this._serUtils.parseDateAsYYYYMMDD(todaysDate.toISOString());
    this.todoCategories={};
    
    this.todoFG=  this._formBuilder.group({
      fctlTodoText : new FormControl({ value: '', disabled: false }, [Validators.required,Validators.minLength(1),Validators.maxLength(140)]),
      fctlTodoCategory : new FormControl({ value: 'Select Category', disabled: false }),
      fctlTodoEndDate: new FormControl({ value: '', disabled: false }),
      fctlTodoId: new FormControl({ value: '', disabled: false }),
      fctlTodoStatus: new FormControl({ value: '', disabled: false }),
    });

    this.categoryFG=  this._formBuilder.group({
      fctlTodoCategory : new FormControl({ value: '', disabled: false },[Validators.required,Validators.minLength(1),Validators.maxLength(30)]),
      fctlTodoCategoryColor : new FormControl({ value: '#2962FF', disabled: false }),
      fctlTodoCategoryId : new FormControl({ value: '0', disabled: false })
    });

    this.labelFG=  this._formBuilder.group({
      fctlTodoLabel : new FormControl({ value: '', disabled: false },[Validators.required,Validators.minLength(1),Validators.maxLength(20)]),
      fctlTodoLabelId : new FormControl({ value: '', disabled: false }),
      fctlTodoId : new FormControl({ value: '', disabled: false })
    });


    this.getCategories();
    this.getTodos('all');
    this.getTodoLabels();

    this.todosBroadcast= new BroadcastChannel('todo-broadcast');
    this.todosBroadcast.onmessage = (message) =>{
      console.log("*******todosBroadcast*********");
      console.log(message['data']);
      this.getTodos('all');
      // this._changeDetectRef.detectChanges();
      setInterval(() => { this._changeDetectRef.detectChanges(); }, 1000);
      console.log("***************")
    };


  }

  getTodos(filter){
    console.log('getTodosCalled');
    this.allToDos=[];
    this.allToDosFromDB=[];

      this._serTodos.getAllTodosForUser({'user_id':localStorage.getItem('loggedInUserId')})
          .subscribe(res=>{
            console.log(res);
            res['dbQryResponse'].forEach(e => {
              this.allToDos.push({
                todo_status:e.todo_status,
                todo_text:e.todo_text,
                end_date:e.end_date,
                category:e.category,
                category_id:e.category_id,
                todo_id:e.todo_id,
                category_color:e.colorhex,
                todo_labels:e.todo_labels
              });
            });
            this.allToDosFromDB=this.allToDos;
            this.allToDos$=new BehaviorSubject<todo[]>(this.allToDos);
            console.log(this.allToDos);
          });
    
  }

  getTodosByInterval(interval_days:string,event){
    this.setActiveLinkClass(event);

    console.log('getTodosByInterval :'+interval_days);
    console.log(this.allToDosFromDB);
    console.log(this.allToDos);
    this._serTodos.getAllTodosForUserByInterval({'user_id':localStorage.getItem('loggedInUserId'),'interval_days':interval_days})
        .subscribe(res=>{
          console.log(res);
          this.allToDos=[];
          this.allToDosFromDB=[];
          if (res['dbQryResponse']){
            res['dbQryResponse'].forEach(e => {
              console.log(e);
              this.allToDos.push({
                todo_status:e.todo_status,
                todo_text:e.todo_text,
                end_date:e.end_date,
                category:e.category,
                category_id:e.category_id,
                todo_id:e.todo_id,
                category_color:e.colorhex,
                todo_labels:e.todo_labels
              });
            });
            this.allToDosFromDB=this.allToDos;
            console.log(this.allToDosFromDB);
            console.log(this.allToDos);

            // Set the first todos for landing page
            this.todoStrtArrIdx=0;
            this.todoEndArrIdx=this.todoNumRows;
          }
          this.setTodoCounter(interval_days+'Days');
          
        });
  }

  setTodoCounter(filterKey){
    //reset all counts to false
    Object.keys(this.showTodoCntBadgeFor).forEach(v => this.showTodoCntBadgeFor[v] = false);
    this.showTodoCntBadgeFor[filterKey]=true;
  }

  getCategories(){
    this.todoCategoriesArr=[];
    this.todoCategories={};
    this._serTodos.getTodoCategoriesForUser({'user_id':localStorage.getItem('loggedInUserId')})
        .subscribe(res=>{
          console.log(res);
          res['dbQryResponse'].forEach(e => {
            this.todoCategories[e.category]=e.category_id;
            e['edit']=false;
            e['active']=false;
            this.todoCategoriesArr.push(e);
          });
          console.log(this.todoCategories);
          console.log(this.todoCategoriesArr);
        });
  }


  getTodoLabels(){
    this.todoLabels=[];
    this._serTodos.getTodoLabelsForUser({'user_id':localStorage.getItem('loggedInUserId')})
        .subscribe(res=>{
          console.log(res);
          if (res['dbQryStatus']=="Success"){
            this.todoLabels=res['dbQryResponse'];
            this.nextTodosForSevenDays.nativeElement.click();
          }

        // Set default todos on landing page 
        });
  }

  setCategory(value){
    this.todoFG.get('fctlTodoCategory').setValue(value);
  }

  setTodosToDBVals(event){
    this.setActiveLinkClass(event);
    this.getTodos('All');
    this.setTodoCounter('AllTodos');
  }

  setCategoryColor(e){
    this.categoryFG.get('fctlTodoCategoryColor').setValue(e);
    this.showColorPicker=false;
    
  }

  setSelectedLabel(labelItem){
    console.log(labelItem);
    this.labelFG.get('fctlTodoLabel').setValue(labelItem.label);
    this.labelFG.get('fctlTodoLabelId').setValue(labelItem.label_id);
  }

  setActiveLinkClass(event){
    $("div").removeClass('todo-label-active');
    event.srcElement.classList.add('todo-label-active');
  }
  openAddCategory(){
    if (!this.categoryEdit){
      this.categoryFG.get('fctlTodoCategory').setValue('');
    }
  }

  todoAction(){
    if (this.todoEdit){
      this.updateTodo();
    }
    else{
      this.createTodoSaveDB()
    }
  }

  todoCategoryAction(){
    if (this.categoryEdit){
      this.editCategorySaveToDB();
    }
    else{
      this.createCategorySaveToDB()
    }
  }

  createCategorySaveToDB(){
    console.log('createCategorySaveToDB');
    let inpData = {
      'category': this.categoryFG.get('fctlTodoCategory').value,
      'user_id':localStorage.getItem('loggedInUserId'),
      'category_color':this.categoryFG.get('fctlTodoCategoryColor').value
    };
    console.log(inpData);
    this._serTodos.createCategoryForUser(inpData)
        .subscribe(res=>{
          console.log("----------------------");
          console.log(res);
          this.categoryFG.reset();
          this.openAddCategoryModalButton.nativeElement.click();
          this.todosBroadcast.postMessage({'mesg_text':'categoryCreated'});
        });
  }

  editCategorySaveToDB(){
    console.log('editCategorySaveToDB');
    let inpData = {
      'category': this.categoryFG.get('fctlTodoCategory').value,
      'user_id':localStorage.getItem('loggedInUserId'),
      'category_color':this.categoryFG.get('fctlTodoCategoryColor').value,
      'category_id':this.categoryFG.get('fctlTodoCategoryId').value
    };
    console.log(inpData);
    this._serTodos.updateCategoryForUser(inpData)
        .subscribe(res=>{
          console.log("----------------------");
          console.log(res);
          if(res['dbQryStatus']=="Success"){
            for(let i=0;i<this.todoCategoriesArr.length;i++){
              if(this.todoCategoriesArr[i]['category_id'] === this.categoryFG.get('fctlTodoCategoryId').value){
                this.todoCategoriesArr[i]['colorhex']=this.categoryFG.get('fctlTodoCategoryColor').value;
                this.todoCategoriesArr[i]['category']=this.categoryFG.get('fctlTodoCategory').value;
                break;
              }
            }
          }
          // this.getTodos('all');
          this.categoryFG.reset();
          this.openAddCategoryModalButton.nativeElement.click();
          this.todosBroadcast.postMessage({'mesg_text':'todoCategoryUpdated'});
          this.reloadComponent();
        });
  }

  editTodo(todo){
    console.log('Edit Todo');
    this.todoEdit=true;
    console.log(todo);
    this.todoFG.get('fctlTodoId').setValue(todo.todo_id);
    this.todoFG.get('fctlTodoStatus').setValue(todo.todo_status);
    this.todoFG.get('fctlTodoText').setValue(todo.todo_text);
    this.todoFG.get('fctlTodoCategory').setValue(todo.category);
    this.todoFG.get('fctlTodoEndDate').setValue(this._serUtils.parseDateAsYYYYMMDD(todo.end_date));
    console.log(todo.end_date);
    console.log(this._serUtils.parseDateAsYYYYMMDD(todo.end_date));
    this.addTodoModalButton.nativeElement.click();
  }

  editCategory(category){
    this.categoryEdit=true;
    console.log(category);
    this.categoryFG.get('fctlTodoCategory').setValue(category.category);
    this.categoryFG.get('fctlTodoCategoryColor').setValue(category.colorhex);
    this.categoryFG.get('fctlTodoCategoryId').setValue(category.category_id);
    this.openAddCategoryModalButton.nativeElement.click();
  }

  filterTodosByCategory(category,event){
    this.allToDos=[];
    this.setActiveLinkClass(event);

    console.log('category is :'+category);
    console.log(this.allToDosFromDB);
    this.activateCategoryLink(category);

    if (category != 'All'){
      this.allToDosFromDB.forEach(e=>{
        if(e['category']==category){
          this.allToDos.push(e);
        }
      });
      this.setTodoCounter(category);
    }
    else{
      this.allToDos=this.allToDosFromDB;
    }
  }

   filterTodosByStatus(status,event){
    // console.log(this.allToDos$.value)
    // this.allToDos=this.allToDos$.value;
    // this.setActiveLinkClass(event);

    // console.log('status is :'+status);
    // console.log(this.allToDosFromDB);
    // this.activateCategoryLink(status);

    // if (status != 'All'){
    //   this.allToDos=[];
    //   this.allToDos$.value.forEach(e=>{
    //     if(e['todo_status']==status){
    //       console.log(e);
    //       this.allToDos.push(e);
    //     }
    //   });
    //   console.log(this.allToDos);
    //   if(status=='Done'){
    //     console.log('Setting COunter for Done')
    //     this.setTodoCounter('Done');
    //   }
    // }
    // else{
    //   this.allToDos=this.allToDosFromDB;
    // }
    let inpData={
      'user_id':localStorage.getItem('loggedInUserId'),
      'todo_status':status
    }
    this._serTodos.getAllTodosForUserByStatus(inpData)
        .subscribe(res=>{
          if (res['dbQryStatus'] == "Success" && res['dbQryResponse']){
            this.allToDos=res['dbQryResponse'];
            console.log(this.allToDos);
            if(status=='Done'){
                  console.log('Setting COunter for Done')
                  this.setTodoCounter('Done');
                }
          }
        })

  }


  filterTodosByLabel(label,event){
    this.allToDos=[];
    this.setActiveLinkClass(event);

    console.log('label is :'+label);
    this.activateCategoryLink(label);
    console.log(this.allToDosFromDB);

    if (label != 'All'){
      this.allToDosFromDB.forEach(e=>{
        e.todo_labels?.forEach(l=>{
          if(l['label']==label){
            this.allToDos.push(e);
          }
        })
      });
    }
    else{
      this.allToDos=this.allToDosFromDB;
    }
  }

  activateCategoryLink(category){
    for(let i=0;i<this.todoCategoriesArr.length;i++){
      if(this.todoCategoriesArr[i]['category'] === category){
        this.todoCategoriesArr[i]['active']=true;
      }
      else{
        this.todoCategoriesArr[i]['active']=false;
      }
    }
  }

  openAddTodo(){
    this.getCategories();
    if(!this.todoEdit){
      this.todoFG.get('fctlTodoText').setValue('');
      this.todoFG.get('fctlTodoCategory').setValue('Select Category');
      this.todoFG.get('fctlTodoEndDate').setValue('');
    }
  }

  createTodoSaveDB(){
    console.log('create To Do');
    let inpData = {
      'todo_text': this.todoFG.get('fctlTodoText').value,
      'category_id':this.todoCategories[this.todoFG.get('fctlTodoCategory').value],
      'todo_status':'Open',
      'end_date':this._serUtils.getDateInYYYYMMDD(this.todoFG.get('fctlTodoEndDate').value),
      'created_by':localStorage.getItem('loggedInUserId')
    };
    console.log(inpData);
    this._serTodos.createTodoForUser(inpData)
        .subscribe(res=>{
          console.log("----------------------");
          console.log(res);
          // this.addTodoModalButton.nativeElement.click();
          // this.getTodos('all');
          this.todosBroadcast.postMessage({'mesg_text':'todoCreated'});
        })
  }

 
  
  updateTodoStatus(todo_item,status){
    console.log(todo_item);
    let inpData = {
      'todo_text': todo_item.todo_text,
      'category_id':todo_item.category_id,
      'todo_status':status,
      'todo_id':todo_item.todo_id,
      'end_date':todo_item.end_date,
      'modified_by':localStorage.getItem('loggedInUserId')
    };
    console.log(inpData);
    this._serTodos.updateTodoForUser(inpData)
        .subscribe(res=>{
            console.log(res);
            if(res['dbQryStatus'] == "Success"){
              // for(let i=0;i<this.allToDos.length;i++){
              //   if (this.allToDos[i].todo_id == todo_item.todo_id){
              //     this.allToDos[i].todo_status=status;
              //     break;
              //   }
              // }
              this.getTodos('all');
              this.todosBroadcast.postMessage({'mesg_text':'todoStatusUpdated'});
            }            
        });
  }

  updateTodo(){
    console.log('create To Do');
    let inpData = {
      'todo_id': this.todoFG.get('fctlTodoId').value,
      'todo_status': this.todoFG.get('fctlTodoStatus').value,
      'todo_text': this.todoFG.get('fctlTodoText').value,
      'category_id':this.todoCategories[this.todoFG.get('fctlTodoCategory').value],
      'end_date':this._serUtils.getDateInYYYYMMDD(this.todoFG.get('fctlTodoEndDate').value),
      'created_by':localStorage.getItem('loggedInUserId')
    };
    console.log('updateTodo');
    console.log(inpData);
    this._serTodos.updateTodoForUser(inpData)
        .subscribe(res=>{
          console.log("----------------------");
          console.log(res);
          // this.getTodos('all');
          this.todoEdit=false;
          this.todoFG.reset();
          this.addTodoModalButton.nativeElement.click();
          this.todosBroadcast.postMessage({'mesg_text':'todoDeleted'});
        })
  }

  deleteTodo(todo){
    console.log(todo);
    console.log('deleteTodo');
    let inpData = {
      'todo_id': todo.todo_id
    };
    console.log(inpData);
    this._serTodos.deleteTodoForUser(inpData)
        .subscribe(res=>{
          console.log("----------------------");
          console.log(res);
          // this.getTodos('all');
          this.todosBroadcast.postMessage({'mesg_text':'todoDeleted'});
        });
  }
  createLabel(){
    let inpData={
      'todo_label':this.labelFG.get('fctlTodoLabel').value,
      'todo_id':this.labelFG.get('fctlTodoId').value,
      'label_id':this.labelFG.get('fctlTodoLabelId').value
    };
    console.log(inpData);
    this._serTodos.createLabelForTodo(inpData)
        .subscribe(res=>{
          console.log(res);
          if(res['dbQryStatus']=="Success"){
              this.addLabel.nativeElement.click();
              this.labelFG.reset();
              // this.getTodos('all');
              this.todosBroadcast.postMessage({'mesg_text':'todosLabelCreated'});
              this.getTodoLabels();
          } 
        });

  }
  deleteLabel(labelId,todoId){
    let inpData={
      'label_id':labelId,
      'todo_id':todoId
    };
    console.log(inpData);
    this._serTodos.deleteLabelForTodo(inpData)
        .subscribe(res=>{
          console.log(res);
          // this.getTodos('all');
          this.todosBroadcast.postMessage({'mesg_text':'todosLabelDeleted'});
          this.getTodoLabels();
        })
  }

  labelAdderClicked(todo){
    this.labelFG.reset();
    console.log(todo);
    this.labelFG.get('fctlTodoId').setValue(todo.todo_id);
  }

  searchTodos(event){
    console.log(event.target.value);
    if (event.target.value?.length == 0){
      this.allToDos=[];
      this.allToDos=this.allToDosFromDB;
    }
    else{
      this.allToDos=[];
      this.allToDosFromDB.forEach(item=>{
        Object.keys(item).forEach(k=>{
          if (item[k]?.toString().toLowerCase().indexOf(event.target.value.toLowerCase()) >=0){
            // console.log(k+":"+item[k]);
            this.allToDos.push(item);
          }
        })
      });
      console.log(this.allToDos);
    }
  }

  reloadComponent() {
    console.log("===============reloadComponent=================");
    console.log(this._router.url);
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate([this._router.url]);
  }

}


export interface todo{
  todo_status:string,
  todo_text:string,
  end_date:string,
  category:string,
  category_id:string,
  todo_id:string,
  category_color:string,
  todo_labels:any[]
}