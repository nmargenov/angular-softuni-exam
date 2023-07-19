import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details/details.component';
import { PostComponent } from './post/post.component';
import { SharedModule } from '../shared/shared.module';
import { EditPostComponent } from './edit-post/edit-post.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DetailsComponent,
    PostComponent,
    EditPostComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ]
})
export class DetailsModule { }
