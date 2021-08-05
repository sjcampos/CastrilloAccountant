import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
//services
import { ProviderServiceService } from "../../../services/providers/provider-service.service";
//models
import { provider } from '../../../models/provider.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.css']
})
export class ProviderFormComponent implements OnInit {
  update: boolean = false;
  register: boolean = true;
  loading : boolean = false;
  showregister : boolean = false;

  showerror : boolean = false;
  messageerror : string = "";

  slug : string = "";
  updateid : any;

  showcredit : boolean = false;

  provider : provider = {
    provider_name : "",
    number_phone : "",
    email : "",
    credit : false,
    agent : "",
    credit_days : 0,
    provider_active : true
  }

  loadinginit : boolean = true;
  constructor(private router: Router, private activedRoute: ActivatedRoute, private providerService : ProviderServiceService) { }

  ngOnInit(): void {
    const params = this.activedRoute.snapshot.params;
    let timeoutId;
    if(params.id && params.slug){
       this.slug = params.slug;
       this.updateid = params.id;
       this.getProvider(this.updateid,this.slug);
       timeoutId = setTimeout(() =>{
        this.loadinginit = false;
        this.showregister = true;
        this.update= true;
        this.register = false;
      },850)
    }
    else{
      if(params.slug){
        this.showregister = true;
        this.loadinginit = false;
        this.register = true;
        this.update = false;
        this.slug = params.slug;
      }
    }
    
  }
  //Gets an existing provider
  getProvider(id : any, slug : any){
      this.providerService.getProvider(id,slug).subscribe(
        res=>{
          let pr : any = [];
          pr = res;
          this.provider = pr[0];
        },err =>{
          this.loadinginit = false;
          Swal.fire({
            title: 'Error',
            confirmButtonText: `Aceptar`,
            confirmButtonColor:'#0096d2',
           text: err.error.message
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate([`/companylist`]);
            } 
          })
        }
      )

  }
  //updates an existing provider
  updateProvider(){
    let timeoutId;
    if(this.validateData(this.provider)){
      this.showregister = false;
      this.loading = true;
      this.providerService.updateProvider(this.slug,this.provider).subscribe(
        res =>{
          if(res!= null){
            timeoutId = setTimeout(() =>{
              this.router.navigate([`/providerlist/${this.slug}`]);
            },1500)

          }
        },
        (err) =>{
          this.loading = false;
          this.showregister = true;
          this.showerror = true;
          this.messageerror = err['error']['message'];
        }
      )
    }
  }
  //register a new provider
  registerProvider(){
    let timeoutId;
    if(this.validateData(this.provider)){
      this.providerService.registerProvider(this.provider,this.slug).subscribe(
        res=>{
          if(res != null){
            this.showregister = false;
            this.loading = true;
            timeoutId = setTimeout(() =>{
              this.router.navigate([`/providerlist/${this.slug}`]);
            },1500)
          }
        },
        (err) =>{
          this.showerror = true;
          this.messageerror = err['error']['message'];
        }
        
      )
    }
  }
  //enables the provider credit
  enableCredit(){
    if(this.provider.credit){
      this.provider.credit = false;
      this.showcredit = false;
      this.provider.credit_days = 0;
    }
    else{
      this.provider.credit = true;
      this.showcredit = true;
    }
  }
  //validates the client data before register
  validateData(p : provider){
    if(p.provider_name == "" || p.provider_name == undefined || p.provider_name == " "){
      this.showerror = true;
      this.messageerror = "Debe ingresar un nombre valido para el cliente."
      return false;
    }
    if(p.number_phone == "" || p.number_phone == undefined || p.number_phone == " "){
      this.showerror = true;
      this.messageerror = "Debe ingresar un número de teléfono valido."
      return false;
    }
    if(p.email == "" || p.email == undefined || p.email == " "){
      this.showerror = true;
      this.messageerror = "Debe ingresar un email valido para contactar al cliente."
      return false;
    }
    if(p.agent == "" || p.agent == undefined || p.agent == " "){
      this.showerror = true;
      this.messageerror = "Debe ingresar un nombre valido para el contacto."
      return false;
    }
    
    if(p.credit){
      if( p.credit_days == undefined || p.credit_days <= 0 ){
        this.showerror = true;
        this.messageerror = "Debe ingresar una cantidad de días validos."
        return false
      }
      else{
        return true;
      }
    }
    else{
      return true;
    }


  }

}
