import { Component, OnInit } from '@angular/core';
import { company } from '../../../models/company.model';
import Swal from 'sweetalert2';
//services
import { CompanyServiceService } from '../../../services/companies/company-service.service';
import { StorageServiceService } from '../../../services/localstorage/storage-service.service';
import { ReportServiceService } from '../../../services/reports/report-service.service';
import { ClientServiceService } from '../../../services/clients/client-service.service';

@Component({
  selector: 'app-clixemp-view',
  templateUrl: './clixemp-view.component.html',
  styleUrls: ['./clixemp-view.component.css']
})
export class ClixempViewComponent implements OnInit {
  coll : boolean = false;
  manager : boolean = false;
  companies : any = [];
  selectcompany : company;
  slug : any;
  p : number = 1;

  clients : any = [];
  divdata : boolean = false;
  divnodata : boolean = true;

  record : boolean = false;
  norecord : boolean = false;


  divreg : boolean = false;
  divloading : boolean = true;
  idColl : any;
  loadingMessage : string = "Cargando información...";

  buttonlookUp : boolean = false;
  buttondownload : boolean = false;

  constructor(private companyService:CompanyServiceService,private storageService : StorageServiceService,private clientService : ClientServiceService,private reportService : ReportServiceService) { }

  ngOnInit(): void {
    let timeoutId;
    let data = this.storageService.readData();
    if(data.permissions.includes("4") && data.permissions.includes("5")){
      this.coll = false;
      this.manager = true;
      this.getCompanies();
    }
    else{
      this.idColl = data.id;
      this.coll = true;
      this.manager = false;
      this.getCollCompanies(this.idColl);
    }
    timeoutId = setTimeout(() =>{
      this.divloading = false;
      this.divreg = true;
    },850)
  }

  //changes the company
  changeCompany(c : any){
    if(c != undefined){
        this.slug = c.slug;
        this.buttonlookUp = true;
        this.cleanValues();
    }
    else{
      this.slug = null;
      this.divdata = false;
      this.divnodata = true;
      this.buttondownload = false;
      this.buttonlookUp = false;
    }
  }
  //Gets all the companies for the manager
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
  //Gets the companys of a collaborator
  getCollCompanies(id : any){
    this.companyService.getCollabCompanies(id).subscribe(
      res=>{
        let comp: any = [];
        comp = res;
        this.companies = comp.companys;
        
      },
      err => console.log(err)
    )
  }
  //Gets the clients of a company
  getClients(){
    if(this.slug != null && this.slug != undefined){
      let timeoutId;
      this.divreg = false;
      this.divloading = true;
      this.clientService.getClients(this.slug).subscribe(
        res=>{
            let temp : any = [];
            temp= res;
            if(temp.data.length > 0){
              this.clients = temp.data;
              this.divdata = true;
              this.divnodata = false;
              timeoutId = setTimeout(() =>{
                this.divloading = false;
                this.buttondownload = true;
                this.divreg = true;
              },850)
            }else{
              this.divloading = false;
              this.divreg = true;
              this.buttondownload = false;
              this.showmodalError("No se cuenta con clientes registrados");
            }
        }
        ,err=> {
          console.log(err)
          this.showmodalError(err.error.message);
        }
      );
    }
    else{
      this.showmodalError('Debe seleccionar una empresa.');
    }
  }
  //Shows modal error
  showmodalError(text :string){
    Swal.fire({
      title: 'Atención',
      text : text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor:'#0096d2',
      icon: 'warning',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })
  }
  //Converts and downloads the pdf
  downloadPdf(base64String : any, fileName : any) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}.pdf`
    link.click();
  }
  //Gets the PDF file on base64 
  onClickDownloadPdf(){
    let data = this.storageService.readData();
    if(data.permissions.includes("1")){
      if(this.slug != null || this.slug != undefined){
        this.reportService.getCLIXCOMPPDF(this.slug).subscribe(
          res =>{
            if(res != null){
              let temp : any;
              temp = res;
              let base64String =temp.report.toString();
              this.downloadPdf(base64String,"Clientes por empresa");
            }
          },err =>{
            this.showmodalError(err.error.message);        
          } 
        )
      }else{
      this.showmodalError('No se cuenta con un identificador de compañía valido, refresque la página por favor.');
      }
    }else{
      this.showmodalError('No cuenta con los permisos necesarios para realizar esta acción.');
    }
  
  }
  //cleans values
  cleanValues(){
    this.clients = [];
    this.divdata = false;
    this.divnodata = true;
    this.buttondownload = false;
  }

}
