import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { IPost } from 'src/app/types/IPost';
import { decodeBuffer, isFileAnImage } from 'src/app/utils/imageHelpers';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
})
export class EditPostComponent implements OnInit {
  constructor(private postService: PostService) {}

  @Input() post!: IPost | null;
  @Output() isEdited = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.description = this.post!.description;
  }

  description!: string;

  isEditing=false;

  errorMsg:string|null=null;

  onSave() {
    if(this.description.length<5){
      this.errorMsg="Description must be at least 5 characters!";
      return;
    }if(this.selectedFile && !this.ensureFileIsAImage(this.selectedFile)){
      this.selectedFile=undefined;
      this.previewUrl=null;
      this.errorMsg="Only image files are allowed!";
      return;
    }
    const formData = new FormData();
    formData.set('description', this.description!);
    formData.set('postImage', this.selectedFile!);
    this.isEditing=true;
    this.postService.editPost(this.post?._id!, formData).subscribe(
      (data) => {
        this.errorMsg=null;
        this.isEditing=false;
        this.isEdited.emit(false);
      },
      (err) => {
        this.errorMsg=err;
        this.isEditing=false;
      }
    );
  }

  onCancel(){
    this.isEdited.emit(false);
  }

  imageRemove = false;

  onImageRemove() {
    this.imageRemove = true;
  }

  onImageRemoveCancel() {
    this.imageRemove = false;
  }

  onImageRemoveAccept() {
    this.isEditing=true;
    this.postService.deleteExistingImage(this.post?._id!).subscribe(
      (data) => {
        this.errorMsg=null;
        this.isEditing=false;
        this.imageRemove = false;
        this.isEdited.emit(false);
      },
      (err) => {
        this.errorMsg=err;
        this.isEditing=false;
        this.imageRemove = false;
        this.isEdited.emit(false);
      }
    );
  }

  selectedFile: File | undefined;
  previewUrl: string | ArrayBuffer | null = null;

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

  decodeBuffer(data: { data: [] }) {
    return decodeBuffer(data);
  }

  ensureFileIsAImage(file:File){
    return isFileAnImage(file);
  }
}
