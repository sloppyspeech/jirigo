import { Injectable } from '@angular/core';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvatarServiceService {
  avatarLoc:string=environment.avatarImgLoc;
  constructor() { }

  getUserAvatarImage(){
    let lDate = new Date();
    let seconds = lDate.getSeconds()%30;
    if(localStorage.getItem('loggedInUserAvatarId')){
      return `${this.avatarLoc}/${localStorage.getItem('loggedInUserAvatarId')}.png`;
    }
    else{
      return `${this.avatarLoc}/${seconds}.png`;
    }
  }
}
