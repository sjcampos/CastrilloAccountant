import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
//models
import { company } from '../../../models/company.model';
//services
import { StorageServiceService } from '../../../services/localstorage/storage-service.service';
import { ReportServiceService } from '../../../services/reports/report-service.service';
import { CompanyServiceService } from '../../../services/companies/company-service.service';
import { AccountServiceService } from '../../../services/accounts/account-service.service';
import { threadId } from 'worker_threads';
@Component({
  selector: 'app-vts-view',
  templateUrl: './vts-view.component.html',
  styleUrls: ['./vts-view.component.css']
})
export class VtsViewComponent implements OnInit {

  coll : boolean = false;
  manager : boolean = false;
  companies : any = [];
  selectcompany : company;
  slug : any;
  existingaccounts : any = [];
  idColl : any;
  loadingMessage : string = "Cargando información...";
  
  divreg : boolean = false;
  divloading : boolean = true;
  graf : boolean = false;

  divdata : boolean = false;
  divnodata : boolean = true;
  p : number = 1;
  p2 : number = 1;

  buttonaccounts : boolean = false;
  buttonpdf : boolean = false;

  dateObj1 : any;
  year : any;
  filter1 : boolean = false;
  filter2 : boolean = false;
  divm1 : boolean = false;
  chyear : boolean = false;
  chmonth : boolean = false;
  monthfilter : boolean = false;
  yearfilter : boolean = false;
  filterdate : any;
  divloadingmodal : boolean = true;
  divmodaldata : boolean = false;
  modaltitle : string = "Seleccione la cuenta que representa las ventas: "
  accountId : any;
  accountname : any;
  sales : any = [];
  buttongraf : boolean = false;
  buttonback : boolean = false;
  showyear : boolean = false;

