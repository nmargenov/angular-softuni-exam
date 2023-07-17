import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

import { IPost } from '../types/IPost';
import { errorHandler } from './shared/shared';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {}

  private paths = {
    posts:'/posts',
    followingPosts:'/posts/following'
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

}
