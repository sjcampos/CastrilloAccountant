import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
//models
import { company } from '../../../models/company.model';
//services
import { ReportServiceService } from '../../../services/reports/report-service.service';
import { CompanyServiceService } from '../../../services/companies/company-service.service';
import { StorageServiceService } from '../../../services/localstorage/storage-service.service';
import { AccountServiceService } from '../../../services/accounts/account-service.service';


@Component({
  selector: 'app-proy-view',
  templateUrl: './proy-view.component.html',
  styleUrls: ['./proy-view.component.css']
})
export class ProyViewComponent implements OnInit {
  coll : boolean = true;
  manager : boolean = false;

  companies : any = [];
  id : any;
  slug : any;
  accounts: any = [];
  selectcompany : company;
  p : number = 1;
  p2 : number = 1;
  divnodata : boolean = true;
  record : boolean = false;
  markedAccounts : any = [];

  divreg : boolean = false;
  divloading : boolean = true;

  datefilter : boolean = false;
  chmonth : boolean = false;
  chyear : boolean = false;

  idaccount : any;
  filter : any;

  buttonAc : boolean = false;
  buttondownload : boolean = false;


  filter1 : boolean = true;
  filter2 : boolean = false;

  tableproy : boolean = false;
  graphproy : boolean = false;

  proyections : any = [];

  barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  barChartType: ChartType = 'bar';
  barChartLegend = true;


  barChartLabel : Label[] = [];
  barChartData : ChartDataSets[]= [];
  constructor(private companyService:CompanyServiceService, private storageService : StorageServiceService, private reportService : ReportServiceService,private accountService : AccountServiceService) { }

  ngOnInit(): void {
    let data = this.storageService.readData();
    let timeoutId;
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
    timeoutId = setTimeout(() =>{
      this.divloading = false;
      this.divreg = true;
    },850)
  }

