import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details/details.component';
import { PostComponent } from './post/post.component';
import { SharedModule } from '../shared/shared.module';
import { EditPostComponent } from './edit-post/edit-post.component';
import { FormsModule } from '@angular/forms';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { ListCommentsComponent } from './list-comments/list-comments.component';
import { EditCommentComponent } from './edit-comment/edit-comment.component';



@NgModule({
  declarations: [
    DetailsComponent,
    PostComponent,
    EditPostComponent,
    AddCommentComponent,
    ListCommentsComponent,
    EditCommentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ]
})
export class DetailsModule { }
