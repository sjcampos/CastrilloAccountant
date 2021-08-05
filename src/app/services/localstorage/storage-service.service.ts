import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {
  saveword : string = "jkl3wtS48fasGJC3jhRTQ5";
  constructor() { }
  //save the data in the localstorage
  saveData(data : any){
    let utk = data.token;
    let ud = CryptoJS.AES.encrypt(data.Userid.toString(), this.saveword).toString();
    let ur = CryptoJS.AES.encrypt(data.Rol.toString(), this.saveword).toString();
    let uper : string = "";
    for (let i = 0; i < data.Permissions.length; i++) {
      uper = uper + "."+data.Permissions[i].toString(); 
    }
    let c = CryptoJS.AES.encrypt(data.Code.toString(), this.saveword).toString();
    let encriptUper = CryptoJS.AES.encrypt(uper.toString(), this.saveword).toString();
    sessionStorage.setItem('UTK',utk);
    sessionStorage.setItem('UD',ud);
    sessionStorage.setItem('UR', ur);
    sessionStorage.setItem('UPER',encriptUper);
    sessionStorage.setItem('UC',c);
  }
  //reads and decrypts the localstorage data
  readData(){
    let tempUTK = sessionStorage.getItem('UTK');
    let tempUD = sessionStorage.getItem('UD');
    let tempUR = sessionStorage.getItem('UR');
    let tempUPER = sessionStorage.getItem('UPER');
    let tempUC = sessionStorage.getItem('UC');

    let data = {
      token :tempUTK,
      id : this.decryptData(tempUD),
      rol : this.decryptData(tempUR),
      permissions : this.createPermissions(tempUPER),
      code : this.decryptData(tempUC)      
    }
    
    return data;
  }
  //decrypts the user permissions
  createPermissions(p : any){
    if(p == null || p == undefined){
      return null;
    }
    else{
      let temp = CryptoJS.AES.decrypt(p.toString(), this.saveword).toString(CryptoJS.enc.Utf8);
      let tempa = temp.split('.');
      let permi : any = [] ;
      for (let l = 0; l < tempa.length; l++) {
        if(tempa[l] != ""){
          permi.push(tempa[l]);
        }
      }
      return permi;
    }

  }
  //decrypts the data from the localstorage
  decryptData(text : any){
    if(text ==  null || text == undefined || text == ''){
      return null;
    }
    else{
   
      return CryptoJS.AES.decrypt(text.toString(), this.saveword).toString(CryptoJS.enc.Utf8);
    }
  }
  //Deletes the localstorage data
  logout(){
    sessionStorage.removeItem('UC');
    sessionStorage.removeItem('UD');
    sessionStorage.removeItem('UPER');
    sessionStorage.removeItem('UR');
    sessionStorage.removeItem('UTK');
  }


}
