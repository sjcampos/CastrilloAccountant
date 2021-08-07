import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';


//services
import { CollaboratorServiceService } from '../../../services/collaborators/collaborator-service.service';

@Component({
  selector: 'app-collaborator-view',
  templateUrl: './collaborator-view.component.html',
  styleUrls: ['./collaborator-view.component.css']
})
export class CollaboratorViewComponent implements OnInit {
  filterCollab : any = [];
  newcollaborators : any =[];
  iddelete : number ;

  showtable : boolean = false;
  loadinginit : boolean = true;

  record : boolean = false;
  norecord : boolean = false;

  constructor(private collaboratorService : CollaboratorServiceService,private router: Router) { }

  ngOnInit(): void {
    let timeoutId;
    this.getCollaborators();
    timeoutId = setTimeout(() =>{
      if(this.newcollaborators.lenght <= 0){
        this.record = false;
        this.norecord = true;
      }
      else{
        this.record = true,
        this.norecord = false;
      }
      this.loadinginit = false;
      this.showtable= true;
    },800)
  }
  //Gets the collaborators for the form
  getCollaborators(){
    this.collaboratorService.getCollaborators().subscribe(
      res =>{
        this.filterCollab = res;
        for (let index = 0; index < this.filterCollab.Collaborators.length; index++) {
          if(this.filterCollab.Collaborators[index].rol_name != "Administrador"){
            this.newcollaborators.push(this.filterCollab.Collaborators[index]);
          }
        }
        

      },
      err => {

      }
    );
  }
  async getdeleteCol(id : any){
  await Swal.fire({
      title: 'Eliminar colaborador',
      text: 'Al eliminar este registro no podrá recuperarlo',
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor:'#0096d2',
      cancelButtonColor: '#0096d2',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        //let res = this.deleteCol(id);
        this.collaboratorService.deleteCollaborator(id).subscribe(
          res =>{
            if(res != null){
              this.newcollaborators = [];
              this.getCollaborators();
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
            title:'Error al eliminar la cuenta seleccionada',
            text: error.error.message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor:'#0096d2',
            icon: 'error'
          })
          )
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title:'Cancelado',
          text:'El registro del colaborador no ha sido eliminado.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonColor:'#0096d2',
          icon:'error'
      })
      }
    })

  }
  deleteCol(id:any){
    this.collaboratorService.deleteCollaborator(id).subscribe(
      res =>{
        if(res != null){
          return 1;
        }else{
          return 2;
        }
      },
      err => {

      }
    )
    return 0;
     
  }
}
