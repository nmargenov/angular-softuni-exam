import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IPost } from 'src/app/types/IPost';
import { decodeBuffer } from 'src/app/utils/imageHelpers';

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


  timeAgo(date: string): string {
    const now = new Date();
    const timestamp = new Date(date);
    const diff = Math.abs(now.getTime() - timestamp.getTime());
    const minutes = Math.floor(diff / (1000 * 60));
  
    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `${days} days ago`;
    }
  }
  
  isEdited(createdAt:string,lastEditedAt:string):boolean{
    const createdDate = new Date(createdAt);
    const editedDate = new Date(lastEditedAt);
  
  
    return createdDate.getTime() !== editedDate.getTime();
  }

}
