import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
//services
import { ClientreportServiceService } from '../../services/client-report/clientreport-service.service';
import { StorageServiceService } from '../../services/localstorage/storage-service.service';
//models
import { Request } from '../../models/request.model';

@Component({
  selector: 'app-client-reports',
  templateUrl: './client-reports.component.html',
  styleUrls: ['./client-reports.component.css']
})
export class ClientReportsComponent implements OnInit {
  dateObj1 : any;
  dateObj2 : any;
  dateObj3 : any;

  showerror : boolean = false;
  showsuccess : boolean = false;
  errormessage: string = "";

  chmes : boolean = false;
  chmesEs: boolean = false;
  chyear : boolean = false;
  
  divEsm : boolean = false;
  divEsY : boolean = false;

  buttonreg : boolean = true;
  buttoncan : boolean = true;
  buttonclose : boolean = false;
  divloading : boolean = false;
  divreg : boolean = true;
  title : string = "Complete la información solicitada:";
  descrip : string;
  config = {
    format :"YYYY-MM-DD"
  };
  newRequest : Request = {};
  year : number;
  option : any;
  id: any;
  record: boolean = false;
  norecord : boolean = true;
  reports : any = [];
  p : number = 1;

  loading : boolean = true;
  showreg : boolean = false;

  type1 : boolean = true;
  type2 : boolean = false;

  constructor(private reportService : ClientreportServiceService, private storageService : StorageServiceService) { }

