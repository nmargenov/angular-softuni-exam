import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { PublicInfoComponent } from './public-info/public-info.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrivateInfoComponent } from './private-info/private-info.component';
import { PasswordComponent } from './password/password.component';



@NgModule({
  declarations: [
    SettingsComponent,
    PublicInfoComponent,
    PrivateInfoComponent,
    PasswordComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    FontAwesomeModule
  ]
})
export class SettingsModule { }
