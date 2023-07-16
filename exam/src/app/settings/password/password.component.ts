import { Component, Input, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/types/IUser';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['../shared/style.css']
})
export class PasswordComponent {
  constructor(private userService:UserService){}

  @Input() user!:IUser;

  @ViewChild('oldPassword') oldPassword!: NgModel;
  @ViewChild('newPassword') newPassword!: NgModel;
  @ViewChild('newRePassword') newRePassword!: NgModel;

  isPasswordUpdateLoading = false;
  hasPasswordUpdateError = false;
  passwordUpdateError = '';
  successfullMsg = '';
  onPasswordSave() {

    if(this.oldPassword.invalid || this.newPassword.invalid || this.newRePassword.invalid || !this.passwordMatchValidator(this.newPassword,this.newRePassword)){
      return;
    }

    this.isPasswordUpdateLoading = true;
    const userId = this.userService.decodedToken?._id;

    const oldPassword = this.oldPassword.viewModel;
    const newPassword = this.newPassword.viewModel;
    const newRePassword = this.newRePassword.viewModel;

    this.userService
      .editPassword(oldPassword, newPassword, newRePassword, userId!)
      .subscribe(
        (data) => {
          this.isPasswordUpdateLoading = false;
          this.hasPasswordUpdateError = false;
          this.passwordUpdateError = '';
          this.successfullMsg = 'Password updated successfully!';
          this.userService.setNewToken(data);
          this.user = this.userService.decodedToken!;
          this.resetFields();
        },
        (err) => {
          this.isPasswordUpdateLoading = false;
          this.hasPasswordUpdateError = true;
          this.passwordUpdateError = err;
          this.successfullMsg = '';
          this.resetFields();
        }
      );
  }

  resetFields() {
    this.oldPassword.control.setValue('');
    this.newPassword.control.setValue('');
    this.newRePassword.control.setValue('');
    this.oldPassword.control.markAsUntouched();
    this.newPassword.control.markAsUntouched();
    this.newRePassword.control.markAsUntouched();
  }
  passwordMatchValidator(
    newPassword: NgModel,
    repeatPassword: NgModel
  ): boolean {
    const password = newPassword.viewModel;
    const rePassword = repeatPassword.viewModel;

    return password === rePassword;
  }
}
