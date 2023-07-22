import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { IPost } from 'src/app/types/IPost';
import { decodeBuffer } from 'src/app/utils/imageHelpers';
import { timeAgo, isEdited } from 'src/app/utils/postHelper';

@Component({
  selector: 'app-list-comments',
  templateUrl: './list-comments.component.html',
  styleUrls: ['./list-comments.component.css']
})
export class ListCommentsComponent {
  private postSubscription: Subscription;
  
  onCommentChange(commentId: string) {
    this.editState[commentId]=false;   
  }
  
  changedComment: { [commentId: string]: string } = {};
  @Input() post!: IPost | null;
  
  constructor(
    private postService: PostService,
    private userService: UserService,
    private router: Router,
    private route:ActivatedRoute
  ) {
    this.postSubscription = this.postService.postUpdated.subscribe(
      (updatedPost) => {
        this.commentsOwnedByLoggedInUser = updatedPost.comments.filter(
          (p) => p.owner._id === this.userService.decodedToken?._id
        )!;
      }
    );
  }

  editState:{[commentId:string]:boolean}={};
  onEdit(commentId:string){
    this.editState[commentId]=true;
  }

  isDeleting:{[commentId:string]:boolean} ={};
  deleteState:{[commentId:string]:boolean} ={};
  onDelete(commentId:string){
    this.deleteState[commentId] = true;
  }
  onDeleteCancel(commentId:string){
    this.deleteState[commentId] = false;
  }
  onDeleteAccept(commentId:string){
    this.isDeleting[commentId]=true;
    const postId = this.route.snapshot.paramMap.get('postId');
    this.postService.deleteComment(postId!,commentId).subscribe(
      (data)=>{
    this.isDeleting[commentId]=false;
      },(err)=>{
    this.isDeleting[commentId]=false;
      }
    )
  }

  // filter the comments so i can put the edit and delete comment only on these
  // owned by the loggedInUser
  commentsOwnedByLoggedInUser!: { comment: string; _id: string }[];
  ngOnInit() {
    if (this.post?.comments) {
      this.commentsOwnedByLoggedInUser = this.post.comments.filter(
        (p) => p.owner._id === this.userService.decodedToken?._id
      );
      for (const comment of this.commentsOwnedByLoggedInUser) {
        this.changedComment[comment._id] = comment.comment || '';
      }
    }
  }
  isOwner(commentId: string) {
    return this.commentsOwnedByLoggedInUser?.map((c) => c._id).includes(commentId);
  }

  timeAgo(date: string) {
    return timeAgo(date);
  }

  decode(data: { data: [] }) {
    return decodeBuffer(data);
  }

  checkIfEdited(createdAt:string,lastEditedAt:string):boolean{
    return isEdited(createdAt,lastEditedAt);
  }

  navigateToUserProfile(username: string) {
    this.router.navigate(['/user', username]);
  }
}
