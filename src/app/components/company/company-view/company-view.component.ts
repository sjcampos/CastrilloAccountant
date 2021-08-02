import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

//services
import { CompanyServiceService } from '../../../services/companies/company-service.service';




@Component({
  selector: 'app-company-view',
  templateUrl: './company-view.component.html',
  styleUrls: ['./company-view.component.css']
})
export class CompanyViewComponent implements OnInit {

  companies : any = [];
  showtable : boolean = false;
  loadinginit : boolean = true;

  record : boolean = false;
  norecord : boolean = false;

  constructor(private router: Router, private companyService:CompanyServiceService) { }

  ngOnInit(): void {
    let timeoutId;
    this.getCompanies();
    timeoutId = setTimeout(() =>{
      if(this.companies.lenght <= 0){
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

  async deleteComp(id : any){
    await Swal.fire({
        title: 'Eliminar companía',
        text: 'Al eliminar este registro no podra recuperarlo y se eliminaran todos los datos relacionados a la companía seleccionada.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.companyService.deleteCompany(id).subscribe(
            res =>{
              if(res != null){
                this.getCompanies();
                Swal.fire(
                  'Eliminado',
                  'El registro de la compañía ha sido eliminado.',
                  'success'
                )
              }
              else{
                Swal.fire(
                  'Error al eliminar el registro',
                  'La companía seleccionada no ha sido eliminada.',
                  'error'
                )

              }
            } , error => Swal.fire(
              'Error al eliminar la compañía seleccionada',
              error.error.message,
              'error'
            )
          )
          
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
            'El registro de la compañía no ha sido eliminado.',
            'error'
          )
        }
      })
  
  }

}
