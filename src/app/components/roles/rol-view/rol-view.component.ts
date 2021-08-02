import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
//models
import { Rol } from "../../../models/rol.model";
import { RolServiceService } from '../../../services/rol/rol-service.service';

@Component({
  selector: 'app-rol-view',
  templateUrl: './rol-view.component.html',
  styleUrls: ['./rol-view.component.css']
})
export class RolViewComponent implements OnInit {

  roles : any = [];
  formerror : boolean = false;
  errormessage : string = "";

  registerbutton : boolean = true;
  updatebutton : boolean = false;

  temproles : any = [];

  rol : Rol ={
    id_rol : 0,
    rol_name : "",
    rol_description : "",
    reg_date : ""
  };
  showtable : boolean = false;
  loadinginit : boolean = true;

  constructor(private router: Router, private rolService : RolServiceService) { }

  ngOnInit(): void {
    let timeoutId;
    this.getRoles();
    timeoutId = setTimeout(() =>{
      this.loadinginit = false;
      this.showtable= true;
    },750)
  }
  //gets all the roles
  getRoles(){
    this.rolService.getRoles().subscribe(
      res=>{
        let temp : any = [];
        temp = res;
        this.roles = temp.rols;
      }
    )
  }
  //register the new rol
  registerRol(){
    if(this.validData(this.rol)){
      this.rolService.registerRol(this.rol).subscribe(
        res=>{
          if(res != null){
            this.roles = [];
            this.cleanForm();
            this.getRoles();
          }
          else{
            console.log(res);
          }
        }, err =>{
          this.formerror = true;
          this.errormessage = err;
        }
      )
    }

  }
  //cleans the form data
  cleanForm(){
    this.rol.rol_name = "";
    this.rol.rol_description = "";
    this.rol.id_rol = 0;
    this.registerbutton = true;
    this.updatebutton = false;
  }
  //Validates de rol data
  validData(rol : Rol){
      if(rol.rol_name == "" || rol.rol_name == undefined || rol.rol_name.trim().length == 0){
        this.formerror = true;
        this.errormessage = "Ingrese un nombre de rol valido";
        return false;
      }
      if(rol.rol_description == "" || rol.rol_description == undefined || rol.rol_description.trim().length == 0){
        this.formerror = true;
        this.errormessage = "Debe ingresar una descripción valida para el rol."
        return false;
      }
      else{
        return true;
      }  
  }
  //Cancells the update process
  cancelUpdate(){
    this.cleanForm();
    this.roles = [];
    this.getRoles();
  }
  //enable the update process
  updateAvailable(rol : any){
    this.rol.rol_name = rol.rol_name;
    this.rol.rol_description = rol.rol_description;
    this.rol.id_rol = rol.id_rol;
    this.registerbutton = false;
    this.updatebutton = true;
    this.temproles = this.roles;
  }
  //Updates the rol data
  updateRol(){
    if(this.validData(this.rol)){
      this.rolService.updateRol(this.rol).subscribe(
        res=>{
          if(res != null){
            this.cleanForm();
            this.roles = [];
            this.getRoles();  
          }
          else{
            console.log("Error");
          }
        }, err =>{
          this.formerror = true;
          this.errormessage = err;
        }
      )
    }
  }
  //Deletes an existing rol
  async deleteRol(id : any){
    await Swal.fire({
      title: 'Eliminar Rol',
      text: 'Al eliminar este registro no podra recuperarlo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.rolService.deleteRol(id).subscribe(
          res =>{
            if(res != null){
              this.roles = [];
              this.getRoles();
              Swal.fire(
                'Eliminado',
                'El registro de el rol ha sido eliminado.',
                'success'
              )
            }
            else{
              Swal.fire(
                'Error al eliminar el registro',
                'El rol seleccionado no ha sido eliminado.',
                'error'
              )

            }
          } , error => Swal.fire(
            'Error al eliminar el rol seleccionado',
            error.error.message,
            'error'
          )

        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'El registro del rol no ha sido eliminado.',
          'error'
        )
      }
    })
  }


}
