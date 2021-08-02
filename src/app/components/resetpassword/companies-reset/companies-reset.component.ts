import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

//services
import { CompanyServiceService } from '../../../services/companies/company-service.service';
import { ResetServiceService } from '../../../services/resetpassword/reset-service.service';
import { company } from '../../../models/company.model';

@Component({
  selector: 'app-companies-reset',
  templateUrl: './companies-reset.component.html',
  styleUrls: ['./companies-reset.component.css']
})
export class CompaniesResetComponent implements OnInit {
  
  companies : any = [];
  loadinginit : boolean = false;
  loading : boolean = true;
  showtable : boolean =  false;
  showmessage : boolean = false;
  message : string = "";
  p : number = 1;
  company_name : any;

 

  constructor(private router: Router, private companyService:CompanyServiceService, private resetService:ResetServiceService) { }

  ngOnInit(): void {
    let timeoutId;
    this.getCompanies();
    timeoutId = setTimeout(() =>{
      this.loading = false;
      this.showtable= true;
    },750)
  }

  getCompanies(){
    this.companyService.getCompanies().subscribe(
      res=>{
        let comp: any = [];
        comp = res;
        this.companies = comp.data;
        
      },
      err => console.log(err)
    )
  }

  async resetPassword(id : any){
      await Swal.fire({
        title: 'Cambiar contraseña',
        text: '¿Esta seguro que desea cambiar la contraseña de este cliente?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Cambiar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          if(id != 0 && id != undefined && id > 0 ){
            let c ={
              id : id.toString(),
              type: 'CE',      
              new_password : '12345'
            };
            this.showtable = false;
            this.loadinginit = true;
            this.resetService.resetAdminCompany(c).subscribe(
              res=>{
                if(res != null){
                  this.loadinginit = false;
                  this.showmessage = true;
                  this.message = "El cambio de contraseña se realizó de manera exitosa, favor indicar al usuario que su nueva contraseña se encuentra en el correo asociado a esta aplicación."
                }
              }
              , error => {
                this.showmessage = true;
                this.message = error.error.message;
              }
            )
          }
          else{
            Swal.fire(
              'Cancelado',
              'Se necesita un cliente valido para realizar un cambio de contraseña.',
              'error'
            )
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
            'El cambio de contraseña no ha sido efectuado.',
            'error'
          )
        }
      })
  }

  resetview(){
    this.companies = [];
    this.getCompanies();
    this.showmessage = false;
    this.showtable = true;
  }
  //Filter the accounts by code
  searchCompany(){
    if(this.company_name == ""){
      this.companies = [];
      this.getCompanies();
    }
    else{
      this.companies = this.companies.filter((res: company) =>{
      return res.company_name?.match(this.company_name)});
      }
  }

}
