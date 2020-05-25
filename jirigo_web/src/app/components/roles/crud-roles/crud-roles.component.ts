import { Component, OnInit } from '@angular/core';
import { RolesService } from './../../../services/roles/roles.service';
import { faPlusSquare,faTrashAlt,faEdit} from  '@fortawesome/free-regular-svg-icons'
import { FormBuilder, FormGroup,FormControl,Validators} from '@angular/forms';

@Component({
  selector: 'app-crud-roles',
  templateUrl: './crud-roles.component.html',
  styleUrls: ['./crud-roles.component.css']
})
export class CrudRolesComponent implements OnInit {
  faPlusSquare=faPlusSquare;
  faTrashAlt=faTrashAlt;
  faEdit=faEdit;
  currOperation:string='';

  editRoleFG:FormGroup;
  allActiveRoles:any[]=[];
  constructor(private _serRoles:RolesService,
              private _serFormBuilder:FormBuilder
              ) { 
    
        this.editRoleFG=this._serFormBuilder.group({
          'fctlRoleId':new FormControl ({ value: '', disabled: true }, []),
          'fctlRoleName':new FormControl ({ value: '', }, [Validators.required]),
          'fctlRoleIsActive':new FormControl ({ value: '', }, [Validators.required]),
          'fctlModifiedBy':new FormControl ({ value: '', }, [Validators.required])
        });
}
  get ef (){
    return this.editRoleFG.controls;
  }
  ngOnInit(): void {
    this.currOperation='';
    this.setActiveRoles();
  }

  setActiveRoles(){
    this._serRoles.getActiveRoles()
    .subscribe(res=>{
      if(res['dbQryStatus'] === 'Success'){
          this.allActiveRoles=res['dbQryResponse'];
      }
    });  
  }
  editRole(e){
    this.currOperation='Edit Role';
    console.log(e);
    this.ef.fctlRoleId.setValue(e.role_id);
    this.ef.fctlRoleName.setValue(e.role_name);
    this.ef.fctlRoleIsActive.setValue(e.is_active == 'Y' ? true : false);
    this.ef.fctlModifiedBy.setValue(localStorage.getItem('loggedInUserId'));
    console.log(this.editRoleFG.getRawValue());
  }

  addRole(){
    let inpData={
      role_name:this.ef.fctlRoleName.value,
      is_active:'Y',
      created_by:localStorage.getItem('loggedInUserId')
    };
    console.log('=========addRole==========');
    console.log(inpData);
    this._serRoles.addRole(inpData)
        .subscribe(res=>{
          console.log(res);
          this.setActiveRoles();
        })
  }

  updateRole(){
    this.currOperation='Edit Role';
    console.log("=======updateRole=======")
    console.log(this.currOperation);
    let inpData={
      role_id:this.ef.fctlRoleId.value,
      role_name:this.ef.fctlRoleName.value,
      is_active:this.ef.fctlRoleIsActive.value ? 'Y' : 'N',
      modified_by:localStorage.getItem('loggedInUserId')
    };
    console.log(inpData);

    this._serRoles.updateRole(inpData)
        .subscribe(res=>{
          console.log(res);
          this.setActiveRoles();
        });
      
  }

  crudRole(){
    console.log("------------crudRole------------");
    console.log(this.currOperation);
    if (this.currOperation === 'Add Role'){
      this.addRole();
    }
    else if (this.currOperation == 'Edit Role'){
      this.updateRole();
    }
  }

  resetForm(){
    this.currOperation='';
    this.editRoleFG.reset();
  }

  initializeFieldsForAddRole(){
    this.currOperation='Add Role';
    this.editRoleFG.reset();
    this.editRoleFG.get('fctlRoleIsActive').setValue('Y');
    console.log('------------initAddRole-------------')
    console.log(this.ef.fctlRoleName.value);
  }
}
