import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { apiUrl } from "../../shared/api-url";
//models
import { Request } from "../../models/request.model";

@Injectable({
  providedIn: 'root'
})
export class ClientreportServiceService {

  constructor(protected http: HttpClient) { }
  
  //Registers a new request for report or meeting
  registerRequest(re : Request){
    return this.http.post(apiUrl+'application',re);
  }
  //Updates the state of the application
  updateState(id_application : any , status_application : any){
    return this.http.put(apiUrl+"application/",{id_application, status_application});
  }
  //Gets the reports for the manager
  getReports(){
    return this.http.get(apiUrl+'application/manager/Reporte');
  }
  //Gets the meetings for the manager
  getMeetings(){
    return this.http.get(apiUrl+'application/manager/Reunion');
  }
  //Gets the reports for the client
  getReportsClient(){
    return this.http.get(apiUrl+'application/client/Reporte');
  }
  //Gets the meetings for the client
  getMeetingsClient(){
    return this.http.get(apiUrl+'application/client/Reunion');
  }

}
