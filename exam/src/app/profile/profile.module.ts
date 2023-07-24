import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ChooseFeedComponent } from './choose-feed/choose-feed.component';



@NgModule({
  declarations: [
    ProfileComponent,
    ChooseFeedComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ]
})
export class ProfileModule { }
