import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { PageSpinnerComponent } from './page-spinner/page-spinner.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ListPostsComponent } from './list-posts/list-posts.component';



@NgModule({
  declarations: [
    SpinnerComponent,
    PageSpinnerComponent,
    NotFoundComponent,
    ListPostsComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    SpinnerComponent,
    PageSpinnerComponent,
    NotFoundComponent,
    ListPostsComponent
  ]
})
export class SharedModule { }
