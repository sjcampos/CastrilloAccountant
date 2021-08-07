import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
//models
import { company } from '../../../models/company.model';
//services
import { StorageServiceService } from '../../../services/localstorage/storage-service.service';
import { ReportServiceService } from '../../../services/reports/report-service.service';
import { CompanyServiceService } from '../../../services/companies/company-service.service';


@Component({
  selector: 'app-asc-view',
  templateUrl: './asc-view.component.html',
  styleUrls: ['./asc-view.component.css']
})
export class AscViewComponent implements OnInit {
  
  coll : boolean = false;
  manager : boolean = false;
  companies : any = [];
  selectcompany : company;
  slug : any;
  idColl : any;
  dataentry : any = [];
  entries : any = [];
  divreg : boolean = false;
  divloading : boolean = true;
  loadingMessage : string = "Cargando información...";
  divdata : boolean = false;
  divnodata : boolean = true;
  p : number = 1;

  divfilter1 : boolean = true;
  divfilter2 : boolean = false;
  buttondownload : boolean = false;
  buttonfilter : boolean = false;

  chmonth : boolean = false;
  chyear : boolean = false;
  chdate : boolean = false;

  dateObj1 : any;
  dateObj2 : any;
  year : number = 2021;

  divyear : boolean = false; 
  divspecdate : boolean = false;
  divmonth : boolean = false;
  filterdate : any;
  showerror : boolean = false;
  messageerror : string = "";
  type : any;

