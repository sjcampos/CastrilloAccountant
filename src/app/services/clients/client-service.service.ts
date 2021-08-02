import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { clients } from '../../models/client.model';
import { apiUrl } from "../../shared/api-url";

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {

  constructor(protected http: HttpClient) { }
  //registers the new client
  registerClient(client: clients, slug : any){
    return this.http.post(apiUrl+'clients/', {slug, client});
  }
  //gets all the clients
  getClients(slug : string){
    return this.http.get(apiUrl+`clients/list/${slug}`);
  }
  //Gets an specific client data
  getClient(id : string, slug : string){
    return this.http.get(apiUrl+`clients/${id}/${slug}`);
  }
  //updates an existing client
  updateClient(slug : string, client: clients){
    return this.http.put(apiUrl+'clients/',{slug, client});
  }
  //deletes a client
  deleteClient(id : string, slug : string){
    return this.http.delete(apiUrl+`clients/${id}/${slug}`);
  }
}
