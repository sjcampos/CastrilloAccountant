import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { provider } from '../../models/provider.model';
import { apiUrl } from "../../shared/api-url";

@Injectable({
  providedIn: 'root'
})
export class ProviderServiceService {

  constructor(protected http: HttpClient) { }
  
  //registers a new provider
  registerProvider(provider : provider, slug : string){
    return this.http.post(apiUrl+'providers/',{slug,provider});
  }
  //gets all the providers
  getAllProviders(slug : string){
    return this.http.get(apiUrl+`providers/list/${slug}`);
  }
  //gets one provider
  getProvider(id: any, slug : string){
    return this.http.get(apiUrl+`providers/${id}/${slug}`);
  }
  //updates an existing provider
  updateProvider(slug : string, provider : provider){
    return this.http.put(apiUrl+'providers/',{slug,provider});
  }
  //deletes an existing provider
  deleteProvider(id: any, slug : string){
    return this.http.delete(apiUrl+`providers/${id}/${slug}`);
  }
}
