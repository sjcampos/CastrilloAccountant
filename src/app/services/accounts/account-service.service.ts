import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { newAccount } from '../../models/newAccount.model';
import { apiUrl } from "../../shared/api-url";

@Injectable({
  providedIn: 'root'
})
export class AccountServiceService {

  constructor(protected http: HttpClient) { }
  //Registers a new account
  registerAccounts(accounts : any [], slug : string){
    return this.http.post(apiUrl+'account/',{ 'slug':slug, 'accounts':accounts});
  }
  //Gets all the accounts of a specific company
  getAccounts(slug : string, filter : string){
    return this.http.get(apiUrl+`account/list/${slug}/${filter}`);
  }
  //Deletes an account
  deleteAccount(slug : string, id : any){
    return this.http.delete(apiUrl+`account/${slug}/${id}`);
  }
}
