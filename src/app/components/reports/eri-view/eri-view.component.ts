import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
//models
import { company } from '../../../models/company.model';
//services
import { ReportServiceService } from '../../../services/reports/report-service.service';
import { CompanyServiceService } from '../../../services/companies/company-service.service';
import { StorageServiceService } from '../../../services/localstorage/storage-service.service';


@Component({
  selector: 'app-eri-view',
  templateUrl: './eri-view.component.html',
  styleUrls: ['./eri-view.component.css']
})
export class EriViewComponent implements OnInit {

  coll : boolean = true;
  manager : boolean = false;
  
  p : number = 1;
  dateObj1 : any;
  selecttitle : string = "Seleccione las cuentas de ventas netas"
  chyear : boolean = false;
  chmonth : boolean = false;
  filter1 : boolean = true;
  filter2 : boolean = false;
  divm1 : boolean = false;

  divyear : boolean = false;
  
  monthfilter : boolean = false;
  yearfilter : boolean = false;

  showerror : boolean = false;
  showsuccess : boolean = false;
  errormessage: string = "";

  filterdate : any;
  dates : any = [];
  companies : any = [];
  slug: any;

  buttonreg : boolean = true;
  buttoncan : boolean = true;
  
  divloading : boolean = false;
  divreg : boolean = true;
  divnodata : boolean = true;
 
  f : boolean = true;
  s : boolean = false;
  t : boolean = false;
  fo : boolean = false;
  ganancia: any = [];
  perdida : any = [];
 
  config = {
    format :"YYYY-MM-DD"
  };

  year : number = 2021;
 
  id: any;
 
  selectcompany : company;

  loading : boolean = true;
  showreg : boolean = false;

  type1 : boolean = true;
  type2 : boolean = false;

  record : boolean = false;
  acctype : any;
  
  accounts: any = [];
  net_sales : any = [];
  gross_profit : any = [];
  operating_profit : any = [];
  profit_tax : any = [];
  
  graphbutton : boolean = false;
  reportbutton : boolean = false;

  tax : any;
  taxtInt : boolean = false;
  showtaxerror : boolean = false;
  errortax : string = "";
  showdownload : boolean = false;
  showtaxbutton : boolean = true;
  tempdate : any;
  markedAccounts : any = [];
  buttonfilter : boolean = false;

  constructor(private companyService:CompanyServiceService, private storageService : StorageServiceService, private reportService : ReportServiceService) { }

  ngOnInit(): void {
    let data = this.storageService.readData();
    
    if(!data.permissions.includes("1")){
      //redirect a login
    }
    if(data.permissions.includes("4") && data.permissions.includes("5")){
      this.coll = false;
      this.manager = true;
      this.getCompanies();
    }
    else{
      this.id = data.id;
      this.coll = true;
      this.manager = false;
      this.getCollCompanies(this.id);
    }
  }

