import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../shared/styles.css']
})
export class RegisterComponent {

  constructor(private userService: UserService, private router: Router) { }

  isLoading = false;
  errorMsg = "";

  onSubmit(form: NgForm): void {
    const { username, password, rePassword, email, firstName, lastName, birthdate } = form.value;
    this.isLoading = true;
    this.userService.register(username, password, rePassword, email, firstName, lastName, birthdate).subscribe(
      (data) => {
        this.userService.setToken(data);
        form.reset();
        this.isLoading = false;
        this.router.navigate(['/']);
      }, (err) => {
        this.isLoading = false;
        this.errorMsg = err;
      }
    )

  }

  birthdateValidator(form: NgForm): boolean {
    const birthdate = form.value.birthdate;
    if (!birthdate) {
      return false;
    }
    const year = String(birthdate).split('-')[0];
    return Number(year) >= 1900 && Number(year) <= 2023;
  }

  passwordMatchValidator(form: NgForm): boolean {
    const password = form.value.password;
    const rePassword = form.value.rePassword;

    return (password === rePassword);
  }
}
