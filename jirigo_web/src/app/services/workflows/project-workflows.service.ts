import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { map, take } from "rxjs/operators";
import { BehaviorSubject, Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProjectWorkflowsService {
  sApiBaseUrl: string = environment.apiBaseUrl;
  sApiEndPoint: string = this.sApiBaseUrl + "workflows-management/";
  private sHttpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,OPTIONS,DELETE,POST",
      "Access-Control-Allow-Headers": "Content-Type",
    }),
  };

  constructor(private _httpCli: HttpClient) {}

  createProjectWorkflow(inpWorkflowData: infWorkflow) {
    let url = this.sApiEndPoint + "create-project-workflow";
    console.log(url);
    return this._httpCli.post(url, inpWorkflowData, this.sHttpOptions);
  }
}

export interface infWorkflow {
  workflow_name: string;
  project_id: number;
  next_allowed_statuses: any;
  step_full_details: any;
  workflow_type?: string;
  created_by: number;
  modified_by?: number;
}