  isYear : boolean = false;
  isMonth : boolean = false;
  public lineChartData: ChartDataSets[] = [
    
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  constructor(private companyService:CompanyServiceService,private storageService : StorageServiceService,private reportService : ReportServiceService,private accountService : AccountServiceService) { }

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
      if(c.slug != this.slug){
        this.slug = c.slug;
        this.cleanFilter();
        this.cleanValues();
        this.getAffectedAccounts();
        this.buttonaccounts = true;
        
        this.existingaccounts = [];
        this.buttongraf = false;
        this.buttonpdf = false;
        this.divnodata = true;
        this.divdata = false;
        this.graf = false;
        this.sales = [];
        this.buttonback = false;
      }
    }
    else{
      this.slug = null;
      this.existingaccounts = [];
      this.buttonaccounts = false;
      this.buttongraf = false;
      this.buttonpdf = false;
      this.divnodata = true;
      this.divdata = false;
      this.graf = false;
      this.sales = [];
      this.cleanFilter();
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
  //Gets the affected accounts of a company
  getAffectedAccounts(){
    let filter = "affected";
    let timeoutId;
    this.accountService.getAccounts(this.slug, filter).subscribe(
      res=>{
        let temp : any = [];
        temp = res;
        for (let i = 0; i < temp.accounts.length; i++) {
          if(temp.accounts[i].classification == "afectable"){
            this.existingaccounts.push(temp.accounts[i]);
          }
        }
        timeoutId = setTimeout(() =>{
          this.divloadingmodal = false;
          this.divmodaldata = true;
        },850)
      }
    )
  }
  //change the filter months or years
  changeFilter(f : any){
    if(f == "month"){
      if(this.chyear){
        this.chmonth = false;
        this.chyear = false;
        this.monthfilter = false;
        this.divm1 = false;
        this.filterdate = null;
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
        this.year = null;
      }
      else{
        this.yearfilter = true;
        this.chmonth = true;
        this.filterdate = null;      
      }
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
  //Adds the selected account
  addAccount(a: any){
    this.divmodaldata = false;
    this.filter1 = true;
    this.modaltitle = "Seleccione el tipo de filtro que desea:"
    this.accountId = a.id_account;
    this.accountname = a.account_name;
  }
  //Cleans filter
  cleanFilter(){
    this.filter1 = false;
    this.filter2 = false;
    this.divm1 = false;
    this.yearfilter = false;
    this.chmonth = false;
    this.chyear = false;
    this.year = null;
    this.dateObj1 = undefined;
    this.divmodaldata = true;
    this.modaltitle ="Seleccione la cuenta que representa las ventas: ";
  }
  //Cleans values
  cleanValues(){
    this.isYear = false;
    this.isMonth = false;
  }
  //Gets the data from the DB
  getVTSdata(slug : any, month : any, year : any, id: any){
    let timeoutId;
    this.reportService.getVTS(slug,month,year,id).subscribe(
      res =>{
        if(res != null){
          let temp : any = [];
          temp  = res;
          this.sales = temp.data;
          if(month == 0){
            this.sales.sort(function (a: { date: number; }, b: { date: number; }) {
              return a.date-b.date
            });
            this.graphMaking("year");
          }else{
            this.graphMaking("month");
          }
          timeoutId = setTimeout(() =>{
            this.divloading = false;
            this.divreg = true;
            this.divnodata = false;
            this.divdata = true;
            this.buttongraf = true;
            this.buttonpdf = true;
          },850)
        }
      },err=>{
        timeoutId = setTimeout(() =>{
          this.divloading = false;
          this.divreg = true;
          this.divnodata = true;
          this.divdata = false;
          this.buttongraf = false;
          this.buttonpdf = false;
          this.showmodalError(err.error.message);
        },850)
      }
    )
  }
  //Checks if the filter if for month or for year
  getVts(){
    if(this.accountId != undefined && this.accountId != null){
      if(this.filterdate != null && this.filterdate != undefined){
        this.divreg = false;
        this.divloading = true;
        this.year = null;
        this.isMonth = true;
        this.isYear = false;
        this.showyear = true;
        this.getVTSdata(this.slug,this.filterdate.month,this.filterdate.year,this.accountId);
      }else{
        if(this.year != null && this.year != undefined){
          this.divreg = false;
          this.divloading = true;
          this.isMonth = false;
          this.isYear = true;
          this.showyear = false;
          this.getVTSdata(this.slug,0,this.year,this.accountId);
        }else{
          this.showmodalError("Debe seleccionar un mes o año válido.");
        }
      }
    }else{
      this.showmodalError("Debe seleccionar la cuenta que representa las ventas.");
      this.cleanFilter();
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
  //Shows the chart
  showgraph(){
    this.graf = true;
    this.divdata = false;
    this.divnodata = false;
    this.buttonback = true;
    this.buttonpdf = false;
    this.buttonaccounts = false;
    this.buttongraf = false;
  }
  //Hides the chart
  showtable(){
    this.graf = false;
    this.divdata = true;
    this.divnodata = false;
    this.buttonback = false;
    this.buttonpdf = true;
    this.buttonaccounts = true;
    this.buttongraf = true;
  }
  //Arrange the data to create the chart
  graphMaking(type: any){
    //{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' } 
    this.lineChartData = [];
    this.lineChartLabels = [];
    let x= {
      data: [],
      label : this.accountname
    }
    let tempdata : any = [];
    if(type == "year" ){
      for (let i = 0; i < this.sales.length; i++) {
        tempdata.push(this.sales[i].amount);
        switch (this.sales[i].date) {
          case "1":
            this.lineChartLabels.push("Enero");
            break;
          case "2":
            this.lineChartLabels.push("Febrero");
            break;
          case "3":
            this.lineChartLabels.push("Marzo");
            break;
          case "4":
            this.lineChartLabels.push("Abril");
            break;
          case "5":
            this.lineChartLabels.push("Mayo");
            break;
          case "6":
            this.lineChartLabels.push("Junio");
            break;
          case "7":
            this.lineChartLabels.push("Julio");
            break;
          case "8":
            this.lineChartLabels.push("Agosto");
            break;
          case "9":
            this.lineChartLabels.push("Septiembre");
            break;
          case "10":
            this.lineChartLabels.push("Octubre");
            break;
          case "11":
            this.lineChartLabels.push("Noviembre");
            break;
          case "12":
            this.lineChartLabels.push("Diciembre");
            break;
          default:
            break;
        }
      }
      x.data = tempdata;
      this.lineChartData.push(x);
    }
    else{
      for (let i = 0; i < this.sales.length; i++) {
        tempdata.push(this.sales[i].amount);
        this.lineChartLabels.push(this.sales[i].date);
      }
      x.data = tempdata;
      this.lineChartData.push(x);
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
        this.reportService.getVTSPDF(this.slug, this.sales).subscribe(
          res =>{
            if(res != null){
              let temp : any;
              temp = res;
              let base64String =temp.report.toString();
              this.downloadPdf(base64String,"Ventas");
            }
          },err =>{
            this.showmodalError(err.error.message);        
          } 
        )
      }else{
      this.showmodalError('No se cuenta con un identificador de compañía válido, refresque la página por favor.');
      }
    }else{
      this.showmodalError('No cuenta con los permisos necesarios para realizar esta acción.');
    }
  }

}
