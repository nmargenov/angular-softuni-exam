import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

import { IPost } from '../types/IPost';
import { errorHandler } from './shared/shared';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  postUpdated = new EventEmitter<IPost>();

  private paths = {
    posts: '/posts',
    followingPosts: '/posts/following',
    post: '/posts/:postId',
    like: '/posts/like/:postId',
    deleteExistingImage: '/posts/deleteImage/:postId',
    comment: '/posts/comment/:postId',
    commentWithId:'/posts/comment/:postId/:commentId'
  };

  createPost(formData: FormData): Observable<IPost> {
    return this.http
      .post<IPost>(environment.REST_API + this.paths.posts, formData)
      .pipe(catchError(errorHandler));
  }

  getAllPosts(): Observable<IPost[]> {
    return this.http
      .get<IPost[]>(environment.REST_API + this.paths.posts)
      .pipe(catchError(errorHandler));
  }

  getFollowingPosts(): Observable<IPost[]> {
    return this.http
      .get<IPost[]>(environment.REST_API + this.paths.followingPosts)
      .pipe(catchError(errorHandler));
  }

  getPostById(postId: string): Observable<IPost> {
    const url =
      environment.REST_API + this.paths.post.replace(':postId', postId);
    return this.http.get<IPost>(url).pipe(
      tap((createdPost: IPost) => {
        this.postUpdated.emit(createdPost);
      }),
      catchError(errorHandler)
    );
  }

  likePost(postId: string, userId: string): Observable<IPost> {
    const url =
      environment.REST_API + this.paths.like.replace(':postId', postId);
    return this.http.post<IPost>(url, { userId }).pipe(
      tap((updatedPost: IPost) => {
        this.postUpdated.emit(updatedPost);
      }),
      catchError(errorHandler)
    );
  }

  deletePost(postId: string): Observable<IPost> {
    const url =
      environment.REST_API + this.paths.post.replace(':postId', postId);
    return this.http.delete<IPost>(url).pipe(catchError(errorHandler));
  }

  editPost(postId: string, formData: FormData): Observable<IPost> {
    const url =
      environment.REST_API + this.paths.post.replace(':postId', postId);
    return this.http.patch<IPost>(url, formData).pipe(
      tap((updatedPost: IPost) => {
        this.postUpdated.emit(updatedPost);
      }),
      catchError(errorHandler)
    );
  }

  deleteExistingImage(postId: string): Observable<IPost> {
    const url =
      environment.REST_API +
      this.paths.deleteExistingImage.replace(':postId', postId);
    return this.http.delete<IPost>(url).pipe(
      tap((updatedPost: IPost) => {
        this.postUpdated.emit(updatedPost);
      }),
      catchError(errorHandler)
    );
  }

  writeComment(
    postId: string,
    userId: string,
    comment: string
  ): Observable<IPost> {
    const url =
    environment.REST_API +
    this.paths.comment.replace(':postId', postId);
    return this.http
      .post<IPost>(url, {
        userId,
        comment,
      })
      .pipe(
        tap((updatedPost: IPost) => {
          this.postUpdated.emit(updatedPost);
        }),
        catchError(errorHandler)
      );
  }

  deleteComment(postId: string, commentId: string): Observable<IPost> {
    const url =
    environment.REST_API +
    this.paths.commentWithId.replace(':postId', postId).replace(':commentId',commentId);
    return this.http
      .delete<IPost>(url)
      .pipe(
        tap((updatedPost: IPost) => {
          this.postUpdated.emit(updatedPost);
        }),
        catchError(errorHandler)
      );
  }
}