  //change the filter months or years
  changeFilter(f : any){
    if(f == "month"){
      if(this.chyear){
        this.chmonth = false;
        this.chyear = false;
        this.monthfilter = false;
        this.divm1 = false;
      }
      else{
        this.monthfilter = true;
        this.divm1 = true;
        this.chyear = true;
      }
    }
    else{
      if(this.chmonth){
        this.chmonth = false;
        this.chyear = false;
        this.yearfilter = false;
      }
      else{
        this.yearfilter = true;
        this.chmonth = true;
      }
    }
  }
  //adds a year
  addYear(){
    if(this.year != null || this.year != undefined){
      if(this.dates.length >= 3){
        this.showerror = true;
        this.errormessage = "Ya agregó la cantidad máxima de años para realizar la comparación."
      }else{
        this.filterdate = {
          'month' : 12,
          'year' : this.year
        }
        this.showerror = false;
        this.errormessage = "";
        this.filterdate = {
          'month' : 12,
          'year' : this.year
        }
      }
    }
    else{
      this.showerror = true;
      this.errormessage = "Debe escoger un año válido."
    }
  }
  //Generates an specific month date
  changeValue(e : any){
    let tempMonth;
    let tempYear;
    if(e != undefined){
      if(e._d.getMonth().toString().trim().length == 1){
        if(e._d.getMonth() == 0){
          tempMonth = 1;
          tempYear = e._d.getFullYear();
        }
        else{
            tempMonth = e._d.getMonth() + 1;
            tempYear = e._d.getFullYear();        
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
  //changes the company
  changeCompany(c : any){
    if(c != undefined){
      if(c.slug != this.slug){
        this.slug = c.slug;
        this.buttonfilter = true;
        this.resetView();
      }
      else{
        this.slug = c.slug;
        this.buttonfilter = true;      
      }
    }
    else{
      this.slug = null;
      this.buttonfilter = false;
      this.resetView();
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
      err => {}
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
  //Cleans the form
  cleanValues(){
    this.tempdate = this.filterdate;
    this.dateObj1 = null;
    this.divm1 = false;
    this.year = 2021;
    this.buttoncan = true;
    this.showerror = false;
    this.errormessage = "";
    this.showsuccess = false;
    this.dates = [];
    this.chyear = false;
    this.chmonth = false;
    this.monthfilter = false;
    this.divyear = false;
    this.yearfilter = false;
    if(this.type1){
      this.type1 = false;
      this.type2 = true;
    }
    else{
      this.type1 = true;
      this.type2 = false;
    }
    if(this.filter1){
      this.filter1 = false;
      this.filter2 = true;
    }
    else{
      this.filter1 = true;
      this.filter2 = false;
    }
  }
  //gets the bgc
  getERI(){
    if(this.selectcompany == undefined){
      this.showerror = true;
      this.errormessage = "Debe seleccionar una compañía."
    }
    else{
      this.showerror = false;
      if(this.filterdate == null || this.filterdate == undefined){
        this.showerror = true;
        this.errormessage = "Debe proporcionar una fecha válida."
      }else{
        this.showerror = false;
          let timeoutId;    
          this.divloading = true;
          this.divreg = false;
          this.reportService.getERI(this.slug, this.filterdate.month, this.filterdate.year).subscribe(
            res=>{
              if(res != null){
                let temp : any = [];
                temp = res;
                this.accounts = temp.message;
                this.divnodata = false;
                timeoutId = setTimeout(() =>{
                  this.divloading = false;
                  this.divreg = true;
                  this.record = true;
                  this.cleanValues();
                },850)
              }
            },err => {
              timeoutId = setTimeout(() =>{
                this.divloading = false;
               Swal.fire({
                title: 'Atención',
                text: err.error.message,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonColor:'#0096d2',
                showCancelButton: false,
                confirmButtonText: 'Aceptar'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.divreg = true;
                  this.record = false;
                  this.divnodata = true;
                  this.graphbutton = false;
                  this.reportbutton = false;
                  this.cleanValues();
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  
                }
              })
              },850)
            }
          )
        
      }
    }
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
      if(this.tempdate != undefined || this.tempdate != null){
        let date = this.tempdate.year.toString()+'/'+this.tempdate.month.toString()+'/01';
        this.reportService.getERIPDF(this.slug, date, this.tax,this.net_sales,this.gross_profit,this.operating_profit,this.profit_tax).subscribe(
          res =>{
            if(res != null){
              let temp : any;
              temp = res;
              let base64String =temp.report.toString();
              this.downloadPdf(base64String,"Estado de resultados integrales");
              this.resetView();
            }
          },err =>{
            Swal.fire({
              title:'Error',
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonColor:'#0096d2',
              text:err.error.message,
              icon :'error'
            })         
          } 
        )
      }else{
        Swal.fire({
          title:'Error',
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonColor:'#0096d2',
          text:'No se cuenta con fechas para generar PDF.',
          icon :'error'
        }) 
      }
    }else{
      Swal.fire({
        title:'Error',
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor:'#0096d2',
        text: 'No cuenta con los permisos necesarios para realizar esta acción.',
        icon :'error'
      }) 
    }
  }
  //Adds accounts to the differents arrays
  async addAccount(a : any){
    if(this.f){
      if(this.net_sales.includes(a)){
        let pos = this.net_sales.indexOf(a);
        let posmarked = this.markedAccounts.indexOf(a);
        if(pos != -1){
          this.net_sales.splice(pos,1);
          this.markedAccounts.splice(posmarked,1);
        }
      }
      else{
        Swal.fire({
          title: 'Seleccione una categoría:',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showDenyButton: true,
          confirmButtonColor:'#0096d2',
          confirmButtonText: `Ganancias`,
          denyButtonText: `Perdidas`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.net_sales.push(a);
            this.markedAccounts.push(a);
          } else if (result.isDenied) {
            if(a.balance < 0){
              this.net_sales.push(a);
            }
            else{
              let temp = a.balance;
              a.balance = -temp;
              this.net_sales.push(a);
            }
            this.markedAccounts.push(a);
          }
        })
      }
      
    }
    else if(this.s){
      if(this.gross_profit.includes(a)){
        let pos = this.gross_profit.indexOf(a);
        let posmarked = this.markedAccounts.indexOf(a);
        if(pos != -1){
          this.gross_profit.splice(pos,1);
          this.markedAccounts.splice(posmarked,1);
        }
      }
      else{
        Swal.fire({
          title: 'Seleccione una categoría:',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showDenyButton: true,
          confirmButtonColor:'#0096d2',
          confirmButtonText: `Ganancias`,
          denyButtonText: `Perdidas`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.gross_profit.push(a);
            this.markedAccounts.push(a);
          } else if (result.isDenied) {
            if(a.balance < 0){
              this.gross_profit.push(a);
            }
            else{
              let temp = a.balance;
              a.balance = -temp;
              this.gross_profit.push(a);
            }
            this.markedAccounts.push(a);
          }
        })
      }

    }
    else if(this.t){
      if(this.operating_profit.includes(a)){
        let pos = this.operating_profit.indexOf(a);
        let posmarked = this.markedAccounts.indexOf(a);
        if(pos != -1){
          this.operating_profit.splice(pos,1);
          this.markedAccounts.splice(posmarked,1);
        }
      }
      else{
        Swal.fire({
          title: 'Seleccione una categoría:',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showDenyButton: true,
          confirmButtonColor:'#0096d2',
          confirmButtonText: `Ganancias`,
          denyButtonText: `Perdidas`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.operating_profit.push(a);
            this.markedAccounts.push(a);
          } else if (result.isDenied) {
            if(a.balance < 0){
              this.operating_profit.push(a);
            }
            else{
              let temp = a.balance;
              a.balance = -temp;
              this.operating_profit.push(a);
            }
            this.markedAccounts.push(a);
          }
        })
      }
    }
    else if(this.fo){
      if(this.profit_tax.includes(a)){
        let pos = this.profit_tax.indexOf(a);
        let posmarked = this.markedAccounts.indexOf(a);
        if(pos != -1){
          this.profit_tax.splice(pos,1);
          this.markedAccounts.splice(posmarked,1);
        }
      }
      else{
        Swal.fire({
          title: 'Seleccione una categoría:',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showDenyButton: true,
          confirmButtonColor:'#0096d2',
          confirmButtonText: `Ganancias`,
          denyButtonText: `Perdidas`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.profit_tax.push(a);
            this.markedAccounts.push(a);
          } else if (result.isDenied) {
            if(a.balance < 0){
              this.profit_tax.push(a);
              
            }
            else{
              let temp = a.balance;
              a.balance = -temp;
              this.profit_tax.push(a);
            }
            this.markedAccounts.push(a);
          }
        })
      }
    }
    else{
      
    }    
  }
  //Pass to the next types of accounts
  nextAccount(){
    if(this.f){
      if(this.net_sales.length > 0){
        this.f = false;
        this.s = true;
        this.selecttitle = "Seleccione las cuentas de utilidad bruta."
        this.getERI();
        this.markedAccounts = [];
      }
      else{
        Swal.fire(
          'Cancelado',
          'Primero necesita agregar cuentas de ventas netas.',
          'error'
        )
      }
    }
    else if(this.s){
      if(this.gross_profit.length > 0){
        this.s = false;
        this.t = true;
        this.selecttitle = "Seleccione las cuentas de utilidad operativa."
        this.getERI();
        this.markedAccounts = [];
      }
      else{
        Swal.fire(
          'Cancelado',
          'Primero necesita agregar cuentas de utilidad operativa.',
          'error'
        )
      }
      
    }
    else if(this.t){
      if(this.operating_profit.length > 0){
        this.t= false;
        this.fo = true;
        this.selecttitle = "Seleccione las cuentas antes de impuesto."
        this.getERI();
        this.markedAccounts = [];
      }
      else{
        Swal.fire(
          'Cancelado',
          'Primero necesita agregar cuentas antes de impuesto.',
          'error'
        )
      }
    }
    else if(this.fo){
      if(this.profit_tax.length > 0){
        this.fo = false;
        this.record = false;
        this.taxtInt = true;
      }
      else{
        Swal.fire(
          'Cancelado',
          'Primero necesita agregar cuentas antes de impuesto.',
          'error'
        )
      }

    }
    else{
     
    }

  }
  //Enable download
  downloadA(){
    if(this.tax == undefined || this.tax == null || this.tax == 0){
      Swal.fire(
        'Error',
        'Debe ingresar un porcentaje valido.',
        'error')
    }else{
      this.showdownload = true;
      this.showtaxbutton = false;
    }
    
  }
  //Resets the view after the download
  resetView(){
    this.markedAccounts = [];
    this.tempdate = null;
    this.dateObj1 = null;
    this.divm1 = false;
    this.year = 2021;
    this.buttoncan = true;
    this.showerror = false;
    this.errormessage = "";
    this.showsuccess = false;
    this.dates = [];
    this.chyear = false;
    this.chmonth = false;
    this.monthfilter = false;
    this.divyear = false;
    this.yearfilter = false;
    if(this.type1){
      this.type1 = false;
      this.type2 = true;
    }
    else{
      this.type1 = true;
      this.type2 = false;
    }
    if(this.filter1){
      this.filter1 = false;
      this.filter2 = true;
    }
    else{
      this.filter1 = true;
      this.filter2 = false;
    }
    this.accounts = [];
    this.showtaxbutton = true;
    this.showdownload = false;
    this.record = false;
    this.taxtInt = false;
    this.net_sales = [];
    this.gross_profit = [];
    this.operating_profit = [];
    this.profit_tax = [];
    this.tax = 0;
    this.f = true;
    this.s = false;
    this.t = false;
    this.fo = false;
    this.selecttitle = "Seleccione las cuentas de ventas netas";
    this.divnodata = true;
  }

}
