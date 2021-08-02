import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

//services
import { ResetServiceService } from "../../../services/resetpassword/reset-service.service";

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  email : any;
  showerror : boolean = false;
  messageerror : string = "";
  valid : boolean = false;
  loading : boolean = false;
  loadingmessage: string = "";
  emailform : boolean = true;


  constructor(private resetService : ResetServiceService, private router: Router) { }

  ngOnInit(): void {
  }


  checkEmail(){
    let timeoutId;
    if(this.validateEmail(this.email)){  
      this.emailform = false;
      this.showerror = false;
      this.messageerror = "";
      this.loadingmessage = "Verificando información..."
      this.loading = true;
      let e = {
        email :this.email
      };
      
      this.resetService.resetForgot(e).subscribe(
        res =>{
          if(res != null){
            
            timeoutId = setTimeout(() =>{
              this.loading = false;
              this.emailform = false ;
              this.valid = true;
            },850);
          }
        },
        (err) =>{
         timeoutId = setTimeout(() =>{
           this.loading = false;
           this.emailform = true ;
         },850);
         this.showerror = true;
         this.messageerror = err.error.message;
        }
      )

    }
    
  }

  goLogin(){
    this.router.navigate(['/login']);
  }

  validateEmail(email : any){
    if(email == "" || email == undefined || email.trim().length == 0){
      this.showerror = true;
      this.messageerror = "Debe ingresar un email válido."
      return false;
    }
    if(this.validEmail(email)){
      this.showerror = true;
      this.messageerror = "Debe ingresar un email válido."
      return false;
    }
    else{
      return true;
    }
    
  }

  validEmail(email : any){
    var patron = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    if (email.search(patron) == 0) {
        return false;
    } else {
        return true;
    }
  }

}