  //changes the company
  changeCompany(c : any){
    if(c != undefined){
      if(c.slug == this.slug){
        this.slug = c.slug;
        this.buttonAc = true;
      }else{
        this.slug = c.slug;
        this.resetView();
        this.buttonAc = true;
        this.buttondownload = false;
      }
    }
    else{
      this.slug = null;
      this.buttonAc = false;
      this.buttondownload = false;
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
      err => console.log(err)
    )
  }
  //Gets the companys of a collaborator
  getCollCompanies(id : any){
    this.companyService.getCollabCompanies(id).subscribe(
      res=>{
        let comp: any = [];
        comp = res;
        this.companies = comp.data;
        
      },
      err => console.log(err)
    )
  }
  //Gets the accounts of a company
  getAccounts(){
    if(this.slug != undefined && this.slug != null){
      let timeoutId;
      let filter = "affected";
      this.divreg = false;
      this.divloading = true;
      this.accountService.getAccounts(this.slug, filter).subscribe(
        res=>{
          let temp : any = [];
          temp = res;
          if(temp.accounts.length > 0){
            for (let i = 0; i < temp.accounts.length; i++) {
              if(temp.accounts[i].classification == "afectable"){
                this.accounts.push(temp.accounts[i]);
              }
            }
            this.record = true;
            this.divnodata = false;
            timeoutId = setTimeout(() =>{
              this.divloading = false;
              this.divreg = true;
            },850)
          }else{
            this.divloading = false;
            this.divreg = true;
            this.record = false;
            this.divnodata = true;
            this.showmodalError("Esta empresa no tiene cuentas registradas.");
          }
        },err =>{
          this.divloading = false;
          this.divreg = true;
          this.record = false;
          this.divnodata = true;
          this.showmodalError(err.error.message);
        }
      );
    }else{
      this.showmodalError("Debe seleccionar una compañía.");
    }
  }
  //Gets the account id
  addAccount(a : any){
    this.idaccount = a.id_account;
    this.record = false;
    this.datefilter = true;
  }
  //Changes the filter
  changeFilter(f : any){
    if(f == "month"){
      if(this.chyear){
        this.chyear = false;
        this.filter = null;
      }
      else{
        this.chyear = true;
        this.filter = "month";
      }
    }else{
      if(this.chmonth){
        this.chmonth = false;
        this.filter = null;
      }else{
        this.chmonth = true;
        this.filter = "year";
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
  //The report request process begins
  getProy(){
    if(this.slug != null && this.slug != undefined){
      if(this.filter != null && this.filter != undefined){
        this.divreg = false;
        this.divloading = true;
        if(this.filter == "month"){
          this.getProyMonth();
        }
        else{
          this.getProyYear();
        }
      }else{
        this.showmodalError("Debe seleccionar un tipo.");
      }
    }else{
      this.showmodalError("Debe seleccionar una compañía");
    }
  }
  //Bring the projection per month
  getProyMonth(){
    let timeoutId;
    let accounts : any = [];
    accounts.push(this.idaccount);
    this.reportService.getPROYMONTH(this.slug,accounts).subscribe(
      res =>{
        if(res != null){
          let temp : any = [];
          temp = res;
          if(temp.data != undefined){
            this.proyections = temp.data;
            this.createGraph(this.proyections[0]);
            this.datefilter = false;
            this.buttonAc = false;
            timeoutId = setTimeout(() =>{
              this.divloading = false;
              this.divreg = true;
              this.graphproy = true;
              this.buttondownload = true;
            },850)
            
          }else{
            this.divnodata = true;
            this.record = false;
            this.divloading = false;
            this.divreg = true;
            this.resetView();
            this.showmodalError("No se cuenta con la cantidad mínima de meses de registros para generar la proyección.");
          }
        }
      },err =>{
        this.showmodalError(err.error.message);
      }
    )
  }
  //Bring the projection per year
  getProyYear(){
    let timeoutId;
    let accounts : any = [];
    accounts.push(this.idaccount);
    this.reportService.getPROYYEAR(this.slug,accounts).subscribe(
      res =>{
        if(res != null){
          let temp : any = [];
          temp = res;
          if(temp.data != undefined){
            this.proyections = temp.data;
            this.createGraph(this.proyections[0]);
            this.datefilter = false;
            this.buttonAc = false;
            timeoutId = setTimeout(() =>{
              this.divloading = false;
              this.divreg = true;
              this.graphproy = true;
              this.buttondownload = true;
            },850)
            
          }else{
            this.divnodata = true;
            this.record = false;
            this.divloading = false;
            this.divreg = true;
            this.resetView();
            this.showmodalError("No se cuenta con la cantidad mínima de 2 años de registros para generar la proyección.");
          }
        }
      },err =>{
        this.showmodalError(err.error.message);
      }
    )
  }
  //Creates the graph
  createGraph(l : any){
    let x= {
      data: [],
      label : "" 
    }
    let y= {
      data: [],
      label : "" 
    }
    let tempdata : any = [];
    let tempdatay : any = [];
    let templabel: string = "";
    for (let i = 0; i < l.length; i++) {
      let label;
      label = l[i].year+"-"+l[i].month;
      this.barChartLabel.push(label);
      tempdata.push(l[i].amount);
      tempdatay.push(l[i].variation);
      templabel = l[i].account_name;
    }
    x.data = tempdata;
    x.label = templabel;
    y.label = "Variación mes anterior"
    y.data = tempdatay;
    this.barChartData.push(x);
    this.barChartData.push(y);
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
    if(this.slug != null || this.slug != undefined){
      this.reportService.getPROYPDF(this.slug,this.proyections).subscribe(
        res =>{
          if(res != null){
            let temp : any;
            temp = res;
            let base64String =temp.report.toString();
            this.downloadPdf(base64String,"Proyección");
          }
        },err =>{
          console.log(err);
          this.showmodalError(err.error.message);        
        } 
      )
    }else{
    this.showmodalError('No se cuenta con un identificador de compañía valido, refresque la página por favor.');
    }
  }
  //Resets the view
  resetView(){
    this.accounts = [];
    this.proyections = [];
    this.filter = null;
    this.idaccount = null;
    this.record = false;
    this.chmonth = false;
    this.chyear = false;
    this.divnodata = true;
    this.datefilter = false;
    this.graphproy = false;
    this.barChartData = [];
    this.barChartLabel = [];
    if(this.filter1){
      this.filter1 = false;
      this.filter2 = true;
    }else{
      this.filter1 = true;
      this.filter2 = false;
    }
  }

}
