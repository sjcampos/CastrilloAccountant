import { Component,  OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
//services
import { AutoreportsServiceService } from '../../services/manager-report/autoreports-service.service';
import { ClientreportServiceService } from '../../services/client-report/clientreport-service.service';
import { AccountServiceService } from '../../services/accounts/account-service.service';

@Component({
  selector: 'app-manager-generatereports',
  templateUrl: './manager-generatereports.component.html',
  styleUrls: ['./manager-generatereports.component.css']
})
export class ManagerGeneratereportsComponent implements OnInit {

  loading : boolean = true;
  showf : boolean = false;

  slug : string = "";

  month : any;
  year : any;
  description : string = "";

  pdf:  any;
  source: any;
  
  id_application : any;

  loadingmessage : string = "Cargando información..."

  existingaccounts : any = [];

  accounts : any = [];

  noFE : boolean = true;
  FE : boolean = false;
  showPDF: boolean = true;
  p : number = 1;
  sendFE : boolean = false;

  NoPP: boolean = true;
  PP : boolean = false;

  NoEF : boolean = true;
  EF : boolean = false;

  divnodata : boolean = false;

  constructor(private router: Router, private activedRoute: ActivatedRoute, private autoreportService : AutoreportsServiceService,private dom:DomSanitizer,
    private clientReportService : ClientreportServiceService, private accountService : AccountServiceService) { }

  ngOnInit(): void {
    let timeoutId;
    const params = this.activedRoute.snapshot.params;
    if(params.slug && params.description && params.date_application && params.id_application){
      this.description = params.description;
      this.id_application = params.id_application;
      let date = params.date_application
      this.slug =  params.slug;
      this.validateReportType(this.description,date);
      timeoutId = setTimeout(() =>{
        this.loading = false;
        this.showf = true;
      },850)
    }
    else{
      this.router.navigate(['/managerdashboard']);
    }
  }
  //Cancels the report
  async cancelReport(){
    await Swal.fire({
      title: 'Cancelar solicitud de reporte',
      text: 'Al cancelar esta solicitud de reporte no podra volver a acceder a ella y debera ponerse en contacto con el solicitante.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Cancelar',
      cancelButtonText: 'Cerrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientReportService.updateState(Number.parseInt(this.id_application),"Cancelado").subscribe(
          res =>{
            if(res != null){
              this.closeWindow();
            }
            else{
              Swal.fire(
              'Error',
              'La solicitud no se pudo cancelar de manera exitosa.',
              'error')
            }         
          },err => {
            Swal.fire(
              'Error',
               err,
              'error'
            )
          }
        ) 
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'La solicitud no se canceló de manera exitosa.',
          'error'
        )
      }
    })

  }
  //Close the form
  closeWindow(){
     Swal.fire({
      title: 'Solicitud procesada',
      text: 'La solicitud se procesó de manera exitosa.',
      icon: 'success',
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor:'#0096d2',
      confirmButtonText: 'Cerrar',
      
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/managerdashboard']);
      
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'La solicitud no se canceló de manera exitosa.',
          'error'
        )
      }
    })
  }
  //Sends the report
  sendReport(status : string){
    let timeoutId;
    if(this.pdf != null && this.pdf != undefined){
      this.loading = true;
      this.loadingmessage = "Enviando reporte..."
      this.showf = false;
      this.autoreportService.sendPDF(this.slug, this.pdf,this.description).subscribe(
        res =>{
          if(res != null){
            this.updateApplicationState(status);
            timeoutId = setTimeout(() =>{
              this.loading = false;
              this.loadingmessage = "";
              this.showf = true;
              this.closeWindow();
            },900);
          }
        },err =>{
          Swal.fire(
            'Error',
            'No se puede enviar el reporte.',
            'error')
            this.loading = false;
            this.loadingmessage = "";
            this.showf = true;
          
        } 
      )
    }
    else{
      Swal.fire(
        'Error',
        'No se puede enviar el reporte sin un archivo.',
        'error')
    }
  }
  //Updates the state of the application
  updateApplicationState(status_application : string){
    this.clientReportService.updateState(Number.parseInt(this.id_application), status_application).subscribe(
      res =>{
        if(res != null){
          
        }
        
      },err => {
        console.log(err);
      }
    ) 
  }
  //Validates the type of report
  validateReportType(d : string, f : any){
    console.log(f);
    let tempdate = new Date(f);
    console.log(tempdate);
    switch (d) {
      case "Balance general Mes actual":
        this.month = tempdate.getMonth()+1;
        this.year = tempdate.getFullYear();
        this.getGeneralBalance(this.month,this.year);
        //año  y mes
        break;
      case "Balance general por año":
        this.month = tempdate.getMonth()+1;
        this.year = tempdate.getFullYear();
        this.getGeneralBalance(this.month,this.year);
        break;
      case "Balance general mes específico":
        this.month = tempdate.getMonth()+1;
        this.year = tempdate.getFullYear();
        console.log(this.month);
        this.getGeneralBalance(this.month,this.year);
        //año  y mes
        break;
      case "Ganancias y perdidas por mes":
        this.month = tempdate.getMonth()+1;
        this.year = tempdate.getFullYear();
        this.getPYG(this.month,this.year);
        break;
      case "Flujo de efectivo por cuenta":
        this.FE = true;
        this.noFE = false;
        this.divnodata = true;
        this.month = tempdate.getMonth()+1;
        this.year = tempdate.getFullYear();
        this.showPDF = false;
        this.getAccounts(this.slug);
        break;
      case "Estado financiero":
        this.FE = true;
        this.noFE = false;
        this.NoEF = false;
        this.EF = true;
        this.divnodata = true;
        this.month = tempdate.getMonth()+1;
        this.year = tempdate.getFullYear();
        this.showPDF = false;
        this.getAccounts(this.slug);
        break;
      default:
        this.PP = true;
        this.NoPP = false;
        break;
    }

  }
  //Generates the PDF file
  generatePDF(pdf : any){
    this.source = `data:application/pdf;base64,${pdf}`;
    let data = 'data:application/pdf;base64,' + pdf;
    this.source = this.dom.bypassSecurityTrustResourceUrl(data);
  }
  //Gets the general balance
  getGeneralBalance(month : any, year : any){
      this.autoreportService.getBG(this.slug,year,month).subscribe(
        res =>{
          if(res!= null){
            let temp : any = [];
            temp = res;
            this.pdf=temp.report;
            this.generatePDF(this.pdf);
          }
        },err => {
        this.showPDF = false;
        Swal.fire({
          title: 'Error',
          confirmButtonText: `Aceptar`,
          confirmButtonColor:'#0096d2',
         text: err.error.message
        }).then((result) => {
          if (result.isConfirmed) {
            
          } 
        })
      }
      )
  }
  //Gets the perdidas y ganancias
  getPYG(month : any, year : any){
    this.autoreportService.getPYG(this.slug,year,month).subscribe(
      res=>{
        if(res != null){
          let temp : any = [];
          temp = res;
          this.pdf=temp.report;
          this.generatePDF(this.pdf);
        }
      },err => {
        this.showPDF = false;
        Swal.fire({
          title: 'Error',
          confirmButtonText: `Aceptar`,
          confirmButtonColor:'#0096d2',
         text: err.error.message
        }).then((result) => {
          if (result.isConfirmed) {
            
          } 
        })
      }
    )
  }
  //Gets the Flujo de efectivo report
  getFE(){
    this.autoreportService.getFE(this.slug,this.year,this.month,this.accounts).subscribe(
      res => {
        if(res != null){
          let temp : any = [];
          temp = res;
          this.pdf=temp.report;
          this.generatePDF(this.pdf);
          this.cleanList();
          this.divnodata = false;
          this.showPDF = true;
          this.sendFE = true;
        }
      }
    )
  }
  //Gets the estado financiero report
  getEF(){
    this.autoreportService.getEF(this.slug,this.accounts).subscribe(
      res =>{
        let temp : any = [];
        temp = res;
        this.pdf = temp.report;
        this.generatePDF(this.pdf);
        this.cleanList();
        this.divnodata = false;
        this.showPDF = true;
        this.sendFE = true;
      }
    )
  }
  //cleans the account list
  cleanList(){
    this.accounts = [];
  }
  //Adds accounts for the flujo de efectivo report
  addAccount(id : number){
    
    if(this.accounts.includes(id)){
      let pos = this.accounts.indexOf(id);
      if(pos !== -1){
        this.accounts.splice(pos,1);
      }
    }
    else{
      this.accounts.push(id);
    }
  }
  //Get all the accounts
  getAccounts(slug: string){
    let filter = "affected";
    this.accountService.getAccounts(slug,filter).subscribe(
      res=>{
        let temp : any = [];
        temp = res;
        this.existingaccounts = temp.accounts;  
      },err =>{
        this.showPDF = false;
        Swal.fire({
          title: 'Error',
          confirmButtonText: `Aceptar`,
          confirmButtonColor:'#0096d2',
         text: err.error.message
        }).then((result) => {
          if (result.isConfirmed) {
            
          } 
        })
      }
    );  
  }
  //Gets the PDF and converts to base64
  onFileChange(f : any){
    let file = f.files[0];
    var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
    if(ext == 'pdf'){
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let ff = reader.result?.toString();
        let b64 = ff?.split(",")[1];
        this.pdf = b64;
      }
    }
    else{
      Swal.fire(
        'Error',
        'No se pueden cargar archivos que no sean formato PDF.',
        'error')
    }
  }

  }

  

