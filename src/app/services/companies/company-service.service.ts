import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { company } from '../../models/company.model';
import { apiUrl } from "../../shared/api-url";

@Injectable({
  providedIn: 'root'
})
export class CompanyServiceService {

  constructor(protected http: HttpClient) { }
  
  //Registers a new company
  registerCompany(company : company){
    return this.http.post(apiUrl+'company/',company);
  }
  //Gets all the companies
  getCompanies(){
    return this.http.get(apiUrl+'company/' );
  }
  //Gets a specifica company data
  getCompany(id_company : any){
    return this.http.get(apiUrl+`company/${id_company}`);
  }
  //Gets a collaborator companies
  getCollabCompanies(id : any){
    return this.http.get(apiUrl+`company/comofcoll/${id}`);
  }
  //Updates the company data
  updateCompany(company : company){
    return this.http.put(apiUrl+'company/',{'company':company});
  }
  //Registers new collaborators to a company
  registerNewColls(tenant : any , collaborators : any){
    return this.http.put(apiUrl+'company/insertCol',{'tenant':tenant,'collaborators':collaborators});
  }
  //Deletes the collaborator of a company
  deleteColl(tenant : any,  collaborators : any){
    return this.http.put(apiUrl+'company/deleteCol',{'tenant':tenant,'collaborators':collaborators});
  }
  //Deletes a company
  deleteCompany(id_company : any){
    return this.http.delete(apiUrl+`company/${id_company}`);
  }

}
