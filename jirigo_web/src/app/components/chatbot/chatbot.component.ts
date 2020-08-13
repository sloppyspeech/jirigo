import { Component, OnInit ,ViewChild,ElementRef,Renderer2} from '@angular/core';
import { faAngleDoubleDown,faComments,faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import { ChatbotService } from './../../services/chatbot/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatDisplaySection')  chatDisplaySection: ElementRef;
  @ViewChild('chatBotQueryInputBox')  chatBotQueryInputBox: ElementRef;
  showChatWindow:boolean=false;
  chatData:chatDataType[]=[];
  faAngleDoubleDown=faAngleDoubleDown;
  faTrashAlt=faTrashAlt;
  faComments=faComments;
  userQuery:string="";
  showWaitingSpinner:boolean=false;

  constructor(
    private _serChatBot:ChatbotService,
    private _renderer:Renderer2
  ) { }

  ngOnInit(): void {
    console.log("Chatbot Initializing");
    let currDate=new Date();
    let lChatData;
      lChatData={
        chatId:0,
        isQuestion:false,
        chatText:`Hi,how  are you?`,
        chatDate: currDate.toLocaleTimeString()
      }
      this.chatData.push(lChatData);
      this.scrollToBottom();
      this.chatBotQueryInputBox?.nativeElement.focus();
      this._serChatBot.getProjectDetails();

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
    this.chatBotQueryInputBox?.nativeElement.focus();
  }

  toggleChatWindow(){
    console.log("toggleChatWindow");
    this.showChatWindow=!this.showChatWindow;
    console.log(this.showChatWindow);
  }

  askQuestion(){
    this.showWaitingSpinner=true;
    console.log('Ask Question');
    let currDate=new Date();
    let lChatData={
      chatId:0,
      isQuestion:true,
      chatText:this.userQuery,
      chatDate: currDate.toLocaleTimeString()
    };
    this.chatData.push(lChatData);
    this._serChatBot.getQueryResponse(this.userQuery)
        .subscribe(res=>{
            if(res['dbQryResponse'] && res['dbQryStatus']=="Success"){
              lChatData={
                chatId:0,
                isQuestion:false,
                chatText:res['dbQryResponse'],
                chatDate: currDate.toLocaleTimeString()
              };
              setTimeout(() => {
                this.chatData.push(lChatData);
                this.showWaitingSpinner=false;
              }, 1000);
            }
        });
    this.userQuery="";
    
  }
  scrollToBottom(){
    if(this.chatDisplaySection){
      this.chatDisplaySection.nativeElement.scrollTop=this.chatDisplaySection.nativeElement.scrollHeight;
    }
  }

  checkEnterAndAskQuestion(e){
    if (e.code == "Enter"){
      this.askQuestion(); 
    }
  }

  clearChat(){
    this.chatData=[];
  }

  formatItemStatus(){
    
  }

}
export interface chatDataType{
  chatId:number,
  isQuestion:boolean,
  chatText:string,
  chatDate:string
};
