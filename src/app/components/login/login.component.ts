
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

//services
import { LoginServiceService } from '../../services/login/login-service.service';
import { StorageServiceService } from '../../services/localstorage/storage-service.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  email : any;
  password : any;
  code : any;
  showerror : boolean = false;
  messageerror : string = "";
  
  loading : boolean = false;
  loadingmessage: string = "";
  loginform : boolean = true;
  codeform : boolean = false;
  loginerror : boolean = false;

  userid : any;
  constructor( private loginService : LoginServiceService, private storageService : StorageServiceService, private router: Router) { }

  ngOnInit(): void {
  }
  //Makes the login
  login(){
    if(this.validData(this.email,this.password)){
      this.loginform = false;
      this.showerror = false;
      this.messageerror = "";
      this.loadingmessage = "Realizando autenticación..."
      this.loading = true;
      let timeoutId;
      let user = {
        email : this.email,
        password : this.password
      };
      this.loginService.initLogin(user).subscribe(
        res =>{
          if(res != null){
            let temp : any = [];
            temp = res;
            this.userid = temp.params.user;
            timeoutId = setTimeout(() =>{
              this.loading = false;
              this.codeform = true;
            },850);

          }
        },
       (err) =>{
        timeoutId = setTimeout(() =>{
          this.loading = false;
          this.loginform = true ;
        },850);
        this.showerror = true;
        this.messageerror = err.error.message;
       }
      )  
    }
  }
  //Checks the verification code
  checkCode(){
    if(this.validCode(this.code)){
      let timeoutId;
      this.codeform = false;
      this.loadingmessage = "Verificando código..."
      this.loading = true;
      
      let valid = {
        user : this.userid.toString(),
        code : this.code
      };
      this.loginService.checkCode(valid).subscribe(
        res=> {
          if(res != null){

            let temp : any = [];
            temp = res;
            /*let token = temp.data.token;
            let ud = temp.data.Userid;
            let ur = temp.data.Rol;
            let uper = temp.data.Permissions;
            let c = temp.data.Code;
            let ures = temp.data.ResetPassword;*/
            /*localStorage.setItem('token', token);
            localStorage.setItem('ud', ud);
            localStorage.setItem('ur', ur);
            localStorage.setItem('uper', uper);*/
            this.storageService.saveData(temp.data);
            timeoutId = setTimeout(() =>{
              if(temp.data.ResetPassword == 1){
                this.router.navigate([`/reset/user/${temp.data.Userid}/${temp.data.Code}`]);
              }
              else{
                this.redirectUser(temp.data.Rol,temp.data.Code,temp.data.Permissions);
              }
            },850);
          }
        },
        (err) =>{
          timeoutId = setTimeout(() =>{
          this.loading = false;
          this.loginform = false;
          this.codeform = true;
        },850);
         this.showerror = true;
         this.messageerror = err.error.message;
        }
      )
    }

  }
  //Validates the data before the login process
  validData(e : any ,p : any){
    if(e == "" || e == undefined || p == "" || p == undefined){
        this.showerror = true;
        this.messageerror = "Correo o contraseña inválidos.";
        return false;
    }
    if(typeof(e) == "number" || typeof(p) == "number"){
      this.showerror = true;
      this.messageerror = "Correo o contraseña inválidos.";
      return false;
    }
    if(typeof(e) == "string" || typeof(p) == "string"){
      
      if(e.trim().length === 0 || p.trim().length === 0){
        this.showerror = true;
        this.messageerror = "Correo o contraseña inválidos.";
        return false;
      }
      else{
        return true;
      }
    }
    else{
      
      return true;
    }
    
  }
  //Validates the code before the check code process
  validCode(c : any){
    if(c == "" || c == undefined || c == " "){
      this.showerror = true;
      this.messageerror = "Código inválido";
      return false;
     }
     if(typeof(c) == "number"){
      this.showerror = true;
      this.messageerror = "Código inválido";
      return false;
     }
     if(typeof(c) == "string"){
       if(c.trim().length == 0){
        this.showerror = true;
        this.messageerror = "Código inválido";
        return false;
       }
       else{
         return true;
       }
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
              if(permi.includes(465) && permi.includes(345)){
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
    this.loadingmessage = "";
    this.loading = false;
    this.loginerror = true;
  }
  //Reloads the window
  reload(){
    window.location.reload();
  }
}
