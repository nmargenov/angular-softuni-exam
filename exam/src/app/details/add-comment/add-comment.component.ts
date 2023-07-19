import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent {
  private postSubscription: Subscription;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private route: ActivatedRoute,
  ) {
    this.postSubscription = this.postService.postUpdated.subscribe((updatedPost) => {
    });
  }

  comment:string|null=null;
  errorMsg:string|null=null;

  isCreating=false;

  onSubmit() {
    this.isCreating=true;
    if(!this.comment || this.comment.length<2){
      this.isCreating=false;
      this.errorMsg='Comment must be at least 2 characters long!';
      return;
    }
    const userId = this.userService.decodedToken?._id;
    const postId = this.route.snapshot.paramMap.get('postId');
    this.postService.writeComment(postId!, userId!, this.comment).subscribe(
      (data) => {
        this.comment=null;
        this.errorMsg=null;
        this.isCreating=false;
      },
      (err) => {
        this.errorMsg=err;
        this.isCreating=false;
      }
    );
  }
}
