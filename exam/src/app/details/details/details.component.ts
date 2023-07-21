import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { IPost } from 'src/app/types/IPost';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  constructor(
    private userService:UserService,
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  post: IPost | null = null;
  isLoading = false;
  hasError = false;

  get isLoggedIn(){
    return this.userService.isLoggedIn;
  }

  ngOnInit() {
    this.isLoading = true;
    const postId = this.route.snapshot.paramMap.get('postId');
    this.postService.getPostById(postId!).subscribe(
      (data) => {
        this.isLoading = false;
        this.hasError = false;
        this.post = data;
      },
      (err) => {
        this.isLoading = false;
        this.hasError=true;
        console.log(err);
      }
    );

    this.postService.postUpdated.subscribe((updatedPost: IPost) => {
      if (this.post && updatedPost._id === this.post._id) {
        this.post = updatedPost;
      }
    });
  }
}
