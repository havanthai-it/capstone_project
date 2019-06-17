import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Article } from 'src/app/model/Article';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  baseUrl = 'https://localhost:44352/api/postservice/article/create';
  constructor(private http: HttpClient) { }
  createPost(article: Article): Observable<Article> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('Token')
      })
    };
    return this.http.post<Article>(this.baseUrl, article, httpOption);
  }
}
