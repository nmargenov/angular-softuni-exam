import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-choose-feed',
  templateUrl: './choose-feed.component.html',
  styleUrls: ['./choose-feed.component.css']
})
export class ChooseFeedComponent {
  @Output() feedChange = new EventEmitter<string>(); 

  feed='myPosts';
  changeState(state: string) {
    this.feed = state;
    this.feedChange.emit(state);
  }
}
