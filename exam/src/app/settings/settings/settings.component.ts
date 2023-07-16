import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/types/IUser';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  constructor(private userService: UserService) {}

  user!: IUser;
  hasError = false;
  isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;
    const username = this.userService.decodedToken?.username;
    this.userService.getUser(username!).subscribe(
      (data) => {
        this.isLoading = false;
        this.user = data;
      },
      (err) => {
        this.isLoading = false;
        this.hasError = true;
      }
    );
  }
}
