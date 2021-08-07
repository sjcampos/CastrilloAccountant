import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
//models
import { collaborator } from '../../../models/collaborator.model';
import { Rol } from "../../../models/rol.model";
import { permission } from '../../../models/permission.model';
//services
import { CollaboratorServiceService } from '../../../services/collaborators/collaborator-service.service';
import { RolServiceService } from '../../../services/rol/rol-service.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-collaborator-form',
  templateUrl: './collaborator-form.component.html',
  styleUrls: ['./collaborator-form.component.css']
})
export class CollaboratorFormComponent implements OnInit {

  update: boolean = false;
  
  register: boolean = true;

  showerror : boolean = false;
  messageerror : string = "";

  showRoles : any = [];

  updatecol : boolean = true;
  rolactual : boolean = false;

  showPermissions : any = [];

  idrol : number = 0;

  loadinginit : boolean = true;
  showregister : boolean = false;

  newCollaborator : collaborator ={
    id_collaborators : "0",
    id_rol : "0",
    collaborator_name : "",
    collaborator_lastname : "",
    identification : "",
    collaborator_password : "",
    email : "",
    number_phone : "",
    reset_password : true,
    collaborator_active : true,
    reg_date : "",
    rol_name : "",
    rol_description : "",
    permissions: []
  };

  rol : Rol;
  
  constructor(private CollaboratorService: CollaboratorServiceService, private RolService: RolServiceService,private router: Router, private activedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    let timeoutId;
    this.getRoles();
    this.createPermissions();
    const params = this.activedRoute.snapshot.params;
    if(params.id){
      this.update = true;
      this.register = false;
      let cols : any;
      this.CollaboratorService.getSingleCollaborator(params.id).subscribe(
        res => {
          if(res != null){
            cols = res;
            this.updatecol = false;
            this.rolactual = true;
            this.newCollaborator = cols.Collaborators[0]; 
            this.updatePermissions(this.newCollaborator.permissions);
            timeoutId = setTimeout(() =>{
              this.loadinginit = false;
              this.showregister = true;
            },850)  
          }
        },err =>{
          this.loadinginit = false;
          Swal.fire({
            title: 'Error',
            confirmButtonText: `Aceptar`,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor:'#0096d2',
           text: err.error.message
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate([`/collaboratorlist`]);
            } 
          })

        }
      )
    }
    else{
      this.loadinginit = false;
      this.showregister = true;
    }
    
  }

