import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { IPost } from 'src/app/types/IPost';
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
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  feed = 'myPosts';

  getFeed(feed:string){
    this.feed=feed;
    this.fetchPosts(feed);
  }

  get ensureLoggedInAndOwner(){
    return this.userService.isLoggedIn && this.user._id === this.userService.decodedToken?._id;
  }

  hasError = false;
  user!: IUser;
  isLoading = false;
  isOwner = false;
  isFollowing = false;
  posts:IPost[] | null = null;

  fetchPosts(feed:string){
    if(feed==='myPosts'){
      this.fetchUserPosts();
    }else if(feed ==='liked'){
      this.fetchLiked()
    }
  }

  isLikedFetching=false;

  fetchLiked(){
    this.isLikedFetching=true;
    const userId = this.userService.decodedToken?._id;
    this.postService.getLikedPosts(userId!).subscribe(
      (data)=>{
        this.isLikedFetching=false;
        this.posts=data;
      },(err)=>{
        this.isLikedFetching=false;
        this.posts = [];
      }
    )
  }

  fetchUserPosts(){
    this.posts=this.user.userPosts;
  }

  

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
          this.fetchUserPosts();
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
