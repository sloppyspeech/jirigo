import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TicketCommentsService } from '../../../services/tickets/ticket-comments.service';
import { NgxSpinnerService  }  from 'ngx-spinner';

@Component({
  selector: 'app-ticket-comments',
  templateUrl: './ticket-comments.component.html',
  styleUrls: ['./ticket-comments.component.css']
})
export class TicketCommentsComponent implements OnInit {
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
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }]
      // ['clean'],                                         // remove formatting button
      // ['link', 'image']                         // link and image, video
    ]
  };

  constructor(
    private _serTicketComments: TicketCommentsService,
    private _serNgxSpinner:NgxSpinnerService
  ) { }

  ngOnInit(): void {
    console.log('===========Ticket Component NgInit=============');
    console.log(this.parentForm.getRawValue());
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
            this._serNgxSpinner.hide();
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

}