//Marks the permissions that the user already have
  updatePermissions(per :any){
    let tempPer : any  =[];
    for (let i = 0; i < per.length; i++) {
      for (let x = 0; x < this.showPermissions.length; x++) {
        if(this.showPermissions[x].id_permission === per[i].id_permission){
          tempPer.push(per[i].id_permission);
          this.showPermissions[x].mark = true;
        } 
      }    
    }
    this.newCollaborator.permissions = tempPer;
  }
  //Creates the permissions
  createPermissions(){

    let p1 : permission ={
      id_permission: 1,
      permission_name: "Descarga de reportes",
      permission_description: "Permite la descarga de cualquier reporte de la plataforma web.",
      mark : false
    };
    let p2 : permission ={
      id_permission: 2,
      permission_name: "Visualización de reportes",
      permission_description: "Permite la visualización de cualquier reporte de la plataforma web.",
      mark : false
    };
    let p3 : permission ={
      id_permission: 3,
      permission_name: "Registro de asientos contables",
      permission_description: "Permite el registro de asientos contables en la plataforma web.",
      mark : false
    };
    let p4 : permission ={
      id_permission: 4,
      permission_name: "Historial contable",
      permission_description: "Este permiso se utiliza para permitir la visualización del historial de actividades contables en las cuentas de gerentes.",
      mark : false
    };
    let p5 : permission ={
      id_permission: 5,
      permission_name: "Historial de personal",
      permission_description: "Este permiso se utiliza para permitir la visualización del historial de actividades de personal en las cuentas de gerentes.",
      mark : false
    };
    this.showPermissions.push(p1);
    this.showPermissions.push(p2);
    this.showPermissions.push(p3);
    this.showPermissions.push(p4);
    this.showPermissions.push(p5);
    

  }
  //Gets all the roles and shows all but the admin role
  getRoles(){
    let roles : any = [];
    this.RolService.getRoles().subscribe(
      res =>{
        roles = res;
        for (let i = 0; i < roles.rols.length; i++) {
          
          if(roles.rols[i].rol_name != "Administrador"){
            this.showRoles.push(roles.rols[i]);
          }
        }
        
      }
    )
  }
  //Change the rol of the collaborator
  changeRol(rol:any){
    if(rol != undefined){
      
      this.newCollaborator.id_rol = rol.id_rol;
    }
    else{
      this.newCollaborator.id_rol = "0";
    }
    if(this.update){
        this.newCollaborator.rol_name = rol.rol_name
    }
    
    
  }
  //Adds or deletes the permissions of the collaborator
  AddPer(per : any){
    if(this.newCollaborator.permissions.includes(per)){
      let pos = this.newCollaborator.permissions.indexOf(per);
      if(pos !== -1){
        this.newCollaborator.permissions.splice(pos,1);
      }
    }
    else{
      this.newCollaborator.permissions.push(per);
    }
  }
  //Registers a new collaborator
 async RegisterNewCollaborator(){
   if(this.ValidData(this.newCollaborator)){
     this.CollaboratorService.createCollaborator(this.newCollaborator).subscribe(
       res=>{
            if(res != null){
              this.router.navigate(['/collaboratorlist']);
            }
       },
       (err) =>{
        this.showerror = true;
        this.messageerror = err.error['message'];
       }
     )
     
   }
 }
 updateCollaborator(){
  if(this.newCollaborator.reset_password){
    this.newCollaborator.reset_password = true;
  }
  else{
    this.newCollaborator.reset_password = false;
  }
  if(this.newCollaborator.collaborator_active){
    this.newCollaborator.collaborator_active = true;
  }
  else{
    this.newCollaborator.collaborator_active = false;
  }
  let temp = this.newCollaborator.number_phone.toString();
  this.newCollaborator.number_phone = temp;

  if(this.ValidData(this.newCollaborator)){
    this.CollaboratorService.updateCollaborator(this.newCollaborator).subscribe(
      res=>{
        if(res != null){
          this.router.navigate(['/collaboratorlist']);
        }
      },
      (err) =>{
        this.showerror = true;
        this.messageerror = err['error']['message'];
       }
    )
  }

 }
 //Validates collaborator form
  ValidData(newCollaborator: collaborator) {
    if(newCollaborator.collaborator_name.trim().length === 0 || newCollaborator.collaborator_name === null || newCollaborator.collaborator_name === undefined){
      this.showerror = true;
      this.messageerror = "Debe ingresar el nombre del colaborador.";
      return false;
    }
    if(newCollaborator.collaborator_lastname.trim().length === 0 || newCollaborator.collaborator_lastname === null || newCollaborator.collaborator_lastname === undefined){
      this.showerror = true;
      this.messageerror = "Debe ingresar el apellido del colaborador.";
      return false;
    }
    if(newCollaborator.identification.trim().length === 0 || newCollaborator.identification === null || newCollaborator.identification === undefined){
      this.showerror = true;
      this.messageerror = "Debe ingresar una identificación valida para el colaborador.";
      return false;
    }
    if(newCollaborator.number_phone === null || newCollaborator.number_phone === undefined){
      this.showerror = true;
      this.messageerror = "Debe ingresar un número de teléfono válido.";
      return false;
    }
    if(newCollaborator.email.trim().length === 0 || newCollaborator.email === null || newCollaborator.email === undefined){
      this.showerror = true;
      this.messageerror = "Debe ingresar un email válido.";
      return false;
    }
    if(newCollaborator.collaborator_password.trim().length === 0 || newCollaborator.collaborator_password === null || newCollaborator.collaborator_password === undefined){
      this.showerror = true;
      this.messageerror = "Debe ingresar una contraseña válida.";
      return false;
    }
    if( newCollaborator.id_rol === null || newCollaborator.id_rol === undefined || newCollaborator.id_rol === "0"){
      this.showerror = true;
      this.messageerror = "Debe escoger un rol para el colaborador.";
      return false;
    }
    if(newCollaborator.permissions.length <= 0 ){
      this.showerror = true;
      this.messageerror = "Debe agregar permisos al colaborador.";
      return false;
    }
    else{
      return true;
    }

  }
}
