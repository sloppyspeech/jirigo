import { AvatarServiceService } from './../../../services/shared/avatar-service.service';
import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TicketCommentsService } from '../../../services/tickets/ticket-comments.service';
import { NgxSpinnerService  }  from 'ngx-spinner';
import { Router,ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-ticket-comments',
  templateUrl: './ticket-comments.component.html',
  styleUrls: ['./ticket-comments.component.css']
})
export class TicketCommentsComponent implements OnInit {
  disableComment:boolean=true;
  avatarImg:string="";

  @Input()
  parentForm: FormGroup;

  @Output()
  ticketCommentLogged=new EventEmitter;

  quillEditor:any='';
  editorStyle = {
    height: '12.5rem',
    backgroundColor:'#F8F8F8'
  };

  allComments;

  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
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
      ['clean'],                                         // remove formatting button
      // ['link', 'image']                         // link and image, video
    ]
  };

  constructor(
    private _serTicketComments: TicketCommentsService,
    private _serNgxSpinner:NgxSpinnerService,
    private _router:Router,
    private _activatedRoute: ActivatedRoute,
    private _avatarImgSer:AvatarServiceService
  ) { }

  ngOnInit(): void {
    this.avatarImg=this._avatarImgSer.getUserAvatarImage();
    console.log('===========Ticket Component NgInit=============');
    console.log(this.parentForm.getRawValue());
    console.log('fctlComment :'+this.parentForm.get('fctlComment').value);
    this.parentForm.get('fctlComment').enable();

    console.log("===============================================");
    this._serNgxSpinner.show();

    this._serTicketComments.getAllTicketComments(this.parentForm.get('fctlTicketNo').value)
      .subscribe(res => {
        console.log("=========" + res['dbQryStatus'] + "=========");
        if (res['dbQryStatus'] == "Success") {
          console.log(res['dbQryResponse']);
          this.allComments = res['dbQryResponse'];
          this._serNgxSpinner.hide();
          console.log("==================");
        }
        else{
          console.log(res['dbQryResponse']);
          this._serNgxSpinner.hide();
          console.log("==================");
        }
      })
    
  }

  saveComment() {
    this._serNgxSpinner.show();
    var checkCommentVal=""
    var inpData = {
      "comment": this.parentForm.get('fctlComment').value,
      "ticket_no": this.parentForm.get('fctlTicketNo').value,
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
      this._serTicketComments.createComment(inpData)
        .subscribe(res => {
          console.log("Ticket Creation Status");
          console.log(JSON.stringify(res));
          this.parentForm.reset();
          setTimeout(() => {
            this.getTicketComments(inpData['ticket_no']);
            // this.reloadComponent();
            this._serNgxSpinner.hide();
            this.ticketCommentLogged.next('ticketCommentLogged');
          }, 1200);
        });
    }
    else{
      alert("No Comment Text Specified");
    }

  }

  getTicketComments(ticketNo) {
    this._serTicketComments.getAllTicketComments(ticketNo)
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
    let currentUrl = this._router.url;
    console.log(currentUrl.substring(0,currentUrl.indexOf('?')));
    console.log(this._activatedRoute.snapshot.queryParams);
    // this._router.navigate([this._router.url]);
    this._router.navigate([currentUrl.substring(0,currentUrl.indexOf('?'))],{queryParams: this._activatedRoute.snapshot.queryParams});

}

onEditorCreated(quill) {
  this.quillEditor = quill;
}

execCommentFocusFunctions(){
  console.log(this.quillEditor.options.container.style.backgroundColor);
  this.quillEditor.options.container.style.backgroundColor='white';
}
execCommentBlurFunctions(){
  console.log(this.quillEditor.options.container.style.backgroundColor);
  this.quillEditor.options.container.style.backgroundColor='#F8F8F8';
}
execOnEditorChanged(){
}

getCommentVal(){
  return this.parentForm.get('fctlComment').value?.trim();
}


}
