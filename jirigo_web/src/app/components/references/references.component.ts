import { Component, OnInit } from "@angular/core";

import { ReferencesService } from "./../../services/references/references.service";
import { faPencilAlt,faEdit } from "@fortawesome/free-solid-svg-icons";
import { FormControl, FormBuilder, FormGroup, Validator } from "@angular/forms";

@Component({
  selector: "app-references",
  templateUrl: "./references.component.html",
  styleUrls: ["./references.component.css"],
})
export class ReferencesComponent implements OnInit {
  faPencilAlt = faPencilAlt;
  faEdit=faEdit;
  showTable = true;
  showAddRefModal = true;
  showAddRefTemplate = false;
  showEditRefTemplate =false;
  ddProjectName: string = "";
  ddRefCategory: string = "";
  ddRefName: string = "";
  project_id = localStorage.getItem("currentProjectId");
  projectList = new Set();
  refNameList = new Set();
  refCategoryList = new Set();
  searchFields = {};
  defProjectName:string= localStorage.getItem("currentProjectName");

  addReferenceFG: FormGroup;
  refValuesToEdit:any[]=[];
  //------ p-table
  allRefs: any[] = [];
  filteredRefs: any[] = [];
  
  testButtonVal:string="Choose A Value";

  refColHeaders: { header: string; name: string,width:string }[] = [
    // {'header':'Project','name':'project_id'},  §
    { header: "Ref Category", name: "ref_category",width:'10%' },
    { header: "Ref Name", name: "ref_name" ,width:'10%' },
    { header: "Ref Value", name: "ref_value" ,width:'20%' },
    { header: "Active", name: "is_active" ,width:'5%' },
    { header: "Order", name: "order_id" ,width:'5%' },
  ];

  constructor(
    private _serReferences: ReferencesService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.allRefs = [];
    this.showAddRefTemplate = false;

    this.addReferenceFG = this._formBuilder.group({
      fctlProject_id: new FormControl(""),
      fctlRefCategory: new FormControl(""),
      fctlRefName: new FormControl(""),
      fctlRefValue: new FormControl(""),
    });

    this.refColHeaders.forEach((e) => {
      this.searchFields[e["name"]] = "";
    });
    console.log(this.searchFields);

    this._serReferences.getAllRefsForShowAndEdit().subscribe((res) => {
      console.log("getAllRefsForShowAndEdit");
      console.log(res);
      res["dbQryResponse"][0].forEach((ele) => {
        ele["all_refs"].forEach((p) => {
          // this.projectList.add({'project_id':vals['project_id'],'project_name':vals['project_name']});
          this.projectList.add(p["project_name"]);
          this.refCategoryList.add(p["ref_category"]);
          this.refNameList.add(p["ref_name"]);
          this.allRefs.push(p);
          this.filteredRefs = [];
        });
      });

      /*  
          Set the project Name, to filter the grid results based on project Name
          Since the variable is bound , the grid is refereshed as well.
      */
      this.setProjectName(this.defProjectName);
    });
  }


  setProjectName(projectName) {
    this.defProjectName=projectName;
    console.log("===================setProjectName=====================");
    console.log("setProjectName :" + projectName);
    this.searchFields["project_name"] = projectName;
    this.filterResults();
    this.populateRefSearchDropDownsForProject();
  }

  /*
    Once a project has been selected, get the categories and names
    for that project.
  */
  populateRefSearchDropDownsForProject(){
    this.refCategoryList=new Set();
    this.refNameList=new Set();
    this.filteredRefs.forEach((p) => {
      this.refCategoryList.add(p["ref_category"]);
      this.refNameList.add(p["ref_name"]);
    });
  }

  setRefCategory(category) {
    console.log("===================setRefCategory=====================");
    console.log("category :" + category);
    this.searchFields["ref_category"] = category;
    this.filterResults();
  }

  setRefName(refName) {
    console.log(
      "===================setRefCatsetRefNameegory====================="
    );
    console.log("category :" + refName);
    this.searchFields["ref_name"] = refName;
    this.filterResults();
  }

  filterResults() {
    this.filteredRefs = this.allRefs;
    console.log("=================filterResults====================");
    console.log(this.searchFields);
    Object.keys(this.searchFields).forEach((e) => {
      if (this.searchFields[e] !== "") {
        // console.log(e +":::::" + this.searchFields[e]);
        this.filteredRefs = [
          ...this.filteredRefs.filter((array) => {
            return array[e] == this.searchFields[e];
          }),
        ];
      }
    });
    // console.log(this.filteredRefs);
  }
  
  addReference() {
    console.log("=======addReference==========");
    this.showAddRefTemplate = true;
  }
  editReference(e) {
    console.log("++++++++++++++++++++");
    console.log(e)
    this.showEditRefTemplate=true;
    this.refValuesToEdit=e;
  }

  /*
    show<action>RefTemplate flag is used to show the child
    component having the modal dialog.
    Once Insert Update is done , output event is triggered
    to close the modal window and set the show template flag to false.
  */
  setShowModalVal() {
    console.log("=========setShowModalVal called======");
    this.showAddRefTemplate = false;
    this.showEditRefTemplate = false;
  }

  refreshGridPostCRUD(event) {
    console.log("Refreshing the GRID POST CRUD");
    this.allRefs = [];

    this._serReferences.getAllRefsForShowAndEdit().subscribe((res) => {
      console.log("getAllRefsForShowAndEdit");
      console.log(res);
      res["dbQryResponse"][0].forEach((ele) => {
        ele["all_refs"].forEach((p) => {
          // this.projectList.add({'project_id':vals['project_id'],'project_name':vals['project_name']});
          this.projectList.add(p["project_name"]);
          this.refCategoryList.add(p["ref_category"]);
          this.refNameList.add(p["ref_name"]);
          this.allRefs.push(p);
          this.filteredRefs = [];
        });
      });

      /*  
          Set the project Name, to filter the grid results based on project Name
          Since the variable is bound , the grid is refereshed as well.
      */
      this.setProjectName(this.defProjectName);
    });

  }

  setTestBtnVal(e){
    this.testButtonVal=e;
  }
}
