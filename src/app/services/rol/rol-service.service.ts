import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';

import { apiUrl } from "../../shared/api-url";

@Injectable({
  providedIn: 'root'
})
export class RolServiceService {

  constructor(protected http: HttpClient) { }

  //Gets all the roles
  getRoles(){
    return this.http.get(apiUrl+'rol/list');
  }
  //registers the new rol
  registerRol(rol : any){
    return this.http.post(apiUrl+'rol/',rol);
  }
  //updates the rol data
  updateRol(rol : any){
    return this.http.put(apiUrl+'rol/',rol);
  }
  //Deletes a rol
  deleteRol(id : any){
    return this.http.delete(apiUrl+`rol/${id}`);
  }

}
