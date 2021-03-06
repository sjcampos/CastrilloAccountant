import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
//models
import { company } from '../../../models/company.model';
//services
import { ReportServiceService } from '../../../services/reports/report-service.service';
import { CompanyServiceService } from '../../../services/companies/company-service.service';
import { StorageServiceService } from '../../../services/localstorage/storage-service.service';
import { AccountServiceService } from '../../../services/accounts/account-service.service';

@Component({
  selector: 'app-bxc-view',
  templateUrl: './bxc-view.component.html',
  styleUrls: ['./bxc-view.component.css']
})
export class BxcViewComponent implements OnInit {
  coll : boolean = false;
  manager : boolean = false;
  p : number = 1;
  p2 : number = 1;
  dateObj1 : any;

  chyear : boolean = false;
  chmonth : boolean = false;
  filter1 : boolean = true;
  filter2 : boolean = false;


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
  divnodata : boolean = true;
  tax : any;
  taxtInt : boolean = false;
  showtaxerror : boolean = false;
  errortax : string = "";
  showdownload : boolean = false;
  showtaxbutton : boolean = true;
  tempdate : any;
  existingaccounts : any = [];
  entries : any = [];
  accountname : any;
  limitdateshow : any;
  accountid : any;
  limitdate : any;
  buttonback : boolean = false;
  buttonaccounts : boolean = true;

  constructor(private companyService:CompanyServiceService,private storageService : StorageServiceService,private reportService : ReportServiceService,private accountService : AccountServiceService) { }

  ngOnInit(): void {
    let data = this.storageService.readData();
    if(data.permissions.includes("4") && data.permissions.includes("5")){
      this.coll = false;
      this.manager = true;
    }
    else{
      this.coll = true;
      this.manager = false;
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

  //gets the accounts with the actual balance
  getAccounts(){
    if(this.slug == null || this.slug == undefined){
      Swal.fire({
        title:'Error',
        text:'Debe escoger una compa????a.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor:'#0096d2',
        icon:'error'})
    }
    else{
      this.accountService.getAccounts(this.slug, "affected").subscribe(
        res=>{
          let temp : any = [];
          temp = res;
          this.existingaccounts = [];
          if(temp.accounts.length > 0){
            for (let i = 0; i < temp.accounts.length; i++) {
              if(temp.accounts[i].classification == "afectable"){
                this.existingaccounts.push(temp.accounts[i]);
              }
            }
            this.divnodata = false;
            this.record = true;
          }else{
            this.divnodata = true;
            this.record = false;
            Swal.fire({
              title:'Error',
              text:'La empresa seleccionada no tiene cuentas afectables registradas.',
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonColor:'#0096d2',
              icon:'error'})

          }
        },err =>{
          this.divnodata = true;
          this.record = false;
          Swal.fire({
            title:'Error',
            text:err.error.message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor:'#0096d2',
            icon:'error'})
        }
      );
    }
  }
  //changes the company
  changeCompany(c : any){
    if(c != undefined){
      if(c.slug != this.slug){
        this.slug = c.slug;
        this.divnodata = true;
        this.record = false;
        this.taxtInt = false;
        this.existingaccounts = [];
        this.buttonback = false;
        this.buttonaccounts = true;
        this.cleanValues();
      }else{
        this.slug = c.slug;
      }
    }
    else{
      this.slug = null;
      this.buttonaccounts = true;
      this.divnodata = true;
      this.record = false;
      this.taxtInt = false;
      this.buttonback = false;
      this.cleanValues();
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
      err => {
        
      }
    )
  }
  //Cleans the form
  cleanValues(){
    this.tempdate = this.filterdate;

    this.buttoncan = true;
    this.showerror = false;
    this.errormessage = "";
    this.showsuccess = false;
    this.dates = [];
    this.chyear = false;
    this.chmonth = false;
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
        
        this.reportService.getBXCPDF(this.slug, this.entries).subscribe(
          res =>{
            if(res != null){
              let temp : any;
              temp = res;
              let base64String =temp.report.toString();
              this.downloadPdf(base64String,"Movimientos por cuenta");
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
        text:'No se cuenta con un identificador de compa????a valido, refresque la p??gina por favor.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor:'#0096d2',
        icon:'error'})
      }
    }else{
      Swal.fire({
        title:'Error',
        text:'No cuenta con los permisos necesarios para realizar esta acci??n.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor:'#0096d2',
        icon:'error'})
    }
  }
  //Pass the id for the filter
  selectedAccount(a: any){
    this.accountid = a.id_account;
    this.accountname = a.account_name;
  } 
  //Gets all the entries
  getBXC(){
    let date;
    if(this.limitdate == undefined){
      this.showerror = true;
      this.errormessage = "Debe seleccionar una fecha valida."
    }
    else{
      date = this.limitdate.value;
      this.limitdateshow = date;
      if(this.selectcompany != undefined){
        this.showerror = false;
        let timeoutId;
        this.divloading = true;
        this.divreg = false; 
        this.reportService.getBXCM(this.slug,this.accountid,date).subscribe(
          res=>{
            if(res != null){
              let temp : any = [];
              temp = res;
              if(temp.Seals.length > 0){
                this.entries = temp.Seals;
                timeoutId = setTimeout(() =>{
                  this.divnodata = false;
                  this.divloading = false;
                  this.divreg = true;
                  this.record = false;
                  this.taxtInt = true;
                  this.buttonaccounts = false;
                  this.buttonback = true;
                  this.cleanValues();
                },850)
              }else{
                timeoutId = setTimeout(() =>{
                  this.divnodata = false;
                  this.divloading = false;
                  this.divreg = true;
                  this.taxtInt = false;
                  Swal.fire({
                    title:'Atenci??n',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonColor:'#0096d2',
                    text:'No existen movimientos en la cuenta solicitada.',
                    icon :'warning'
                  })
                },850)
              }
            }
          },err => {
            timeoutId = setTimeout(() =>{
              this.divloading = false;
              Swal.fire({
              title: 'Atenci??n',
              text: err.error.message, 
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonColor:'#0096d2',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Aceptar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.divreg = true;
                this.record = false;
                this.buttonaccounts = true;
                this.buttonback = false;
                this.divnodata = true;
                this.cleanValues();
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                
              }
            })
            },850)
          }
        )
      }
      else{
        this.showerror = true;
        this.errormessage = "Debe seleccionar una compa????a."
      }
    }
  }
  //Updates the state of the buttons
  backToAccounts(){
    this.taxtInt = false;
    this.record = true;
    this.entries = [];
    this.buttonaccounts = true;
    this.buttonback = false;
  }
 
}
