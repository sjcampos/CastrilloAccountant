import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { apiUrl } from "../../shared/api-url";


@Injectable({
  providedIn: 'root'
})
export class EntryServiceService {

  constructor(protected http: HttpClient) { }

  registerEntries(slug : any, seals : any){
    return this.http.post(apiUrl+'seat/',{'slug':slug,'seals':seals});
  }
}
