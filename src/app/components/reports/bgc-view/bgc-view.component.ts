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


@Component({
  selector: 'app-bgc-view',
  templateUrl: './bgc-view.component.html',
  styleUrls: ['./bgc-view.component.css']
})
export class BGCViewComponent implements OnInit {
  
  coll : boolean = false;
  manager : boolean = false;
  divnodata : boolean = true;
  dateObj1 : any;
  dateObj2 : any;
  dateObj3 : any;
  chyear : boolean = false;
  chmonth : boolean = false;
  filter1 : boolean = true;
  filter2 : boolean = false;
  divm1 : boolean = false;
  divm2 : boolean = false;
  divm3 : boolean = false;
  divyear : boolean = false;
  buttondownload : boolean = true;

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
  buttonclose : boolean = false;
  divloading : boolean = false;
  divreg : boolean = true;
 
 
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
  graf : boolean = false;
  pdfdates : any = [];
  ap : any = [];
  ac : any = [];
  pc : any = [];
  anc : any = [];
  pnc : any = [];
  oa : any = [];
  op : any = [];
  opat : any = []
  
  graphbutton : boolean = false;
  reportbutton : boolean = false;

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


  barChartCapital : Label[] = [];
  barChartCapitalData : ChartDataSets[]= [];
  barChartac : Label[] = [];
  barChartacData : ChartDataSets[]= [];
  barChartpc : Label[] = [];
  barChartpcData : ChartDataSets[]= [];
  barChartanc : Label[] = [];
  barChartancData : ChartDataSets[]= [];
  barChartpnc : Label[] = [];
  barChartpncData : ChartDataSets[]= [];
  barChartoa : Label[] = [];
  barChartoaData : ChartDataSets[]= [];
  barChartop : Label[] = [];
  barChartopData : ChartDataSets[]= [];
  barChartopat : Label[] = [];
  barChartopatData : ChartDataSets[]= [];
  constructor( private companyService:CompanyServiceService, private storageService : StorageServiceService, private reportService : ReportServiceService) { }

