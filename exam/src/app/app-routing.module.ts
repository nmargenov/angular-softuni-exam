import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { mustBeLoggedIn } from './guards/must-be-logged-in.guard';
import { mustBeLoggedOut } from './guards/must-be-logged-out.guard';

import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { RegisterComponent } from './auth/register/register.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { SettingsComponent } from './settings/settings/settings.component';

const routes: Routes = [
  {path:'login',component:LoginComponent,canActivate:[mustBeLoggedOut]},
  {path:'register',component:RegisterComponent,canActivate:[mustBeLoggedOut]},
  {path:'logout',component:LogoutComponent,canActivate:[mustBeLoggedIn]},
  {path:'user/:username',component:ProfileComponent},
  {path:'account/settings',component:SettingsComponent,canActivate:[mustBeLoggedIn]},
  {path:'**',component:NotFoundComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
