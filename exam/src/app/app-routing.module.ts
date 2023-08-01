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
import { FeedComponent } from './feed/feed/feed.component';
import { DetailsComponent } from './details/details/details.component';

const routes: Routes = [
  {path:'login',component:LoginComponent,canActivate:[mustBeLoggedOut],title:'Login'},
  {path:'register',component:RegisterComponent,canActivate:[mustBeLoggedOut],title:'Register'},
  {path:'logout',component:LogoutComponent,canActivate:[mustBeLoggedIn],title:"Logout"},
  {path:'user/:username',component:ProfileComponent,title:"Profile"},
  {path:'account/settings',component:SettingsComponent,canActivate:[mustBeLoggedIn],title:"Settings"},
  {path:'feed',component:FeedComponent,title:"Feed"},
  {path:'post/:postId',component:DetailsComponent,title:"Post"},
  {path:"",redirectTo:'/feed',pathMatch:"full"},
  {path:'**',component:NotFoundComponent,title:"Not found"},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
