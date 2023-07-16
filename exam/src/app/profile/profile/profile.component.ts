import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/types/IUser';
import { decodeBuffer } from 'src/app/utils/imageHelpers';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  hasError = false;
  user!: IUser;
  isLoading = false;
  isOwner = false;
  isFollowing = false;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.isLoading = true;
      const userId = this.userService.decodedToken?._id;
      const isLoggedIn = this.userService.isLoggedIn;
      const loggedInUser = this.userService.decodedToken;
      const username = params.get('username');
      this.userService.getUser(username!).subscribe(
        (data) => {
          this.isLoading = false;
          this.isOwner = isLoggedIn && data._id === loggedInUser?._id;
          this.user = data;
          if (!this.isOwner) {
            this.isFollowing = this.user?.followers.includes(userId!)!;
          }
        },
        (err) => {
          this.isLoading = false;
          this.hasError = true;
        }
      );
    });
  }

  ngOnDestroy() {}

  isImageLoading = true;

  onImageLoad() {
    this.isImageLoading = false;
  }

  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  isFollowingLoading = false;
  onFollow() {
    const userId = this.userService.decodedToken?._id;
    if (!userId) {
      return;
    }
    this.isFollowingLoading = true;
    const userToFollow = this.route.snapshot.paramMap.get('username')!;
    this.userService.follow(userToFollow, userId).subscribe(
      (data) => {
        this.user = data;
        this.isFollowingLoading = false;
        this.isFollowing = this.user?.followers.includes(userId!)!;
      },
      (err) => {
        this.isFollowingLoading = false;
      }
    );
  }

  decodeBuffer(data: { data: [] }) {
    return decodeBuffer(data);
  }
}
