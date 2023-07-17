import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from './create-post/create-post.component';
import { FeedComponent } from './feed/feed.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { StateComponent } from './state/state.component';



@NgModule({
  declarations: [
    CreatePostComponent,
    FeedComponent,
    StateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ]
})
export class FeedModule { }
