import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { FbCreateResponse, Post } from './interfaces';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private http: HttpClient) {}

  create(post: Post): Observable<Post> {
    return this.http.post(`${environment.firebaseDataBaseURL}/posts.json`, post).pipe(
      map((response: FbCreateResponse) => {
        const newPost: Post = {
          ...post,
          id: response.name,
          date: new Date(post.date),
        };

        return newPost;
      }),
    );
  }

  getAll() {
    return this.http.get(`${environment.firebaseDataBaseURL}/posts.json`).pipe(
      map((response: { [key: string]: any }) => {
        return Object.keys(response).map((key) => {
          return {
            ...response[key],
            id: key,
            date: new Date(response[key].date),
          };
        });
      }),
    );
  }

  remove(id) {
    return this.http.delete<void>(`${environment.firebaseDataBaseURL}/posts/${id}.json`);
  }
}
