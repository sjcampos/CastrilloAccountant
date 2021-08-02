import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';

import { apiUrl } from "../../shared/api-url";

@Injectable({
  providedIn: 'root'
})
export class ResetServiceService {

  constructor(protected http: HttpClient) { }

  //resets company password 
  resetAdminCompany(c :any){
    return this.http.post(apiUrl+'password/reset',c);
  }
  //resets the password the first time a new user logins
  resetFirstTime(u : any){
    return this.http.post(apiUrl+'password/new', u);
  }
  resetForgot(e : any){
    return this.http.post(apiUrl+'password/chance',e);
  }
}
