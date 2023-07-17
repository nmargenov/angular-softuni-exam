import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details/details.component';
import { PostComponent } from './post/post.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    DetailsComponent,
    PostComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DetailsModule { }