  ngOnInit(): void {
    let data = this.storageService.readData();
    if(data.permissions.includes("1")){
      this.buttondownload = true;
    }else{
      this.buttondownload = false;
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
  //adds a month
  addMonth(){
    if(this.filterdate == undefined){
      this.showerror = true;
      this.errormessage = "Debe escoger un mes valido."
    }
    else{
      this.showerror = false;
      this.errormessage = "";
      if(this.filterdate != null){
        if(this.dates.length == 3){
          this.showerror = true;
          this.errormessage = "Ya agregó la cantidad máxima de meses para realizar la comparación."
        }
        else{
          this.dates.push(this.filterdate);
          this.nextMonth();
        }
      }
    }
  }
  //changes the month div
  nextMonth(){
    if(this.divm1){
      this.divm1 = false;
      this.divm2 = true;
      this.divm3 = false;
    }
    else if(this.divm2){
      this.divm1 = false;
      this.divm2 = false;
      this.divm3 = true;
    }
    else{
      this.divm1 = false;
      this.divm2 = false;
      this.divm3 = true;
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
        this.year = 2021
        this.dates.push(this.filterdate);
      }
    }
    else{
      this.showerror = true;
      this.errormessage = "Debe escoger un año valido."
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
      this.slug = c.slug;
    }
    else{
      this.slug = null;
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
  //Cleans the form
  cleanValues(){
    this.dateObj1 = null;
    this.dateObj2 = null;
    this.dateObj3 = null;
    this.year = 2021;
    this.divloading = false;
    this.buttonreg = true;
    this.buttoncan = true;
    this.buttonclose = false;
    this.showerror = false;
    this.errormessage = "";
    this.showsuccess = false;
    this.divreg = true;
    this.filterdate = null;
    this.dates = [];
    this.chyear = false;
    this.chmonth = false;
    this.monthfilter = false;
    this.divm1 = false;
    this.divm2 = false;
    this.divm3 = false;
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
  getBGC(){
    if(this.selectcompany == undefined){
      this.showerror = true;
      this.errormessage = "Debe seleccionar una compañía."
    }
    else{
      this.showerror = false;
      if(this.dates.length <= 0 || this.dates.length == 1){
        this.showerror = true;
        this.errormessage = "Debe proporcionar los meses o años a comparar."
      }else{
        this.showerror = false;
        if(this.dates.length > 3){
          this.showerror = true;
          this.errormessage = "No puede comparar más de 3 meses o años."
        }
        else{
          let timeoutId;    
          this.divloading = true;
          this.divreg = false;
          this.record = true;
          this.graf = false;
          this.reportService.getBGC(this.slug, this.dates).subscribe(
            res=>{
              if(res != null){
                this.cleanLists()
                let temp : any = [];
                temp = res;
                this.pdfdates = this.dates;
                this.fixingData(temp.data);
                timeoutId = setTimeout(() =>{
                  this.divloading = false;
                  this.graphbutton = true;
                  this.reportbutton = false;
                  this.divreg = true;
                  this.divnodata = false;
                  this.generateArrayGraph();
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
                showCancelButton: false,
                confirmButtonText: 'Aceptar'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.divreg = true;
                  this.record = false;
                  this.divnodata = true;
                  this.graf = false;
                  this.graphbutton = false;
                  this.reportbutton = false;
                  this.cleanLists();
                  this.cleanValues();
                  
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  Swal.fire(
                    'Cancelado',
                    'El registro del colaborador no ha sido eliminado.',
                    'error'
                  )
                }
              })
              },850)
            }
          )
        }
      }
    }
  }
  //Fix the data
  fixingData(data : any){
    this.ap = data.accountant_patrimony;
    this.ac = data.current_actives;
    this.pc = data.current_pasives;
    this.anc = data.no_current_actives;
    this.pnc = data.no_current_pasives;
    this.oa = data.others_actives;
    this.op = data.others_pasives;
    this.opat = data.others_patrimony;
    this.record = true;
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
    console.log(this.pdfdates);
    if(this.pdfdates.length != 0 && this.pdfdates.length <= 3){
      this.reportService.getBGCPDF(this.slug, this.pdfdates).subscribe(
        res =>{
          if(res != null){
            let temp : any;
            temp = res;
            let base64String =temp.report.toString();
            this.downloadPdf(base64String,"Balance general comparativo");
          }
        },err => console.log(err)
      )
    }else{
    Swal.fire(
      'Error',
      'No se cuenta con fechas para generar PDF.',
      'error')
    }
  }
  //generates the graphics
  generateArrayGraph(){  
    //capital
    for (let i = 0; i < this.ap.length; i++) {
      if(i == 0){
        this.barChartCapital.push(this.ap[i][1]);
        this.barChartCapital.push(this.ap[i][2]);
        if(this.ap[i][4] != undefined){
          this.barChartCapital.push(this.ap[i][4]); 
        }
         
      }
      else{
        let x= {
          data: [],
          label : this.ap[i][0]
        }
        let tempdata : any = [];
        if(this.ap[i][1] == "ND"){
          tempdata.push(0);
        }
        else{
          tempdata.push(this.ap[i][1]);
        }
        if(this.ap[i][2]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.ap[i][2]);
        }
        if(this.ap[i][4]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.ap[i][4]);
        }
        x.data = tempdata;
        this.barChartCapitalData.push(x);
      }
    }
    //activos corrientes
    for (let o = 0; o < this.ac.length; o++) {
      if(o == 0){
        this.barChartac.push(this.ac[o][1]);
        this.barChartac.push(this.ac[o][2]);
        if(this.ac[o][4] != undefined){
          this.barChartac.push(this.ac[o][4]); 
        }
         
      }
      else{
        let x= {
          data: [],
          label : this.ac[o][0]
        }
        let tempdata : any = [];
        if(this.ac[o][1] == "ND"){
          tempdata.push(0);
        }
        else{
          tempdata.push(this.ac[o][1]);
        }
        if(this.ac[o][2]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.ac[o][2]);
        }
        if(this.ac[o][4]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.ac[o][4]);
        }
        x.data = tempdata;
        this.barChartacData.push(x);
      }
    }
    //pasivos corrientes
    for (let i = 0; i < this.pc.length; i++) {
      if(i == 0){
        this.barChartpc.push(this.pc[i][1]);
        this.barChartpc.push(this.pc[i][2]);
        if(this.pc[i][4] != undefined){
          this.barChartpc.push(this.pc[i][4]); 
        }   
      }
      else{
        let x= {
          data: [],
          label : this.pc[i][0]
        }
        let tempdata : any = [];
        if(this.pc[i][1] == "ND"){
          tempdata.push(0);
        }
        else{
          tempdata.push(this.pc[i][1]);
        }
        if(this.pc[i][2]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.pc[i][2]);
        }
        if(this.pc[i][4]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.pc[i][4]);
        }
        x.data = tempdata;
        console.log(tempdata);
        this.barChartpcData.push(x);
      }
    }
    //activos no corrientes
    for (let i = 0; i < this.anc.length; i++) {
      if(i == 0){
        this.barChartanc.push(this.anc[i][1]);
        this.barChartanc.push(this.anc[i][2]);
        if(this.anc[i][4] != undefined){
          this.barChartanc.push(this.anc[i][4]); 
        }
          
      }
      else{
        let x= {
          data: [],
          label : this.anc[i][0]
        }
        let tempdata : any = [];
        if(this.anc[i][1] == "ND"){
          tempdata.push(0);
        }
        else{
          tempdata.push(this.anc[i][1]);
        }
        if(this.anc[i][2]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.anc[i][2]);
        }
        if(this.anc[i][4]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.anc[i][4]);
        }
        x.data = tempdata;
        this.barChartancData.push(x);
      }
    }
    //pasivos no corrientes
    for (let i = 0; i < this.pnc.length; i++) {
      if(i == 0){
        this.barChartpnc.push(this.pnc[i][1]);
        this.barChartpnc.push(this.pnc[i][2]);
        if(this.anc[i][4] != undefined){
          this.barChartpnc.push(this.pnc[i][4]); 
        }
          
      }
      else{
        let x= {
          data: [],
          label : this.pnc[i][0]
        }
        let tempdata : any = [];
        if(this.pnc[i][1] == "ND"){
          tempdata.push(0);
        }
        else{
          tempdata.push(this.pnc[i][1]);
        }
        if(this.pnc[i][2]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.pnc[i][2]);
        }
        if(this.pnc[i][4]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.pnc[i][4]);
        }
        x.data = tempdata;
        this.barChartpncData.push(x);
      }
    }
    //otros activos
    for (let i = 0; i < this.oa.length; i++) {
      if(i == 0){
        this.barChartoa.push(this.oa[i][1]);
        this.barChartoa.push(this.oa[i][2]);
        if(this.anc[i][4] != undefined){
          this.barChartoa.push(this.oa[i][4]); 
        }
          
      }
      else{
        let x= {
          data: [],
          label : this.oa[i][0]
        }
        let tempdata : any = [];
        if(this.oa[i][1] == "ND"){
          tempdata.push(0);
        }
        else{
          tempdata.push(this.oa[i][1]);
        }
        if(this.oa[i][2]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.oa[i][2]);
        }
        if(this.oa[i][4]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.oa[i][4]);
        }
        x.data = tempdata;
        this.barChartoaData.push(x);
      }
    }
    //otros pasivos
    for (let i = 0; i < this.op.length; i++) {
      if(i == 0){
        this.barChartop.push(this.op[i][1]);
        this.barChartop.push(this.op[i][2]);
        if(this.anc[i][4] != undefined){
          this.barChartop.push(this.op[i][4]); 
        }
          
      }
      else{
        let x= {
          data: [],
          label : this.op[i][0]
        }
        let tempdata : any = [];
        if(this.op[i][1] == "ND"){
          tempdata.push(0);
        }
        else{
          tempdata.push(this.op[i][1]);
        }
        if(this.op[i][2]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.op[i][2]);
        }
        if(this.op[i][4]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.op[i][4]);
        }
        x.data = tempdata;
        this.barChartopData.push(x);
      }
    }
    //otros patrimonios
    for (let i = 0; i < this.opat.length; i++) {
      if(i == 0){
        this.barChartopat.push(this.opat[i][1]);
        this.barChartopat.push(this.opat[i][2]);
        if(this.anc[i][4] != undefined){
          this.barChartopat.push(this.opat[i][4]); 
        }
          
      }
      else{
        let x= {
          data: [],
          label : this.opat[i][0]
        }
        let tempdata : any = [];
        if(this.opat[i][1] == "ND"){
          tempdata.push(0);
        }
        else{
          tempdata.push(this.opat[i][1]);
        }
        if(this.opat[i][2]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.opat[i][2]);
        }
        if(this.opat[i][4]== "ND"){
          tempdata.push(0);
        }else{
          tempdata.push(this.opat[i][4]);
        }
        x.data = tempdata;
        this.barChartopatData.push(x);
      }
    }
  }
  //shows the graphics
  showGraph(){
    this.record = false;
    this.graf = true;
    this.graphbutton = false;
    this.reportbutton = true;
  }
  //shows the table
  showTable(){
    this.record = true;
    this.graf = false;
    this.graphbutton = true;
    this.reportbutton = false;
  }
  //cleans all the list
  cleanLists(){
    this.ap = [];
    this.ac = [];
    this.pc = [];
    this.anc = [];
    this.pnc = [];
    this.oa = [];
    this.op = [];
    this.opat = [];
    this.barChartCapital = [];
    this.barChartCapitalData= [];
    this.barChartac = [];
    this.barChartacData = [];
    this.barChartpc = [];
    this.barChartpcData = [];
    this.barChartanc  = [];
    this.barChartancData = [];
    this.barChartpnc = [];
    this.barChartpncData = [];
    this.barChartoa = [];
    this.barChartoaData = [];
    this.barChartop  = [];
    this.barChartopData = [];
    this.barChartopat  = [];
    this.barChartopatData = [];
  }


}
