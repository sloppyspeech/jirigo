import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TaskCommentsService } from '../../../services/tasks/task-comments.service';
import { NgxSpinnerService  }  from 'ngx-spinner';
import { Router} from '@angular/router';


@Component({
  selector: 'app-task-comments',
  templateUrl: './tasks-comments.component.html',
  styleUrls: ['./tasks-comments.component.css']
})
export class TaskCommentsComponent implements OnInit {
  @Input()
  parentForm: FormGroup;

  editorStyle = {
    height: '200px'
  };

  allComments;

  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      // ['blockquote', 'code-block'],
      // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      // [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }]
      // ['clean'],                                         // remove formatting button
      // ['link', 'image']                         // link and image, video
    ]
  };

  constructor(
    private _serTaskComments: TaskCommentsService,
    private _serNgxSpinner:NgxSpinnerService,
    private _router:Router
  ) { }

  ngOnInit(): void {
    console.log('===========Task Component NgInit=============');
    console.log(this.parentForm.getRawValue());
    console.log("===============================================");
    this._serNgxSpinner.show();

    this._serTaskComments.getAllTaskComments(this.parentForm.get('fctlTaskNo').value)
      .subscribe(res => {
        console.log("=========" + res['dbQryStatus'] + "=========");
        if (res['dbQryStatus'] == "Success") {
          console.log(res['dbQryResponse']);
          this.allComments = res['dbQryResponse'];
          this._serNgxSpinner.hide();
          console.log("==================");
        }
        else{
          console.log(res['dbQryStatus']);
          this._serNgxSpinner.hide();
        }
      })
    
  }

  saveComment() {
    this._serNgxSpinner.show();
    var checkCommentVal=""
    var inpData = {
      "comment": this.parentForm.get('fctlComment').value,
      "task_no": this.parentForm.get('fctlTaskNo').value,
      "created_by": localStorage.getItem('loggedInUserId')
    }
    console.log("-------fctlComment Length--------");
    console.log(inpData.comment);
    checkCommentVal=inpData.comment.replace(/\<.*?\>/g,"").trim();
    console.log("checkCommentVal:["+checkCommentVal+"]");
    console.log(checkCommentVal.length);
    console.log("---------------");
    if (checkCommentVal.length != 0) {
      console.log(inpData);
      this._serTaskComments.createComment(inpData)
        .subscribe(res => {
          console.log("Task Creation Status");
          console.log(JSON.stringify(res));
          this.parentForm.reset();
          setTimeout(() => {
            this.getTaskComments(inpData['task_no']);
            this.reloadComponent();
            this._serNgxSpinner.hide();
          }, 1200);
        });
    }
    else{
      alert("No Comment Text Specified");
    }

  }

  getTaskComments(taskNo) {
    this._serTaskComments.getAllTaskComments(taskNo)
      .subscribe(res => {
        console.log("=========" + res['dbQryStatus'] + "=========");
        if (res['dbQryStatus'] == "Success") {
          console.log(res['dbQryResponse']);
          this.allComments = res['dbQryResponse'];
          console.log("==================");
        }
      })
  }
  reloadComponent() {
    console.log("===============reloadComponent=================");
    console.log(this._router.url);
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate([this._router.url]);
}
}
