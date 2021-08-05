import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2';
//services
import { ClientServiceService } from '../../../services/clients/client-service.service';

@Component({
  selector: 'app-clients-view',
  templateUrl: './clients-view.component.html',
  styleUrls: ['./clients-view.component.css']
})
export class ClientsViewComponent implements OnInit {

  slug : string ="";
  clients : any = [];

  showtable : boolean = false;
  loadinginit : boolean = true;

  record : boolean = false;
  norecord : boolean = false;

  constructor(private router: Router, private activedRoute: ActivatedRoute, private clientService : ClientServiceService) { }

  ngOnInit(): void {
    let timeoutId;
    const params = this.activedRoute.snapshot.params;
    if(params.slug){
      this.slug = params.slug;
      this.getClients(this.slug);
      timeoutId = setTimeout(() =>{
        if(this.clients.length <= 0){
          this.record = false;
          this.norecord = true;
        }
        else{
          this.record = true;
          this.norecord = false;
        }
        this.loadinginit = false;
        this.showtable= true;
      },750)
    }
  }
  //Gets clients
  getClients(slug : any){
      this.clientService.getClients(slug).subscribe(
        res=>{
            let temp : any = [];
            temp= res;
            this.clients = temp.data;
        }
        ,err=> {
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
      );
  }
  //Deletes an existing provider
  async deleteClient(id : any){
    await Swal.fire({
      title: 'Eliminar cliente',
      text: 'Al eliminar este registro no podra recuperarlo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.clientService.deleteClient(id,this.slug).subscribe(
          res =>{
            if(res!= null){
              this.clients = [];
              this.getClients(this.slug);
              Swal.fire(
                'Eliminado',
                'El registro del cliente ha sido eliminado.',
                'success'
              )
            }
            else{
              Swal.fire(
                'Error al eliminar el registro',
                'El registro del cliente no ha sido eliminado.',
                'error'
              )
            }
          }, error => Swal.fire(
            'Error al eliminar el registro',
            error.error.message,
            'error'
          )
        )
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'El registro del proveedor no ha sido eliminado.',
          'error'
        )
      }
    })

  }

}
