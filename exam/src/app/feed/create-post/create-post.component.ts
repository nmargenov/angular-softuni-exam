import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { isFileAnImage } from 'src/app/utils/imageHelpers';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  constructor(
    private postService: PostService,
    private userService: UserService,
    private router: Router
  ) {}

  description: string | null = null;
  errorMsg: string | null = null;

  selectedFile: File | undefined;
  previewUrl: string | ArrayBuffer | null = null;

  isLoading = false;

  onFileSelect(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onFileClear() {
    this.selectedFile = undefined;
    this.previewUrl = null;
  }

  onPost() {
    if (!this.description || this.description?.length < 5) {
      this.errorMsg = 'Description must be at least 5 characters';
      return;
    }
    if (this.selectedFile && !isFileAnImage(this.selectedFile!)) {
      this.selectedFile = undefined;
      this.previewUrl = null;
      this.errorMsg = 'Only image files are allowed!';
      return;
    }
    const owner = this.userService.decodedToken?._id;
    const formData = new FormData();
    formData.set('owner', owner!);
    formData.set('description', this.description!);
    formData.set('postImage', this.selectedFile!);

    this.isLoading = true;
    this.postService.createPost(formData).subscribe(
      (data) => {
        this.selectedFile = undefined;
        this.previewUrl = null;
        this.description = null;
        this.errorMsg = null;
        this.isLoading = false;
        this.router.navigate([`/post/${data._id}`]);
      },
      (err) => {
        this.errorMsg = err;
        this.isLoading = false;
      }
    );
  }

  isFileAnImage(file:File){
    return isFileAnImage(file);
  }
}
