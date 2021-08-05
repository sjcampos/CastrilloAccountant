import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
//models
import { company } from '../../../models/company.model';
//services
import { StorageServiceService } from '../../../services/localstorage/storage-service.service';
import { ReportServiceService } from '../../../services/reports/report-service.service';
import { CompanyServiceService } from '../../../services/companies/company-service.service';

@Component({
  selector: 'app-cxp-view',
  templateUrl: './cxp-view.component.html',
  styleUrls: ['./cxp-view.component.css']
})
export class CxpViewComponent implements OnInit {

  coll : boolean = false;
  manager : boolean = false;
  companies : any = [];
  selectcompany : company;
  slug : any;
  existingaccounts : any = [];

  divdata : boolean = false;
  divnodata : boolean = true;
  p : number = 1;

  specificdate : any;

  divreg : boolean = false;
  divloading : boolean = true;

  idColl : any;
  loadingMessage : string = "Cargando información...";

  divfilter1 : boolean = true;
  divfilter2 : boolean = false;

  chspecDate : boolean = false;
  choverdue : boolean = false;
  chrange : boolean = false;

  showerror : boolean = false;
  messageerror : string = "";

  buttonFilter : boolean = false;
  buttonDownload : boolean = false;

  range : number = 1;

  divspecdate : boolean = false;
  divrange : boolean = false;
  filter : any;

  constructor(private companyService:CompanyServiceService,private storageService : StorageServiceService,private reportService : ReportServiceService) { }

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
        this.reportService.getCXPPDF(this.slug, this.existingaccounts).subscribe(
          res =>{
            if(res != null){
              let temp : any;
              temp = res;
              let base64String =temp.report.toString();
              this.downloadPdf(base64String,"Cuentas por pagar");
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
  //changes the company
  changeCompany(c : any){
    if(c != undefined){
      if(c.slug != this.slug){
        this.slug = c.slug;
        this.buttonFilter = false;
        this.buttonDownload = false;
        this.divdata = false;
        this.divnodata = true;
        this.getUpcomingAccounts(30);
      }else{
        this.slug = c.slug;
        this.getUpcomingAccounts(30);
      }
    }
    else{
      this.slug = null;
      this.buttonFilter = false;
      this.buttonDownload = false;
      this.divdata = false;
      this.divnodata = true;
      this.cleanFilter();
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
  //Bring suggestions accounts
  getUpcomingAccounts(filter : any){
    this.reportService.getCXP(this.slug,filter).subscribe(
      res =>{
        if(res != null){
          let temp : any = [];
          temp = res;
          if(temp.accounts != undefined){
            let show : string = "";
            for (let i = 0; i < temp.accounts.length; i++) {
              show = show + "Cuenta: "+temp.accounts[i].account_name+"<br>Fecha vencimiento: "+temp.accounts[i].DATE+"<br>Contacto: "+temp.accounts[i].contact+"<br>Teléfono: "+ 
              temp.accounts[i].number_phone+"<br>***********************************************<br>";
            }
            Swal.fire({
              title: 'Cuentas por pagar próximas a vencer en 30 días',
              html: `${show}`,
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonColor:'#0096d2',
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            }).then((result) => {
              if (result.isConfirmed) {
                this.buttonFilter = true;
              }
            })
          }else{
            this.buttonFilter = false;
            this.showmodalError("Esta empresa no tiene con cuentas por pagar.");
          }
        }
      },err=>{
        console.log(err);
      }
    )
  }
  //Gets the accounts with filter
  getAccounts(fil : any){
    this.divreg = false;
    this.divloading = true;
    this.loadingMessage = "Procesando solicitud...";
    let timeoutId;
    this.reportService.getCXP(this.slug,fil).subscribe(
      res =>{
        if(res != null){
          let temp : any = [];
          temp = res;
          console.log(temp.accounts);
          if(temp.accounts != undefined){
            if(temp.accounts.length > 0){
              this.buttonDownload = true;
              this.existingaccounts = temp.accounts;
              timeoutId = setTimeout(() =>{
                this.divloading = false;
                this.divreg = true;
                this.divnodata = false;
                this.divdata = true;
                this.cleanFilter();
              },850)
            }else{
              this.divnodata = true;
              this.buttonDownload = false;
              this.divdata = false;
              this.divreg = true;
              this.divloading = false;
              this.showmodalError("No existen cuentas que encajen con el filtro seleccionado");
            }
          }else{
            this.divnodata = true;
            this.divdata = false;
            this.buttonDownload = false;
            this.divreg = true;
            this.divloading = false;
            this.showmodalError("No existen cuentas que encajen con el filtro seleccionado");
          }
        }
      },err=>{
        this.divnodata = true;
        this.divdata = false;
        this.buttonDownload = false;
        this.divreg = true;
        this.divloading = false;
        console.log(err);
        this.showmodalError(err.error.message);
      }
    )
  }
  //Change the filter
  changeFilter(f : any){
    switch (f) {
      case 1:
        if(this.choverdue && this.chrange){
          this.chrange = false;
          this.choverdue = false;
          this.divspecdate = false;
          this.filter = null;
        }else{
          this.choverdue = true;
          this.chrange = true;
          this.divspecdate = true;
          this.filter = "specDate";
        }
        break;
      case 2:
        if(this.chrange && this.chspecDate){
          this.chrange = false;
          this.chspecDate = false;
          this.filter = null;
        }
        else{
          this.chrange = true;
          this.chspecDate = true;
          this.filter = "due";
        }
        break;
      case 3:
        if(this.choverdue && this.chspecDate){
          this.choverdue  = false;
          this.chspecDate = false;
          this.divrange = false;
          this.filter = null;
        }
        else{
          this.choverdue  = true;
          this.chspecDate = true;
          this.divrange = true;
          this.filter = "range";
        }
        break;
      default:
        break;
    }

  }
  //Get the accounts according to filters
  getFilterAccounts(){
    if(this.filter == "specDate"){
      let date;
      if(this.specificdate != undefined){
        date = this.specificdate.value;
        this.getAccounts(date);
      }else{
        this.showmodalError("Debe seleccionar una fecha valida.");
      }
    }
    else if(this.filter == "due"){
      this.getAccounts('overdue');
    }
    else if(this.filter == "range"){
      if(this.range != undefined && this.range != null && this.range > 0){
          this.getAccounts(this.range);
      }
      else{
        this.showmodalError("Debe ingresar una cantidad de días valida.");
      }
    }else{
      this.showmodalError("Debe seleccionar un filtro.");
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
  //cleans the filter
  cleanFilter(){
    this.chrange = false;
    this.choverdue = false;
    this.chspecDate = false;
    this.divspecdate = false;
    this.divrange = false;
    this.specificdate = null;
    this.filter = null;
    if(this.divfilter1){
      this.divfilter1 = false;
      this.divfilter2 = true;
    }
    else{
      this.divfilter2 = false;
      this.divfilter1 = true;
    }
  }

}
