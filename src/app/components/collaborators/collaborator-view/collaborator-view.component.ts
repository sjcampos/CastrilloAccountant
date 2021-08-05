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
      err => console.log(err)
    );
  }
  async getdeleteCol(id : any){
  await Swal.fire({
      title: 'Eliminar colaborador',
      text: 'Al eliminar este registro no podra recuperarlo',
      icon: 'warning',
      showCancelButton: true,
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
              Swal.fire(
                'Eliminado',
                'El registro del colaborador ha sido eliminado.',
                'success'
              )
            }else{
              Swal.fire(
                'Error al eliminar el registro',
                'El registro del colaborador no ha sido eliminado.',
                'error'
              )
            }
          }, error => Swal.fire(
            'Error al eliminar la cuenta seleccionada',
            error.error.message,
            'error'
          )
          )
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'El registro del colaborador no ha sido eliminado.',
          'error'
        )
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
      err => console.log(err)
    )
    return 0;
     
  }
}
