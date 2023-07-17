import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IPost } from 'src/app/types/IPost';
import { decodeBuffer } from 'src/app/utils/imageHelpers';
import { isEdited, timeAgo } from 'src/app/utils/postHelper';

@Component({
  selector: 'app-list-posts',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})
export class ListPostsComponent {

  constructor(private router:Router){}

  @Input() posts!:IPost[]|null;

  decodeBuffer(data:{data:[]}){
    return decodeBuffer(data);
  }

  isProfileImageLoading=true;
  onProfileImageLoad(){
    this.isProfileImageLoading=false;
  }

  isLoadingImage=true;
  onImageLoad() {
    this.isLoadingImage = false;
  }

  navigateToUserProfile(username: string) {
    this.router.navigate(['/user', username]);
  }
  
  navigateToPost(postID: string) {
    this.router.navigate(['/post', postID]);
  }


  isEdited(createdAt: string, lastEditedAt: string){
    return isEdited(createdAt,lastEditedAt);
  }

  timeAgo(date:string){
    return timeAgo(date);
  }
}
