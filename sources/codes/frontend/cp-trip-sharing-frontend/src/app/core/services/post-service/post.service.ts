import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Article } from 'src/app/model/Article';
import { Observable } from 'rxjs';
import { HostGlobal } from 'src/app/core/global-variables';
import { Comment } from 'src/app/model/Comment';
import { Like } from 'src/app/model/Like';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  baseUrl: string = null;
  constructor(private http: HttpClient) {
    this.baseUrl = HostGlobal.HOST_POST_SERVICE + '/api/postservice/article/';
  }
  createPost(article: Article): Observable<Article> {
    const httpOptionAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('Token')
      })
    };

    return this.http.post<Article>(this.baseUrl + 'create', article, httpOptionAuth);
  }

  getDetail(postId: string): Observable<any> {
    const baseUrl = HostGlobal.HOST_POST_SERVICE + '/api/postservice/post';
    return this.http.get(baseUrl + '?postId=' + postId);
  }

  getAllPost(): Observable<any> {
    console.log(this.baseUrl);
    return this.http.get(this.baseUrl + 'all');
  }

  getAllPostwithToken(token: string): Observable<any> {
    const httpOptionAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      })
    };
    return this.http.get(this.baseUrl + 'all', httpOptionAuth);
  }

  getAllPostByUserId(userId: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'userid?id=' + userId);
  }

  getCommentByPost(postId: string): Observable<any> {
    const url = HostGlobal.HOST_POST_SERVICE + '/api/postservice/comment/all';
    return this.http.get(url + '?id=' + postId);
  }

  getCommentByPostWithAuthen(postId: string, token: string): Observable<any> {
    const httpOptionAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      })
    };
    const url = HostGlobal.HOST_POST_SERVICE + '/api/postservice/comment/all';
    return this.http.get(url + '?id=' + postId, httpOptionAuth);
  }

  addComment(comment: Comment): Observable<any> {
    const httpOptionAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('Token')
      })
    };
    const url = HostGlobal.HOST_POST_SERVICE + '/api/postservice/comment/add';
    return this.http.post<Comment>(url, comment, httpOptionAuth);
  }


  getAllTopics(): Observable<any> {
    return this.http.get(HostGlobal.HOST_POST_SERVICE + '/api/postservice/topic/all');
  }

  likeAPost(likeObject: Like): Observable<any> {
    const httpOptionLike = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('Token')
      })
    };
    return this.http.post<any>(HostGlobal.HOST_POST_SERVICE + '/api/postservice/like/like', likeObject, httpOptionLike);
  }

  unlikeAPost(likeObject: Like): Observable<any> {
    const httpOptionUnLike = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('Token')
      }),
      body: likeObject
    };
    return this.http.delete<any>(HostGlobal.HOST_POST_SERVICE + '/api/postservice/like/unlike', httpOptionUnLike);
  }
}
