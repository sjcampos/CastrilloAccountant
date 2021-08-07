import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

//services
import { CollaboratorServiceService } from '../../../services/collaborators/collaborator-service.service';
import { ResetServiceService } from '../../../services/resetpassword/reset-service.service';
import { collaborator } from '../../../models/collaborator.model';

@Component({
  selector: 'app-collaborators-reset',
  templateUrl: './collaborators-reset.component.html',
  styleUrls: ['./collaborators-reset.component.css']
})
export class CollaboratorsResetComponent implements OnInit {
  filterCollab : any = [];
  collaborators : any =[];
  loadinginit : boolean = false;
  showtable : boolean =  false;
  showmessage : boolean = false;
  loading : boolean = true;
  message : string = "";
  p : number = 1;

  identification : any;

  constructor(private collaboratorService : CollaboratorServiceService,private router: Router,private resetService:ResetServiceService) { }

  ngOnInit(): void {
    let timeoutId;
    this.getCollaborators();
    timeoutId = setTimeout(() =>{
      this.loading = false;
      this.showtable= true;
    },750)
  }

  
  //Gets the collaborators for the form
  getCollaborators(){
    this.collaboratorService.getCollaborators().subscribe(
      res =>{
        this.filterCollab = res;
        for (let index = 0; index < this.filterCollab.Collaborators.length; index++) {
          if(this.filterCollab.Collaborators[index].rol_name != "Administrador"){
            this.collaborators.push(this.filterCollab.Collaborators[index]);
          }
        }
      },
      err => {

      }
    );
    
  }
  //resets the view
  resetview(){
    this.collaborators = [];
    this.getCollaborators();
    this.showmessage = false;
    this.showtable = true;
  }
  //resets the password
  async resetPassword(id : any){
    await Swal.fire({
      title: 'Cambiar contraseña',
      text: '¿Esta seguro que desea cambiar la contraseña de este colaborador?',
      icon: 'warning',
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor:'#0096d2',
      showCancelButton: true,
      confirmButtonText: 'Cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if(id != 0 && id != undefined && id > 0 ){
          let c ={
            id : id.toString(),
            type: 'CO',      
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
          Swal.fire({
            title:'Cancelado',
            text:'Se necesita un colaborador valido para realizar un cambio de contraseña.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor:'#0096d2',
            icon:'error'
          })
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title:'Cancelado',
          text:'El cambio de contraseña no ha sido efectuado.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonColor:'#0096d2',
          icon:'error'
        })
      }
    })
  }
  //Search the collaborator
  searchCollab(){
    if(this.identification == ""){
      this.collaborators = [];
      this.getCollaborators();
      }
      else{
        this.collaborators = this.collaborators.filter((res: collaborator) =>{
        return res.identification?.match(this.identification)});
        }
  }
}
