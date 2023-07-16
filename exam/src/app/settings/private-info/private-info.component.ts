import { Component, Input, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/types/IUser';

@Component({
  selector: 'app-private-info',
  templateUrl: './private-info.component.html',
  styleUrls: ['../shared/style.css']
})
export class PrivateInfoComponent {
  constructor(private userService:UserService){}

  @Input() user!:IUser;

  @ViewChild('email') email!: NgModel;
  @ViewChild('birthdate') birthdate!: NgModel;

  hasPrivateUpdateError = false;
  privateErrorMsg = '';
  isPrivateUpdateLoading = false;

  onPrivateSave() {
    
    if(this.email.invalid
      ||this.birthdate.invalid
      ||!this.birthdateValidator(this.birthdate)){
      return;
    }

    const email = this.email.viewModel;
    const birthdate = this.birthdate.viewModel;
    const userId = this.userService.decodedToken?._id;

    this.isPrivateUpdateLoading = true;
    this.userService.editPrivateData(email, birthdate, userId!).subscribe(
      (data) => {
        this.isPrivateUpdateLoading = false;
        this.hasPrivateUpdateError = false;
        this.privateErrorMsg = '';
        this.userService.setNewToken(data);
        this.user = this.userService.decodedToken!;
      },
      (err) => {
        this.isPrivateUpdateLoading = false;
        this.hasPrivateUpdateError = true;
        this.privateErrorMsg = err;
        this.email.control.setValue(this.user.email);
        this.birthdate.control.setValue(this.user.birthdate);
      }
    );
  }

  birthdateValidator(NgModel: NgModel): boolean {
    const birthdate = NgModel.viewModel;
    if (!birthdate) {
      return false;
    }
    const year = String(birthdate).split('-')[0];
    return Number(year) >= 1900 && Number(year) <= 2023;
  }
}
