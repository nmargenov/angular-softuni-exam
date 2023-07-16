import { Component, Input, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/types/IUser';
import { decodeBuffer, isFileAnImage } from 'src/app/utils/imageHelpers';

@Component({
  selector: 'app-public-info',
  templateUrl: './public-info.component.html',
  styleUrls: ['../shared/style.css']
})
export class PublicInfoComponent {

  constructor(private userService:UserService){}

  @Input() user!:IUser;

  @ViewChild('username') username!: NgModel;
  @ViewChild('firstName') firstName!: NgModel;
  @ViewChild('lastName') lastName!: NgModel;
  @ViewChild('bio') bio!: NgModel;
  hasUpdateError = false;
  errorMsg = '';
  isUpdateLoading = false;

  onSave() {

    if(this.username.invalid
      ||this.firstName.invalid
      ||this.lastName.invalid){
      return;
    }

    if(this.selectedFile && !isFileAnImage(this.selectedFile!)){
      this.selectedFile=undefined;
      this.previewUrl=null;
      this.errorMsg='Only image files are allowed!';
      return;
    }

    const formData = new FormData();
    formData.set('username', this.username.viewModel);
    formData.set('firstName', this.firstName.viewModel);
    formData.set('lastName', this.lastName.viewModel);
    formData.set('bio', this.bio.viewModel);
    formData.set('profilePicture', this.selectedFile!);

    const userId = this.userService.decodedToken?._id;

    this.isUpdateLoading = true;

    this.userService.editPublicData(userId!, formData).subscribe(
      (data) => {
        this.isUpdateLoading = false;
        this.hasUpdateError = false;
        this.errorMsg = '';
        if(this.selectedFile){
          this.isImageLoading = true;
        }
        this.userService.setNewToken(data);
        this.previewUrl = null;
        this.selectedFile=undefined;
        this.user = this.userService.decodedToken!;
      },
      (err) => {
        this.isUpdateLoading = false;
        this.previewUrl = null;
        this.hasUpdateError = true;
        this.errorMsg = err;
        this.username.control.setValue(this.user.username);
        this.firstName.control.setValue(this.user.firstName);
        this.lastName.control.setValue(this.user.lastName);
        this.bio.control.setValue(this.user.bio);
      }
    );
  }

  hasProfilePicture(data: { data: [] }){
    const url = decodeBuffer(data);
    const normalizedPath = url.replace(/\\/g, '/');
    const parts = normalizedPath.split("/");
    const filename = parts[parts.length - 1];
    return filename !== 'defaultUser.png';
  }

  isImageLoading = true;

  onImageLoad() {
    this.isImageLoading = false;
  }

  decodeBuffer(data: { data: [] }) {
    return decodeBuffer(data);
  }

  upload = faUpload;

  selectedFile: File | undefined;
  previewUrl: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onRemoveImage() {
    this.selectedFile = undefined;
    this.previewUrl = null;
  }

  isRemovingImage = false;
  removeExistingProfileImage(){
    this.isRemovingImage=true;
    const userId = this.userService.decodedToken?._id;
    this.userService.removeExistingImage(userId!).subscribe(
      (data)=>{
        this.isRemovingImage=false;
        this.isImageLoading=true;
        this.userService.setNewToken(data);
        this.user = this.userService.decodedToken!;
      },(err)=>{
        this.isRemovingImage=false;
      }
    )
  }
}
