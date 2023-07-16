import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../shared/styles.css']
})
export class LoginComponent {
  
  constructor(private userService:UserService,private router:Router){}

  errorMsg='';
  isLoading=false;

  onSubmit(form:NgForm){
    const { username, password } = form.value;
    this.isLoading=true;
    this.userService.login(username,password).subscribe(
      (data)=>{
        this.userService.setToken(data);
        this.isLoading=false;
        this.router.navigate(['/']);
      },(err)=>{
        this.isLoading=false;
        this.errorMsg=err;
      }
    )
    
  }
}
