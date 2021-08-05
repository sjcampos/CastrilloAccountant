import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
//services
import { ClientServiceService } from "../../../services/clients/client-service.service";
//models
import { clients } from '../../../models/client.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-clients-form',
  templateUrl: './clients-form.component.html',
  styleUrls: ['./clients-form.component.css']
})
export class ClientsFormComponent implements OnInit {

  update: boolean = false;
  register: boolean = true;
  loading : boolean = false;
  showregister : boolean = false;

  showerror : boolean = false;
  messageerror : string = "";

  slug : string = "";
  updateid : any;

  showcredit : boolean = false;
  
  client : clients = {
      clients_name : "",
      number_phone : "",
      email : "",
      credit : false,
      agent : "",
      credit_days : 0,
      clients_active : true
  };

  loadinginit : boolean = true;


  constructor(private router: Router, private activedRoute: ActivatedRoute, private clientService : ClientServiceService) { }

  ngOnInit(): void {
    const params = this.activedRoute.snapshot.params;
    let timeoutId;
    if(params.id && params.slug){
       this.slug = params.slug;
       this.updateid = params.id;
       this.getClient(this.updateid,this.slug);
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
        this.register = true;
        this.update = false;
        this.loadinginit = false;
        this.slug = params.slug;
        
      }
    }
  }
  
  //Gets an specific client data
  getClient(id : any, slug: any){
    this.clientService.getClient(id,slug).subscribe(
      res=>{
        let cl : any = [];
        cl = res;
        this.client = cl[0];
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
  //enables the client credit
  enableCredit(){
    if(this.client.credit){
      this.client.credit = false;
      this.showcredit = false;
      this.client.credit_days = 0;
    }
    else{
      this.client.credit = true;
      this.showcredit = true;
    }
  }
  //registers the new client
  registerClient(){
    let timeoutId;
    if(this.validateData(this.client)){
      this.clientService.registerClient(this.client, this.slug).subscribe(
        res=>{
          if(res != null){
            this.showregister = false;
            this.loading = true;
            timeoutId = setTimeout(() =>{
              this.router.navigate([`/clientslist/${this.slug}`]);
            },1500)
          }
        },
        (err) =>{
          this.loading = false;
          this.register = true;
         this.showerror = true;
         this.messageerror = err['error']['message'];
        }
      )
    }

  }
  //updates a client data
  updateClient(){
    let timeoutId;
    if(this.validateData(this.client)){
      this.showregister = false;
      this.loading = true;
      this.clientService.updateClient(this.slug, this.client).subscribe(
        res =>{
          if(res !=  null){
            
            //time out for the loading gif
            timeoutId = setTimeout(() =>{
              this.router.navigate([`/clientslist/${this.slug}`]);
            },1500) 
          }
        },err =>{
          this.loading = false;
          this.register = true;
          this.showerror = true;
          this.messageerror = err['error']['message'];
        }
      )
    }

  }
  //validates the client data before register
  validateData(c : clients){
    if(c.clients_name == "" || c.clients_name == undefined || c.clients_name == " "){
      this.showerror = true;
      this.messageerror = "Debe ingresar un nombre valido para el cliente."
      return false;
    }
    if(c.email == "" || c.email == undefined || c.email == " "){
      this.showerror = true;
      this.messageerror = "Debe ingresar un email valido para contactar al cliente."
      return false;
    }
    if(c.agent == "" || c.agent == undefined || c.agent == " "){
      this.showerror = true;
      this.messageerror = "Debe ingresar un nombre valido para el contacto."
      return false;
    }
    if(c.number_phone == "" || c.number_phone == undefined || c.number_phone == " "){
      this.showerror = true;
      this.messageerror = "Debe ingresar un número de teléfono valido."
      return false;
    }
    if(c.credit){
      if( c.credit_days == undefined || c.credit_days <= 0 ){
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
