import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';

import { apiUrl } from "../../shared/api-url";

@Injectable({
  providedIn: 'root'
})
export class RecordServiceService {

  constructor(protected http: HttpClient) { }

  //gets the initial record without filter
  getAdminInitial(filter : any){
    return this.http.post(apiUrl+'activity_history/',filter);
  }
  //creates a pdf 
  getPDF(activity_history : any){
    return this.http.post(apiUrl+'activity_history/pdf', {'activity_history':activity_history});
  }

}
