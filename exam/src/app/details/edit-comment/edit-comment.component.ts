import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.css']
})
export class EditCommentComponent implements OnInit{

  constructor(private postService:PostService,private route:ActivatedRoute){}

  @Input() comment!:{comment:string,_id:string};
  description:string|null=null;
  @Output() cancelCommentId = new EventEmitter<string>();

  isEditing:{[commentId:string]:boolean}={};

  errorMsg:string|null=null;

  ngOnInit():void{
    this.description=this.comment.comment;
  }

  onSave(commentId:string){
    if(!this.description || this.description.length<2){
      this.errorMsg="Description must be at least 2 characters long!";
      return;
    }
    this.isEditing[commentId]=true;
    const postId = this.route.snapshot.paramMap.get('postId');
    this.postService.editComment(postId!,commentId,this.description!).subscribe(
      (data)=>{
        this.cancelCommentId.emit(commentId);
        this.isEditing[commentId]=false;
        this.errorMsg=null;
      },(err)=>{
        this.errorMsg=err;
        this.isEditing[commentId]=false;
      }
    )
  }

  onCancel(commentId:string){
    this.cancelCommentId.emit(commentId);
  }

}
