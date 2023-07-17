import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { IPost } from 'src/app/types/IPost';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit{

  constructor(private postService:PostService,private userService:UserService){}

  get isLoggedIn(){
    return this.userService.isLoggedIn;
  }

  posts:IPost[]|null=null;
  isLoading = false;
  hasError=false;

  ngOnInit(){
    this.fetchExplore();
  }

  onFeedChange(feed: string) {
    this.fetchPosts(feed);
  }
  
  fetchPosts(feed:string){
    if(feed==='explore'){
      this.fetchExplore();
    }else if(feed ==='following'){
      this.fetchFollowing()
    }
  }


  fetchExplore(){
    this.isLoading=true;
    this.postService.getAllPosts().subscribe(
      (data)=>{
        this.isLoading=false;
        this.posts=data;
        this.hasError=false;
      },(err)=>{
        this.isLoading=false;
        this.hasError=true;
      }
    )
  }

  fetchFollowing(){
    this.isLoading=true;
    this.postService.getFollowingPosts().subscribe(
      (data)=>{
        this.isLoading=false;
        this.posts=data;
        this.hasError=false;
      },(err)=>{
        this.isLoading=false;
        this.hasError=true;
      }
    )
  }
}
