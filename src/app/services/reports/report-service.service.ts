import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';

import { apiUrl } from "../../shared/api-url";


@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {

  constructor(protected http: HttpClient) { }
  //gets the balance general comparativo report
  getBGC(slug: any, dates : any){
    return this.http.post(apiUrl+'balanceComparative/data',{'slug': slug, 'dates': dates});
  }
  //gets the balance general comparativo report PDF file
  getBGCPDF(slug: any , dates: any){
    return this.http.post(apiUrl+'balanceComparative/pdf',{'slug': slug, 'dates': dates});
  }
  //gets the estado de resultado integrales report
  getERI(slug: any, month: any, year: any){
    return this.http.get(apiUrl+`integralResult/data/${slug}/${month}/${year}`);
  }
  //gets the estado de resultado integrales PDF file
  getERIPDF(slug: any, date : any, tax : any, net_sales :any, gross_profit : any,operating_profit : any,profit_tax :any){
    return this.http.post(apiUrl+'integralResult/pdf',{'net_sales' : net_sales,'gross_profit':gross_profit,'operating_profit':operating_profit,'profit_tax':profit_tax,'tax': tax,'date':date,'slug':slug});
  }
  //gets the list of entries of an specific account
  getBXCM(slug : any, id : any, date : any){
    return this.http.get(apiUrl+`seat/sealsofaccount/${slug}/${id}/${date}`);
  }
  //gets the movimientos por cuenta PDF file
  getBXCPDF(slug : any,seals : any){
    return this.http.post(apiUrl+'seat/pdfsoa/',{'slug':slug,'seals':seals });
  }
  //gets the cuentas por cobrar report
  getCXC(slug: any,filter : any){
    return this.http.get(apiUrl+`accountsReceivable/${slug}/${filter}`);
  }
  //gets the cuentas por cobrar PDF file
  getCXCPDF(slug : any, accounts : any){
    return this.http.post(apiUrl+'accountsReceivable/pdf',{'slug':slug,'accounts':accounts});
  }
  //gets the cuentas por pagar report
  getCXP(slug: any, filter : any){
    return this.http.get(apiUrl+`accountpay/${slug}/${filter}`);
  }
  //gets the cuentas por pagar PDF file
  getCXPPDF(slug : any, accounts : any){
    return this.http.post(apiUrl+'accountpay/pdf',{'slug':slug,'accounts':accounts});
  }
  //gets the ventas report
  getVTS(slug : any, month : any, year: any, id: any){
    return this.http.get(apiUrl+`accountsales/${slug}/${month}/${year}/${id}`);
  }
  //gets the ventas PDF file
  getVTSPDF(slug : any, accounts : any){
    return this.http.post(apiUrl+'accountsales/pdf',{'slug':slug, 'data':accounts});
  }
  //gets the accounting entries
  getASC(slug : any,type : any, filter: any){
    return this.http.get(apiUrl+`seat/list/${slug}/${type}/${filter}`);
  }
  //gets the accounting entries PDF file
  getASCPDF(slug : any, seats : any){
    return this.http.post(apiUrl+'seat/pdfseats/',{'slug':slug, 'seats':seats});
  }
  //gets all the clients of a company PDF
  getCLIXCOMPPDF(slug :any){
    return this.http.get(apiUrl+`clients/generate/pdf/${slug}`);
  }
  //gets all the providers of a company PDF
  getPROXCOMPPDF(slug :any){
    return this.http.get(apiUrl+`providers/generate/pdf/${slug}`);
  }
  //gets the proyeccion report for a year
  getPROYYEAR(slug : any, accounts : any){
    return this.http.post(apiUrl+'projection/year',{'slug':slug,'accounts':accounts});
  }
  //gets the proyeccion report for a month
  getPROYMONTH(slug : any, accounts : any){
    return this.http.post(apiUrl+'projection/month',{'slug':slug,'accounts':accounts});
  }
  getPROYPDF(slug : any, data : any){
    return this.http.post(apiUrl+'projection/pdf_projection',{'slug':slug,'data':data});
  }
}
