import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { IPost } from 'src/app/types/IPost';
import { decodeBuffer } from 'src/app/utils/imageHelpers';
import { isEdited, timeAgo } from 'src/app/utils/postHelper';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent {
  @Input() post!: IPost | null;

  onEditChange(edit:boolean){
    this.editPost=edit;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private postService: PostService
  ) {}

  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  isLiking = false;
  onLike() {
    if (!this.userService.isLoggedIn) {
      return;
    }
    this.isLiking = true;
    const userId = this.userService.decodedToken?._id;
    const postId = this.route.snapshot.paramMap.get('postId');
    this.postService.likePost(postId!, userId!).subscribe(
      (data) => {
        this.isLiking = false;
      },
      (err) => {
        this.isLiking = false;
        console.log(err);
      }
    );
  }

  isEditing = false;
  editPost=false;
  onEdit(){
    this.editPost=true;
  }
  onEditCancel(){
    this.editPost=false;
  }
  onEditAccept(){
    this.editPost=false;
  }


  isDeleting = false;
  deletePost= false;
  onDelete(){
    this.deletePost=true;
  }
  onDeleteCancel(){
    this.deletePost=false;
  }
  onDeleteAccept(){
    if (!this.ensureLoggedInAndOwner()) {
      this.deletePost = false;
      return;
    }
    this.isDeleting=true;
    const postId = this.route.snapshot.paramMap.get('postId');
    this.postService.deletePost(postId!).subscribe(
      (data)=>{
        this.isDeleting=false;
        this.deletePost=false;
        this.router.navigate(['/feed']);
      },(err)=>{
        this.isDeleting=false;
        this.deletePost=false;
      }
    )
    this.deletePost=false;
  }

  get isLiked() {
    return this.post?.likedBy.includes(this.userService.decodedToken?._id!);
  }

  isLoadingImage = true;
  onImageLoad() {
    this.isLoadingImage = false;
  }

  isProfileImageLoading = true;
  onProfileImageLoad() {
    this.isProfileImageLoading = false;
  }

  decodeBuffer(data: { data: [] }) {
    return decodeBuffer(data);
  }

  navigateToUserProfile(username: string) {
    this.router.navigate(['/user', username]);
  }

  isEdited(createdAt: string, lastEditedAt: string){
    return isEdited(createdAt,lastEditedAt);
  }

  timeAgo(date:string){
    return timeAgo(date);
  }

  ensureLoggedInAndOwner(): boolean {
    return (
      this.userService.isLoggedIn &&
      this.userService.decodedToken?._id == this.post?.owner._id
    );
  }

}
