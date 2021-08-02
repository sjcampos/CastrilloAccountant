import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { apiUrl } from "../../shared/api-url";
@Injectable({
  providedIn: 'root'
})
export class AutoreportsServiceService {

  constructor(protected http : HttpClient) { }
  //Gets the Balance general
  getBG(slug : any,year : any , month :any){
    return this.http.get(apiUrl+`reports/generalbalance/${slug}/${month}/${year}`);
  }
  //Gets perdidas y ganancias
  getPYG(slug : any,year : any , month :any){
    return this.http.get(apiUrl+`reports/pyg/${slug}/${month}/${year}`);
  }
  //Gets the flujo efectivo
  getFE(slug : string ,year : any , month :any, account: any){
    return this.http.post(apiUrl+'reports/fe/',{slug,month,year,account});  
  }
  //Gets estado financiero
  getEF(slug :string,account : any){
    return this.http.post(apiUrl+'reports/financial_state/',{slug,account})
  }
  //Sends the pdf file
  sendPDF(slug:  any, report : any, title : any){
    return this.http.post(apiUrl+"reports/sendReport",{slug,report,title});
  }
}
