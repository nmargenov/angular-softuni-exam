import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent {
  constructor(private userService:UserService){}
  @Output() feedChange = new EventEmitter<string>(); 

  get isLoggedIn(){
    return this.userService.isLoggedIn;
  }

  feed='explore';
  changeState(state: string) {
    this.feed = state;
    this.feedChange.emit(state);
  }
}
