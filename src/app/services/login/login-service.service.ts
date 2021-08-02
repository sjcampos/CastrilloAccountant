import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';

import { apiUrl } from "../../shared/api-url";

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(protected http : HttpClient) { }

  //Makes the initial step for the login
  initLogin(user : any){
    return this.http.post(apiUrl+'auth/',user);
  }

  logout(){
    return this.http.post(apiUrl+"auth/logout" ,{logout:"logout"});
  }

  checkCode(valid : any){
    return this.http.post(apiUrl+'auth/TFA',valid);
  }
}
