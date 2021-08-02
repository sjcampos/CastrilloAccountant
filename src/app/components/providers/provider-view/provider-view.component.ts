import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2';
//services
import { ProviderServiceService } from '../../../services/providers/provider-service.service';


@Component({
  selector: 'app-provider-view',
  templateUrl: './provider-view.component.html',
  styleUrls: ['./provider-view.component.css']
})
export class ProviderViewComponent implements OnInit {



  slug : string ="";
  providers : any = [];
  showtable : boolean = false;
  loadinginit : boolean = true;

  record : boolean = false;
  norecord : boolean = false;
  constructor( private router: Router, private activedRoute: ActivatedRoute, private providerService : ProviderServiceService) { }

  ngOnInit(): void {
    let timeoutId;
    const params = this.activedRoute.snapshot.params;
    if(params.slug){
      this.slug = params.slug;
      this.getProviders();
      timeoutId = setTimeout(() =>{
        if(this.providers.length <= 0){
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
  //gets all the providers
  getProviders(){
    this.providerService.getAllProviders(this.slug).subscribe(
      res=>{
        let temp : any = [];
        temp = res;
        this.providers = temp.data;
      }
    )
  }

  //Deletes an existing provider
  async deleteProvider(id : any){
    await Swal.fire({
      title: 'Eliminar proveedor',
      text: 'Al eliminar este registro no podra recuperarlo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.providerService.deleteProvider(id,this.slug).subscribe(
          res =>{
            if(res!= null){
              this.providers = [];
              this.getProviders();
              Swal.fire(
                'Eliminado',
                'El registro del proveedor ha sido eliminado.',
                'success'
              )
            }
            else{
              Swal.fire(
                'Error al eliminar el registro',
                'El registro del proveedor no ha sido eliminado.',
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
