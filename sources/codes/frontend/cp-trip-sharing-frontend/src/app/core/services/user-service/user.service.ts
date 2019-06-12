import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {Account} from 'src/Model/Account'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl: string ="https://localhost:44353/api/identity/account/";
  constructor(private http: HttpClient) { }

  getAccount (account: Account): Observable<Account> {
    return this.http.post<Account>(this.apiUrl+"authenticate", account, httpOptions);
  }
}