  ngOnInit(): void {
    let data = this.storageService.readData();
    this.id = data.id;
    this.getReports();
    let timeoutId;
    timeoutId = setTimeout(() =>{
      this.loading = false;
      this.showreg = true;
    },850);
  }
  //Gets all the reports
  getReports(){
    this.reportService.getReportsClient().subscribe(
      res =>{
        if(res!=null){
          let temp : any = [];
          temp = res;
          this.reports = temp.applications;
          if(this.reports.length > 0){
            this.record = true;
            this.norecord = false;
          }
          else{
            this.record = false;
            this.norecord = true;
          }
          
        }
      }
    )
  }
  //Changes the type of the Balance general report
  changeType(op : number){

    switch (op) {
      case 1:
        if(this.option == op){
          this.cleanValues();
        }else{
          this.chmesEs = true;
          this.chyear = true;
          this.option = op;
          this.divEsm = false;
          this.divEsY = false;
          this.newRequest.description = "Balance general Mes actual";
          this.generateActualDate();
        }
        break;
      case 2:
        if(this.option == op){
          this.cleanValues();
        }
        else{
          this.chmes = true;
          this.chyear = true;
          this.option = op;
          this.divEsm = true;
          this.newRequest.description = "Balance general mes específico";
        }
        break;
      case 3:
        if(this.option == op){
          this.cleanValues();
        }
        else{
          this.chmes = true;
          this.chmesEs = true;
          this.option = op;
          this.divEsm = false;
          this.divEsY = true;
          this.newRequest.description = "Balance general por año";
          
        }
        break;
    }

  }
  //Generates a valid date with just the year
  generateYearDate(){
    if( this.year == null || this.year == undefined){
      this.showerror = true;
      this.errormessage ="Debe ingresar un año válido.";
      return false;
    }
    else{
      if(this.year.toString().trim().length > 0){
        if(Number.isInteger(this.year)){
          if(this.year.toString().trim().length > 4){
            this.showerror = true;
            this.errormessage ="Debe ingresar un año válido."
            return false;
          }
          else{
            if(this.year.toString().trim().length == 4){
              let tempDate = new Date();
              let ty = tempDate.getFullYear();
              if(this.year > ty){
                this.showerror = true;
                this.errormessage ="Debe ingresar un año válido."
                return false;
              }
              else{
                if(ty ==this.year){
                  this.generateActualDate();
                  return true;
                }
                else{
                  this.newRequest.date_application = (this.year+1).toString()+"-"+"01-01";
                  return true;
                }
              }
            }
            else{
              this.showerror = true;
              this.errormessage ="Debe ingresar un año válido."
              return false;
            }
          }
  
        }
        else{
          this.showerror = true;
          this.errormessage ="Debe ingresar un año válido."
          return false;
        }
      }
      else{
        this.showerror = true;
        this.errormessage ="Debe ingresar un año válido."
        return false;
      }

    }
  }
  //Cleans the form
  cleanValues(){
    this.option = 0;
    this.chmes = false;
    this.chmesEs = false;
    this.chyear = false;
    this.divEsY = false;
    this.divEsm = false;
    this.newRequest.date_application = "";
    this.newRequest.description = "";
    this.dateObj2 = null;
    this.dateObj1 = null;
    this.dateObj3 = null;
    this.year = 0;
    this.divloading = false;
    this.buttonreg = true;
    this.buttoncan = true;
    this.buttonclose = false;
    this.title = "Complete la información solicitada:";
    this.showerror = false;
    this.errormessage = "";
    this.showsuccess = false;
    this.divreg = true;
    this.descrip = "";

    if(this.type1){
      this.type1 = false;
      this.type2 = true;
    }
    else{
      this.type1 = true;
      this.type2 = false;
    }
  }
  //Generates an actual date
  generateActualDate(){
    let tempDate = new Date();
    let tempMonth = tempDate.getMonth().toString();
    let tempYear = tempDate.getFullYear().toString();
    let temp;
    if(tempMonth.toString().trim().length == 1){
        if(tempMonth == "0"){
          tempMonth = "01";
        }
        else{
          tempMonth = "0"+(tempDate.getMonth()+1).toString();
        }
    }
    else{
        if(tempMonth == "11"){
            tempMonth = "12";
        }
    }
    temp = tempYear+"-"+tempMonth+"-01";
    this.newRequest.date_application = temp;
    
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
        else if(e._d.getMonth() == 9){
          tempMonth = "10";
          tempYear = e._d.getFullYear();
        }
        else{
            tempMonth = "0"+(e._d.getMonth() + 1).toString();
            tempYear = e._d.getFullYear();        
        }
      }
      else{
        if(e._d.getMonth() == 11){
          tempMonth = "12";
          tempYear = (e._d.getFullYear()).toString();
        }
        else{
          tempMonth = (e._d.getMonth() + 1).toString();
          tempYear = (e._d.getFullYear()).toString();  
        }
      }
      let tempdate = tempYear+"-"+tempMonth+"-01";
      this.newRequest.date_application = tempdate;
    }
  }
  //Starts the register process
  registerGB(){
    this.newRequest.hour_application = "00:00:00";
    this.newRequest.type_application = "Reporte";
    this.newRequest.id_company = Number.parseInt(this.id);
    if(this.year != null && this.year != undefined && this.year != 0){
      if(this.generateYearDate()){
        this.registerBG();
      }
    }
    else{
      this.registerBG();
    }
  }
  //Registers the Balance general report
  registerBG(){
    if(this.validRequest(this.newRequest)){
      this.divreg = false;
      this.title = "Procesando solicitud"
      this.divloading = true;
      this.buttoncan = false;
      this.buttonreg = false;
      let timeoutId;
      this.reportService.registerRequest(this.newRequest).subscribe(
        res =>{
          if(res != null){
            timeoutId = setTimeout(() =>{
              this.getReports();
              this.showerror = false;
              this.divloading = false;
              this.buttonclose = true;
              this.showsuccess = true;
            },800);
          }
        },err => {
          this.divloading = false;
          this.showerror = true;
          this.buttonclose = true;
          this.errormessage = err.error.message;
        }
      )
    }
  }
  //Register the estado financiero report
  registerEF(){
    this.newRequest.description = "Estado financiero";
    this.newRequest.hour_application ="00:00:00";
    this.newRequest.date_application = "2021-01-01";
    this.newRequest.type_application = "Reporte";
    this.newRequest.id_company = Number.parseInt(this.id);
    this.reportService.registerRequest(this.newRequest).subscribe(
      res =>{
        if(res != null){
          this.getReports();
          Swal.fire(
            'Solicitado',
            'El reporte fue solicitado de manera exitosa.',
            'success'
          ) 
        }
      },err => {
        console.log(err);
        Swal.fire(
          'Error al solicitar reporte',
          'El reporte no pudo ser solicitado de manera exitosa, intente de nuevo por favor.',
          'error'
        )
        
      }
    )
  }
  //Validates if the balance general report data is correct
  validRequest(re : Request){
    if(re.description == "" || re.description == null || re.description == undefined){
      this.showerror = true;
      this.errormessage = "Debe seleccionar un filtro para el reporte";
      return false;
    }
    if(re.date_application == "" || re.date_application == null || re.date_application == undefined){
      this.showerror = true;
      this.errormessage = "Debe seleccionar un filtro para el reporte";
      return false;
    }
    else{
      return true;
    }
  }
  //Registers ganancias y perdidas y flujo de efectivo report
  registerGPFE(title : string){
    this.newRequest.description = title;
    this.newRequest.hour_application ="00:00:00";
    this.newRequest.type_application = "Reporte";
    this.newRequest.id_company = Number.parseInt(this.id);
    if(this.validRequest(this.newRequest)){
      this.divreg = false;
      this.title = "Procesando solicitud"
      this.divloading = true;
      this.buttoncan = false;
      this.buttonreg = false;
      let timeoutId;
      this.reportService.registerRequest(this.newRequest).subscribe(
        res =>{
          if(res != null){
            timeoutId = setTimeout(() =>{
              this.getReports();
              this.showerror = false;
              this.divloading = false;
              this.buttonclose = true;
              this.showsuccess = true;
            },800);
          }
        },err => {
          this.divloading = false;
          this.showerror = true;
          this.buttonclose = true;
          this.errormessage = err.error.message;
        }
      )

    }
  }
  //Registers personalized report request
  registerRP(){
    this.newRequest.description = this.descrip;
    this.newRequest.hour_application ="00:00:00";
    this.newRequest.date_application = "2021-01-01";
    this.newRequest.type_application = "Reporte";
    this.newRequest.id_company = Number.parseInt(this.id);
    if(this.validDescription(this.newRequest)){
      this.divreg = false;
      this.title = "Procesando solicitud"
      this.divloading = true;
      this.buttoncan = false;
      this.buttonreg = false;
      let timeoutId;
      this.reportService.registerRequest(this.newRequest).subscribe(
        res =>{
          if(res != null){
            timeoutId = setTimeout(() =>{
              this.getReports();
              this.showerror = false;
              this.divloading = false;
              this.buttonclose = true;
              this.showsuccess = true;
            },800);
          }
        },err => {
          this.divloading = false;
          this.showerror = true;
          this.buttonclose = true;
          this.errormessage = err.error.message;
        }
      )

    }
  }
  //Validates the description for the personalized report request
  validDescription(r : Request){
    if(r.description == null || r.description == undefined || r.description.trim().length == 0){
      this.showerror = true;
      this.errormessage = "Debe proporcionar una descrpción valida.";
      return false;
    }
    else{
      return true;
    }
  }

}
