import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
//models
import { company } from '../../../models/company.model';
import { collaborator } from '../../../models/collaborator.model';
//services
import { CollaboratorServiceService } from '../../../services/collaborators/collaborator-service.service';
import { CompanyServiceService } from '../../../services/companies/company-service.service';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {
  p: number = 1;
  pag: number = 1;
  newcollaborators : any =[];
  filterCollab : any = [];
  accountsNew : any = [];
  accountsShow : any = [];
  addingCollabs : any =[];
  error: string = '';
  update: boolean = false;
  
  showerror : boolean = false;

  formerror: boolean = false;
  formerrormessage: string = "";
 
  checked : boolean = false;
  passive : boolean = false;
  active : boolean = false;

  registerbutton: boolean = true;
  updatebutton : boolean = false; 

  register: boolean = false;
  loading :boolean = false;

  company : company = {
    id_company : "",
    company_name : "",
    agent : "",
    number_phone : "",
    main_email : "",
    company_password : "",
    collaborators : [],
    company_active : true,
    slug: "",
    tenant: ""
  };
  
  idupdate : any;
  isregister : boolean = true;

  loadinginit : boolean = true;

  constructor(private collaboratorService : CollaboratorServiceService, private companyService : CompanyServiceService,
    private router: Router, private activedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const params = this.activedRoute.snapshot.params;
    let timeoutId;
    if(params.id){
      this.idupdate = params.id;
      this.isregister = false;
      this.updatebutton = true;
      this.registerbutton = false;
      this.getCompany(params.id);
      timeoutId = setTimeout(() =>{
        this.loadinginit = false;
        this.register = true;
  
      },850)
    }
    else{
      this.loadinginit = false;
      this.register = true;
      this.getCollaborators();
      this.updatebutton = false;
      this.registerbutton = true;
    }

  }

  //Gets the company data
  getCompany(id : any){
    if(id != null && id != undefined && id != 0){
      this.companyService.getCompany(id).subscribe(
        res =>{
          let temp : any = [];
          temp = res;

          this.company = temp.company[0] ;
          
        },err =>{
          this.loadinginit = false;
          Swal.fire({
            title: 'Error',
            confirmButtonText: `Aceptar`,
            confirmButtonColor:'#0096d2',
            allowOutsideClick: false,
            allowEscapeKey: false,
           text: err.error.message
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate([`/companylist`]);
            } 
          })

        }
      )      
    }

  }
  //Updates a company data
  updateCompany(){
    let timeoutId;
    this.company.id_company = this.idupdate;
    this.company.company_active = true;
    this.company.collaborators = [];
    this.company.company_password = "null";
    if(this.validUpdate(this.company)){
        this.register = false;
        this.loading = true;
        this.companyService.updateCompany(this.company).subscribe(
          res=>{
            if(res != null){
              timeoutId = setTimeout(() =>{
              this.router.navigate(['/companylist']);
              },1500)
            }
          },
          (err) =>{
           this.formerror = true;
           this.formerrormessage = err.error.message;
          }
        )
    }

  }
  //Gets the collaborators for the form
  getCollaborators(){
    this.collaboratorService.getCollaborators().subscribe(
      res =>{
        this.filterCollab = res;
        for (let index = 0; index < this.filterCollab.Collaborators.length; index++) {
          if(this.filterCollab.Collaborators[index].rol_name != "Administrador" && this.filterCollab.Collaborators[index].rol_name != "Gerente contable"){
            this.newcollaborators.push(this.filterCollab.Collaborators[index]);
          }
        }
      },
      err => console.log(err)
    );
  }
  //Registers a new company
  async RegisterCompany(){
    this.company.collaborators = this.addingCollabs;
    let resp : any = [];
    let slug : string = "";
    let accounts: any = [];
    let timeoutId;
    if(this.ValidCompanyData(this.company)){
      this.register = false;
      this.loading = true;
      this.companyService.registerCompany(this.company).subscribe(
        res => {
          if (res != null) {
            resp = res;
            slug = resp.message;
            accounts = this.accountsNew;
            timeoutId = setTimeout(() =>{
                    this.router.navigate(['/companylist']);
            },1500)
            
          }
        },err =>{
          this.loadinginit = false;
          this.register = true;
        this.formerror = true;
        this.formerrormessage = err.error.message;

      }
      );
      
    }

  }
  //Adds to a new array the collaborators that will work in the new company
  AddCol(id : any){
      if(this.addingCollabs.includes(id)){
        var pos = this.addingCollabs.indexOf(id);
        if(pos !== -1){
          this.addingCollabs.splice(pos,1);
        }
      }
      else{
        this.addingCollabs.push(id);
      }
  }
  //Validates company data
  ValidCompanyData(comp : company){
    if(comp.company_name.trim() == '' || comp.company_name == null || comp.company_name == undefined){
      this.formerror = true;
      this.formerrormessage = "Debe ingresar un nombre de empresa válido."
      return false;
    }
    if(comp.agent.trim() == '' || comp.agent == null || comp.agent == undefined){
      this.formerror = true;
      this.formerrormessage = "Debe ingresar un nombre de contacto válido."
      return false;
    }
    if(comp.number_phone.trim() == '' || comp.number_phone == null || comp.number_phone == undefined){
      this.formerror = true;
      this.formerrormessage = "Debe ingresar un número de teléfono válido."
      return false;
    }
    if(comp.main_email.trim() == '' || comp.main_email == null || comp.main_email == undefined){
      this.formerror = true;
      this.formerrormessage = "Debe ingresar un email válido";
      return false;
    }
    if(comp.company_password.trim() == '' || comp.company_password == null || comp.company_password == undefined){
      this.formerror = true;
      this.formerrormessage = "Debe ingresar una contraseña válida.";
      return false;
    }
    if(comp.collaborators.length <= -1 ){
      this.formerror = true;
      this.formerrormessage = "Lista de colaboradores invalida, intente de nuevo."
      return false;
    }
    if(comp.collaborators.length > 0){
      if(this.ValidColList(comp.collaborators)){
          this.formerror = true;
          this.formerrormessage = "Lista de colaboradores invalida, debe escoger colaboradores debidamente registrados.";
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
  //Validates company before update
  validUpdate(comp : company){
    if(comp.company_name.trim() == '' || comp.company_name == null || comp.company_name == undefined){
      this.formerror = true;
      this.formerrormessage = "Debe ingresar un nombre de empresa valido."
      return false;
    }
    if(comp.agent.trim() == '' || comp.agent == null || comp.agent == undefined){
      this.formerror = true;
      this.formerrormessage = "Debe ingresar un nombre de contacto valido."
      return false;
    }
    if(comp.number_phone.trim() == '' || comp.number_phone == null || comp.number_phone == undefined){
      this.formerror = true;
      this.formerrormessage = "Debe ingresar un número de teléfono valido."
      return false;
    }
    if(comp.main_email.trim() == '' || comp.main_email == null || comp.main_email == undefined){
      this.formerror = true;
      this.formerrormessage = "Debe ingresar un email valido";
    }
    else{
      return true;
    }
    return false;

  }
  //Validates if the collaborators list only contains ids
  ValidColList(list : any []){
    for (let i = 0; i < list.length; i++) {
      if(!Number.isInteger(list[i])){
        return true;
      }
    }
    return false;
  }

}