  entrycode : any;
  entryregdate : any;
  entrydate : any;
  entrydetail : any;
  entryindex : number = 0;
  totaldebe : number = 0;
  totalhaber : number = 0;
  constructor( private companyService:CompanyServiceService,private storageService : StorageServiceService,private reportService : ReportServiceService) { }

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
      this.buttonfilter = true;
      this.buttondownload = false;
      this.cleanValues();
      this.cleanFilter();
    }
    else{
      this.slug = null;
      this.buttonfilter = false;
      this.divnodata = true;
      this.divdata = false;
      this.reset();
    }
  }
  //Resets all the lists and values
  reset(){
    this.entries = [];
    this.dataentry = [];
    this.entrycode = "";
    this.entrydate = "";
    this.entryregdate = "";
    this.entrydetail = "";
    this.slug = null;
    this.chmonth = false;
    this.chdate = false;
    this.chyear = false;
    this.filterdate = null;
    this.year = 2021;
    this.dateObj1 = undefined;
    this.dateObj2 = undefined;
    this.entryindex = 0;
    this.totaldebe = 0;
    this.totalhaber = 0;
    this.buttondownload = false;
  }
  //Clean values
  cleanValues(){
    this.entries = [];
    this.dataentry = [];
    this.totaldebe = 0;
    this.totalhaber = 0;
    this.entryindex = 0;
    this.entrycode = "";
    this.entrydate = "";
    this.entrydetail = "";
    this.entryregdate = "";
    this.divnodata = true;
    this.divdata = false;
  }
  ///Cleans the filter
  cleanFilter(){
    this.chmonth = false;
    this.chyear = false;
    this.chdate = false;
    this.type = "";
    this.year = 2021;
    this.dateObj1 = undefined;
    this.dateObj2 = undefined;
    if(this.divfilter1){
      this.divfilter2 = true;
      this.divfilter1 = false;
    }else{
      this.divfilter2 = false;
      this.divfilter1 = true;
    }
    this.divspecdate = false;
    this.divmonth = false;
    this.divyear = false;
    this.showerror = false;
    this.messageerror = "";
  }
  //Gets all the companies for the manager
  getCompanies(){
    this.companyService.getCompanies().subscribe(
      res=>{
        let comp: any = [];
        comp = res;
        this.companies = comp.data; 
      },
      err => {
        
      }
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
      err => {}
    )
  }
  //Change the filter
  changeFilter(f : any){
    switch (f) {
      case 1:
        if(this.divspecdate){
          this.divspecdate = false;
          this.chyear = false;
          this.chmonth = false;
          this.type = null;
        }else{
          this.divspecdate = true;
          this.chmonth = true;
          this.chyear = true; 
          this.type = "date";
        }
        break;
      case 2:
        if(this.divmonth){
          this.divmonth = false;
          this.chyear = false;
          this.chdate = false;
          this.type = null;
        }else{
          this.divmonth = true;
          this.chdate = true;
          this.chyear = true; 
          this.type = "month";
        }
        break;
      case 3:
        if(this.divyear){
          this.divyear = false;
          this.chmonth = false;
          this.chdate = false;
          this.type = null;
        }else{
          this.divyear = true;
          this.chdate = true;
          this.chmonth = true; 
          this.type = "year";
        }
        break;
      default:
        break;
    }

  }
  //Generates an specific month date
  changeValue(e : any){
    let tempMonth;
    let tempYear;
    if(e != undefined){
      if(e._d.getMonth().toString().trim().length == 1){
        if(e._d.getMonth() == 0){
          tempMonth = "01";
          tempYear = e._d.getFullYear();
        }
        else{
          if(e._d.getMonth() == 9){
            tempMonth = e._d.getMonth() + 1;
            tempYear = e._d.getFullYear();

          }else{
            tempMonth = "0"+(e._d.getMonth() + 1);
            tempYear = e._d.getFullYear();  
          }      
        }
      }
      else{
        if(e._d.getMonth() == 11){
          tempMonth = 12;
          tempYear = e._d.getFullYear();
        }
        else{
          tempMonth = e._d.getMonth() + 1;
          tempYear = e._d.getFullYear();  
        }
      }
      this.filterdate = {
        'month' : tempMonth,
        'year' : tempYear
      }
    }else{
      this.filterdate = undefined;
    }
  }
  //Gets the accounting entries
  getEntries(){
    if(this.slug != undefined && this.slug != null){
      if(this.type != null && this.type != undefined){
        switch (this.type) {
          case 'date':
            let date = this.dateObj1.value;
            if(date != null && date != undefined){
              this.getDBEntries('date',date);
            }else{
              this.showmodalError("Debe seleccionar una fecha válida.");
            }
            break;
          case 'month':
            if(this.filterdate != undefined && this.filterdate != null){
              let newdate = this.filterdate.year+"-"+this.filterdate.month+"-01"; 
              this.getDBEntries('month',newdate);
            }
            else{
              this.showmodalError("Debe seleccionar una fecha válida.");
            }
            break;
          case 'year':
            if(this.year != null && this.year != undefined){
              let dateyear = this.year+"-01-01";
              this.getDBEntries('year',dateyear);
            }else{
              this.showmodalError("Debe seleccionar una fecha válida.");
            }
            break;
          default:
            this.showmodalError("Debe seleccionar un filtro.");
            break;
        }
      }
      else{
        this.showmodalError("Debe seleccionar un tipo de filtro");
      }

    }else{
      this.showmodalError("Debe de seleccionar una compañía");
    }
  }
  //Gets the entries from the DB
  getDBEntries(type : any, filter : any){
    this.reportService.getASC(this.slug, type,filter).subscribe(
      res =>{
        if(res != null){
          let temp : any = [];
          temp = res;
          if(temp.seats.length > 0){
            this.entries = temp.seats;
            this.entrycode = this.entries[0][0].code;
            this.entryregdate = this.entries[0][0].register_date;
            this.entrydate = this.entries[0][0].account_date;
            this.entrydetail = this.entries[0][0].details;
            this.dataentry = this.entries[this.entryindex];
            this.total(this.dataentry);
            this.divnodata = false;
            this.divdata = true;
            this.buttondownload = true;
          }else{
            this.divdata = false;
            this.divnodata = true;
            this.showmodalError("No existen asientos registrados acordes al filtro seleccionado.");
          }
        }
      },err =>{
        this.showmodalError(err.error.message);
        this.divdata = false;
        this.divnodata = true;
      }
    )
  }
  //Shows the next entry on the main list
  nextEntry(){
    if(this.entryindex >= this.entries.length-1){
      this.showmodalError("No se cuenta con más asientos contables para mostrar.");
    }else{
      this.entryindex = this.entryindex +1;
      this.dataentry = [];
      this.dataentry = this.entries[this.entryindex];
      this.entrycode = this.dataentry[0].code;
      this.entryregdate = this.dataentry[0].register_date;
      this.entrydate = this.dataentry[0].account_date;
      this.entrydetail = this.dataentry[0].details;
      this.totaldebe = 0;
      this.totalhaber = 0;
      this.total(this.dataentry);
    }

  }
  //Shows the previous entry on the main list
  previousEntry(){
    if(this.entryindex <= 0){
      this.entryindex = 0;
      this.showmodalError("No se cuenta con más asientos contables para mostrar.");
    }else{
      this.entryindex = this.entryindex -1;
      this.dataentry = this.entries[this.entryindex];
      this.entrycode = this.dataentry[0].code;
      this.entryregdate = this.dataentry[0].register_date;
      this.entrydate = this.dataentry[0].account_date;
      this.entrydetail = this.dataentry[0].details;
      this.totaldebe = 0;
      this.totalhaber = 0;
      this.total(this.dataentry);
    }

  }
  //Shows the total debe and haber
  total(e : any){
    for (let i = 0; i < e.length; i++) {
      if(e[i].pk == 40){
        this.totaldebe = this.totaldebe + e[i].amount;
      }else{
        this.totalhaber = this.totalhaber + e[i].amount;
      }
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
        if(this.entries.length > 0){
          this.reportService.getASCPDF(this.slug, this.entries).subscribe(
            res =>{
              if(res != null){
                let temp : any;
                temp = res;
                let base64String =temp.report.toString();
                this.downloadPdf(base64String,"Asientos contables por empresa");
              }
            },err =>{
              this.showmodalError(err.error.message);        
            } 
          )
        }
        else{
          this.showmodalError('No se cuenta con asientos para generar PDF.');
        }
      }else{
      this.showmodalError('No se cuenta con un identificador de compañía valido, refresque la página por favor.');
      } 
    }else{
      this.showmodalError('No cuenta con los permisos necesarios para realizar esta acción.');
    }
  }
}
