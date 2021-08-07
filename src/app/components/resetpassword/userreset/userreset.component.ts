import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from "@angular/router";

//services
import { ResetServiceService } from "../../../services/resetpassword/reset-service.service";
import { StorageServiceService } from '../../../services/localstorage/storage-service.service';

@Component({
  selector: 'app-userreset',
  templateUrl: './userreset.component.html',
  styleUrls: ['./userreset.component.css']
})
export class UserresetComponent implements OnInit {
  showerror : boolean = false;
  messageerror : string = "";
  loading : boolean = false;
  okmessage : boolean = false;
  showform : boolean = true;
  loadingmessage: string = "";

  userid : any;
  usertype: any;
  password : any;
  respassword : any;
  errorredirect : boolean = false;

  constructor(private resetService : ResetServiceService, private router: Router,private activedRoute: ActivatedRoute,  private storageService : StorageServiceService) { }

  ngOnInit(): void {
    const params = this.activedRoute.snapshot.params;
    if(params.id && params.co){
      this.userid = params.id;
      this.usertype = params.co;
    }
    else{
      this.router.navigate([`/login`]);
    }
  }
  resetPassword(){
    let timeoutId;
    if(this.checkPassword()){
      this.loading = true;
      this.showform = false;
      this.loadingmessage = "Cambiando contraseña..."
      let u = {
        id : this.userid.toString(),
        type : this.usertype.toString(),
        new_password : this.password
      };
      this.resetService.resetFirstTime(u).subscribe(
        res =>{
          if(res != null){
            
            timeoutId = setTimeout(() =>{
              this.loadingmessage = "";
              this.loading = false;
              this.showform = false;
              this.okmessage = true;
            },850);
          }
        },
       (err) =>{
        timeoutId = setTimeout(() =>{
          this.loadingmessage = "";
          this.loading = false;
          this.showform = true;
        },850);
        this.showerror = true;
        this.messageerror = err.error.message;
       }
      )
    }
  }
  continue(){
    let data = this.storageService.readData();
    
    this.redirectUser(data.rol,data.code,data.permissions);
  }
  //Checks the password
  checkPassword(){
    
    if(this.password == undefined || this.password == "" || this.password == " "){
      this.showerror = true;
      this.messageerror = "Contraseña inválida."
      return false;
    }
    if(this.password.trim().length == 0){
      this.showerror = true;
      this.messageerror = "Contraseña inválida."
      return false;
    }
    if(this.password.trim() != this.respassword.trim()){
      this.showerror = true;
      this.messageerror = "Las contraseñas no son iguales, intente de nuevo."
      return false;
    }
    if(this.password.trim().length < 8){
      this.showerror = true;
      this.messageerror = "La contraseña debe contener minimo 8 caracteres entre mayúsculas, miniscúlas y números."
      return false;
    }
    else{
      return true;
    }

  }
  //Redirects the user according to their permissions and rol
  redirectUser(rol : any, code : any, permi : any){
    if(rol != "" || rol != undefined || rol.trim().length > 0){
      if(permi.length > 0){
        if(rol == "Administrador"){
            if(permi[0] == 6){
              if(code == "CO"){
                this.router.navigate([`/admindashboard`]);
              }
              else{
                this.error();
              }
            }
            else{
              this.error();
            }
          }
          else if(rol == "Gerente contable"){
              if(permi.includes(1) && permi.includes(2) && permi.includes(3) && permi.includes(4) && permi.includes(5)){
                if(code == "CO"){
                  this.router.navigate([`/managerdashboard`]);
                }
                else{
                  this.error();
                }
              }
              else{
                this.error();
              }
          }
          else if(rol == "Contador"){
            
              if(!permi.includes(4) && !permi.includes(5)){
                if(code == "CO"){
                  this.router.navigate([`/accountantdashboard`]);
                }
                else{
                  this.error();
                }
              }
              else{
                this.error();
              }
            
          }
          else if(rol == "client"){
              if(permi.includes("465") && permi.includes("345")){
                if(code == "CE"){
                  this.router.navigate([`/clientdashboard`]);
                }
                else{
                  this.error();
                }
              }
              else{
                this.error();
              }
          }
          else{
            if(permi.includes(4) && permi.includes(5)){
              if(code == "CO"){
                this.router.navigate([`/managerdashboard`]);
              }
              else{
                this.error();
              }
            }
            else if(permi.includes(1) || permi.includes(2) || permi.includes(3)){
              if(code == "CO"){
                this.router.navigate([`/accountantdashboard`]);
              }
              else{
                this.error();
              }
            }
            else{
              this.error();
            }
            
          }
      }
      else{
        this.error();
      }
    }
    else{
      this.error();
    }
  }
  //Shows an error
  error(){
    this.okmessage = false;
    this.loadingmessage = "";
    this.loading = false;
    this.errorredirect = true;
  }
  backlogin(){
    this.router.navigate([`/login`]);
  }
}
