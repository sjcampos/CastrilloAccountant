import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2';

//services
import { CollaboratorServiceService } from '../../services/collaborators/collaborator-service.service';
import { CompanyServiceService } from '../../services/companies/company-service.service';
import { collaborator } from '../../models/collaborator.model';

@Component({
  selector: 'app-company-collab',
  templateUrl: './company-collab.component.html',
  styleUrls: ['./company-collab.component.css']
})
export class CompanyCollabComponent implements OnInit {

  p: number = 1;
  pp: number = 1;
  assignedcollaborators : any = [];
  unassignedcollaborators : any = [];

  collaborators : any = [];

  tenant : any;

  hasaccounts : boolean = false;
  notavailable : boolean = true;

  showtable : boolean = false;
  loadinginit : boolean = true;

  constructor(private collaboratorService : CollaboratorServiceService,private companyService : CompanyServiceService, private router: Router, private activedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    let timeoutId;
    const params = this.activedRoute.snapshot.params;
    if(params.id){
      this.tenant = params.id;
      this.getAssignedColl(this.tenant);
      timeoutId = setTimeout(() =>{
        this.loadinginit = false;
        this.showtable= true;
      },750)
    }
    
  }

  registerCollaborators(){
    this.companyService.registerNewColls(this.tenant, this.collaborators).subscribe(
      res=>{
        if(res != null){
          let timeoutId;
          timeoutId = setTimeout(() =>{
            this.assignedcollaborators = [];
            this.unassignedcollaborators = [];
            this.collaborators = [];
            this.getAssignedColl(this.tenant);
        },550)
          
        }
      }, error => Swal.fire({
        title:'Error al asignar el colaborador asignado',
        text:error.error.message,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor:'#0096d2',
        icon:'error'
      })
    )
  }
  //Gets the assigned collaborators
  getAssignedColl(id : any){
    this.collaboratorService.getCompanyCollaborator(id).subscribe(
      res =>{
        let t : any = [];
        t = res;
        this.assignedcollaborators = [];
        this.assignedcollaborators = t.Collaborators;
        this.getCollaborators();
      },err=>{
        Swal.fire({
          title: 'Error',
          confirmButtonText: `Aceptar`,
          allowOutsideClick: false,
          allowEscapeKey: false,
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
  //Gets the collaborators for the form
  getCollaborators(){
     this.collaboratorService.getCollaborators().subscribe(
        res =>{
          let temp : any = [];
          temp = res;
          let t = temp.Collaborators;
          this.unassignedcollaborators = [];
          if(t.length < 0 || t == undefined){
              this.hasaccounts = false;
              this.notavailable = true;
          }
          else{
            if(this.assignedcollaborators.length > 0){
            
              for (let i = 0; i < t.length; i++) {
                if(this.filterColl(t[i])){
                  continue;
                }
                else{
                  if(t[i].rol_name  != "Administrador" && t[i].rol_name  != "Gerente contable"){
                    this.unassignedcollaborators.push(t[i]);
                  }
                }   
              } 
              if(this.unassignedcollaborators.length <= 0 || this.unassignedcollaborators == undefined){
                this.hasaccounts = false;
                this.notavailable = true;
              }
              else{
                this.hasaccounts = true;
                this.notavailable = false; 
              }            
            }
            else{
              for (let x = 0; x < temp.Collaborators.length; x++) {
                if(t[x].rol_name  != "Administrador" && t[x].rol_name  != "Gerente contable"){
                  this.unassignedcollaborators.push(t[x]);
                }
              }
              if(this.unassignedcollaborators.length <= 0 || this.unassignedcollaborators == undefined){
                this.hasaccounts = false;
                this.notavailable = true;
              }
              else{
                this.hasaccounts = true;
                this.notavailable = false; 
              }  
            }
          }

          

        },
        err => {}
      );
  }
  //Filters all the collaborators that are no assigned
  filterColl(col : any){
    for (let o = 0; o < this.assignedcollaborators.length; o++) {
      if(this.assignedcollaborators[o].id_collaborators == col.id_collaborators){
        return true;
      }
    }
    return false;

  }
  //Adds or remove collaborators before register
  addColl(col : any){
    if(col != undefined){
        if(this.collaborators.includes(col.id_collaborators)){
          let pos = this.collaborators.indexOf(col.id_collaborators);
          if(pos !== -1){
            this.collaborators.splice(pos,1);
          }
        }
        else{
          this.collaborators.push(col.id_collaborators);
        }
    }
  }
  async deleteColl(collaborator : any ){
    let collaborators : any = [];
    collaborators.push(collaborator.id_collaborators);
    await Swal.fire({
      title: 'Eliminar asignación de colaborador',
      text: '¿Desea deshacer la asignación de este colaborador?',
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor:'#0096d2',
      cancelButtonColor: '#0096d2',
      confirmButtonText: 'Deshacer',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.companyService.deleteColl(this.tenant,collaborators).subscribe(
          res =>{
            if(res != null){
              this.getAssignedColl(this.tenant);
              if(this.unassignedcollaborators.length < 0 || this.unassignedcollaborators == undefined){
                
                this.hasaccounts = false;
                this.notavailable = true;
              }
              else{
                this.hasaccounts = true;
                this.notavailable = false; 
              }  
              Swal.fire({
                title:'Eliminado',
                text:'El registro del colaborador ha sido eliminado.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonColor:'#0096d2',
                icon:'success'
              })
            }else{
              Swal.fire({
                title:'Error al eliminar el registro',
                text:'El registro del colaborador no ha sido eliminado.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonColor:'#0096d2',
                icon:'error'
              })
            }
          }, error => Swal.fire({
            title:'Error al eliminar el colaborador asignado',
            text:error.error.message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor:'#0096d2',
            icon:'error'
          })
        )
        
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title:'Cancelado',
          text:'El registro de asignación no ha sido eliminado.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonColor:'#0096d2',
          icon:'error'
        })
      }
    })

  }

}
