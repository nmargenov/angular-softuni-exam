import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

import { IPost } from '../types/IPost';
import { errorHandler } from './shared/shared';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {}

  postUpdated = new EventEmitter<IPost>();


  private paths = {
    posts:'/posts',
    followingPosts:'/posts/following',
    post:'/posts/:postId',
    like:'/posts/like/:postId'
  }

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

  getFollowingPosts():Observable<IPost[]>{
    return this.http.get<IPost[]>(environment.REST_API+this.paths.followingPosts).pipe(catchError(errorHandler));
  }

  getPostById(postId: string): Observable<IPost> {
    const url = environment.REST_API+ this.paths.post.replace(':postId',postId);
    return this.http.get<IPost>(url).pipe(
      tap((createdPost: IPost) => {
        this.postUpdated.emit(createdPost);
      }),
      catchError(errorHandler)
    );
  }

  likePost(postId: string, userId: string): Observable<IPost> {
    const url = environment.REST_API+ this.paths.like.replace(':postId',postId);
    return this.http
      .post<IPost>(url, { userId })
      .pipe(
        tap((updatedPost: IPost) => {
          this.postUpdated.emit(updatedPost);
        }),
        catchError(errorHandler)
      );
  }
}
