import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { HttpClient, } from '@angular/common/http';

import { IUser } from '../types/IUser';
import { errorHandler } from './shared/shared';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient,private cookieService:CookieService,private router:Router) { }

  private paths={
    register:'/users/register',
    login:'/users/login',
    user:'/users/:username',
    follow:'/users/follow',
    publicData:'/users/publicData/:userId',
    removeExistingImage:'/users/image/:userId',
    privateData:'/users/privateData/:userId',
    password:'/users/password/:userId',
  }

  get isLoggedIn(){
    return !!this.cookieService.get(environment.TOKEN);
  }

  get decodedToken():IUser|null{
    const token = this.cookieService.get(environment.TOKEN);
    if(token!==""){
      const decodedToken =jwtDecode(token);
      return decodedToken as IUser;
    }
    return null;
  }

  setNewToken(token:string){
    this.cookieService.delete(environment.TOKEN);
    this.cookieService.set(environment.TOKEN,token);
  }

  setToken(token:string){
    this.cookieService.set(environment.TOKEN,token);
  }

  logout(){
    this.cookieService.delete(environment.TOKEN);
    this.router.navigate(['/']);
  }

  register(username:string,password:string,rePassword:string,email:string,firstName:string,lastName:string,birthdate:string):Observable<string>{
    return this.http.post<string>(environment.REST_API+this.paths.register,{username,password,rePassword,email,firstName,lastName,birthdate}).pipe(catchError(errorHandler));
  }

  login(username:string,password:string):Observable<string>{
    return this.http.post<string>(environment.REST_API+this.paths.login,{username,password}).pipe(catchError(errorHandler));
  }

  getUser(username:string):Observable<IUser>{
    const url = environment.REST_API + this.paths.user.replace(':username', username);
    return this.http.get<IUser>(url).pipe(catchError(errorHandler));
  }

  follow(userToFollow:string,userId:string):Observable<IUser>{
    return this.http.post<IUser>(environment.REST_API + this.paths.follow,{userToFollow,userId} ).pipe(catchError(errorHandler));
  }

  editPublicData(userId:string,formData:FormData):Observable<string>{
    const url = environment.REST_API + this.paths.publicData.replace(':userId', userId);
    return this.http.patch<string>(url,formData).pipe(catchError(errorHandler));
  }

  removeExistingImage(userId:string):Observable<string>{
    const url = environment.REST_API + this.paths.removeExistingImage.replace(':userId', userId);
    return this.http.delete<string>(url).pipe(catchError(errorHandler));
  }
  
  editPrivateData(email:string,birthdate:string,userId:string):Observable<string>{
    const url = environment.REST_API + this.paths.privateData.replace(':userId', userId);
    return this.http.patch<string>(url,{email,birthdate}).pipe(catchError(errorHandler));
  }

  editPassword(oldPassword:string,newPassword:string,newRePassword:string,userId:string):Observable<string>{
    const url = environment.REST_API + this.paths.password.replace(':userId', userId);
    return this.http.patch<string>(url,{oldPassword,newPassword,newRePassword}).pipe(catchError(errorHandler));
  }


}
