import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { collaborator } from '../../models/collaborator.model';
import { apiUrl } from "../../shared/api-url";

@Injectable({
  providedIn: 'root'
})
export class CollaboratorServiceService {

  constructor(protected http: HttpClient) { }

  //Gets all the collaborators
  getCollaborators(){
    return this.http.get(apiUrl+'collaborator/list');
  }

  getSingleCollaborator(id : any){
    return this.http.get<collaborator>(apiUrl+`collaborator/${id}`);
  }

  //Registers a new collaborator
  createCollaborator(newc: collaborator){
    return this.http.post(apiUrl+'collaborator/',newc);
  }
  
  //Updates an existing collaborator
  updateCollaborator(oldc : collaborator){
    return this.http.put(apiUrl+'collaborator/',oldc);
  }

  //Deletes a collaborator
  deleteCollaborator(id : any){
    return this.http.delete(apiUrl+`collaborator/${id}`);
  }

  getCompanyCollaborator(id : any){
    return this.http.get(apiUrl+`collaborator/company/${id}`);
  }

}
