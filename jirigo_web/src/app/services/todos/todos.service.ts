import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"todos-management/"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET,PUT,OPTIONS,DELETE,POST',
      "Access-Control-Allow-Headers":"Content-Type"
    }),
    body:{}
  };
  constructor(
    private _httpCli:HttpClient
  ) { }

  getAllTodosForUser(inpData){
    let url = this.sApiEndPoint +`all-todos?user_id=${inpData['user_id']}&limit=${inpData['limit']}&offset=${inpData['offset']}`;
    console.log(url);
    return this._httpCli.get(url);
  }

  getAllTodosForUserByInterval(inpData){
    let url = this.sApiEndPoint +`all-todos-by-interval?user_id=${inpData['user_id']}&interval_days=${inpData['interval_days']}&limit=${inpData['limit']}&offset=${inpData['offset']}`;
    console.log(url);
    return this._httpCli.get(url);
  }

  getAllTodosForUserByLabel(inpData){
    let url = this.sApiEndPoint +`labels-filtered?user_id=${inpData['user_id']}&label_id=${inpData['label_id']}&limit=${inpData['limit']}&offset=${inpData['offset']}`;
    console.log(url);
    return this._httpCli.get(url);
  }

  getAllTodosForUserByStatus(inpData){
    let url = this.sApiEndPoint +`status-filtered?user_id=${inpData['user_id']}&todo_status=${inpData['todo_status']}&limit=${inpData['limit']}&offset=${inpData['offset']}`;
    console.log(url);
    return this._httpCli.get(url);
  }

  getTodoCategoriesForUser(inpData){
    let url = this.sApiEndPoint +`user-categories?user_id=${inpData['user_id']}`;
    console.log(url);
    return this._httpCli.get(url);
  }

  getTodoLabelsForUser(inpData){
    let url = this.sApiEndPoint +`all-todo-labels?user_id=${inpData['user_id']}`;
    console.log(url);
    return this._httpCli.get(url);
  }

  createTodoForUser(inpData){
    let url = this.sApiEndPoint +`todo`;
    console.log(url);
    return this._httpCli.post(url,inpData,this.sHttpOptions);
  }

  createCategoryForUser(inpData){
    let url = this.sApiEndPoint +`category`;
    console.log(url);
    return this._httpCli.post(url,inpData,this.sHttpOptions);
  }

  updateCategoryForUser(inpData){
    let url = this.sApiEndPoint +`category`;
    console.log(url);
    return this._httpCli.put(url,inpData,this.sHttpOptions);
  }

  updateTodoForUser(inpData){
    let url = this.sApiEndPoint +`todo`;
    console.log(url);
    return this._httpCli.put(url,inpData,this.sHttpOptions);
  }

  deleteTodoForUser(inpData){
    let url = this.sApiEndPoint +`todo`;
    this.sHttpOptions.body ={
      'todo_id':inpData['todo_id']
    };
    return this._httpCli.delete(url, this.sHttpOptions);
  }

  createLabelForTodo(inpData){
    let url = this.sApiEndPoint +`label`;
    console.log(url);
    return this._httpCli.post(url,inpData,this.sHttpOptions);
  }

  deleteLabelForTodo(inpData){
    let url = this.sApiEndPoint +`label`;
    this.sHttpOptions.body ={
      'label_id':inpData['label_id'],
      'todo_id':inpData['todo_id']
    };
    return this._httpCli.delete(url, this.sHttpOptions);
  }

}

