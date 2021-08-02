import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
//services
import { RecordServiceService } from '../../services/record/record-service.service';
import { CollaboratorServiceService } from '../../services/collaborators/collaborator-service.service';
import { CompanyServiceService } from '../../services/companies/company-service.service';
//models
import { collaborator } from '../../models/collaborator.model';
import { company } from '../../models/company.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {


  activityrecord : any = [];
  dateObj : any;

  chclient : boolean = false;
  chcollab : boolean = false;

  showclients : boolean = false;
  showcollabs: boolean = false;

  client : company;
  collab : collaborator;

  filterClient : any = null;
  filterCollab : any = null;

  selectclients : any = [];
  selectcollabs : any = [];

  activity : any = [];

  showerror : boolean = false;
  messageerror : string = "";

  p : number = 1;

  record : boolean = false;
  norecord : boolean = false;

  loadinginit : boolean = true;
  showtable : boolean = false;

  hasactivities : boolean = true;
  noactivities: boolean = false;

  type1: boolean = true;
  type2: boolean = false;
  constructor( private recordService : RecordServiceService,private collaboratorService : CollaboratorServiceService,private companyService:CompanyServiceService) { }

  ngOnInit(): void {
    let timeoutId;
    this.getInitalRecord("oninit");
    this.getCollaborators();
    this.getCompanies();
    timeoutId = setTimeout(() =>{
      this.loadinginit = false;
      this.showtable= true;
    },850)
  }

  showDetails(act : any){
    console.log(act);
    if(act.id_user.collaborators != undefined){
      Swal.fire(
        'Detalle',
        `Fecha: ${act.activity_date} <br>
         Código: ${act.activity_code} <br> Actividad: ${act.details} <br>
         Identificación: ${act.id_user.collaborators[0].identification} <br>
         Usuario: ${act.id_user.collaborators[0].collaborator_name +' '+ act.id_user.collaborators[0].collaborator_lastname} <br>
         Correo electrónico: ${act.id_user.collaborators[0].email} <br>
         Teléfono: ${act.id_user.collaborators[0].number_phone}`,
        'info'
      );
    }
    else{
      Swal.fire(
        'Detalle',
        `Fecha: ${act.activity_date} <br>
         Código: ${act.activity_code} <br> Actividad: ${act.details} <br>
         Compañía: ${act.id_user.company[0].company_name} <br>
         Agente: ${act.id_user.company[0].agent} <br>
         Correo electrónico: ${act.id_user.company[0].main_email} <br>
         Teléfono: ${act.id_user.company[0].number_phone}`,
        'info'
      );
    }

  }
  //Gets all the initial record
  getInitalRecord(t : any){
    if(t == "reload"){
      this.cleanFilter();
    }
    let filter = {
      date :  null,
      activity : null,
      collaborator : null,
      client: null
    }
    this.recordService.getAdminInitial(filter).subscribe(
      res =>{
        if(res != null){
          let temp : any = [];
          temp = res;
          this.activityrecord = temp.RA;
          console.log(this.activityrecord);
          if(this.activityrecord.length <= 0){
            this.record = false;
            this.norecord = true;
         }
         else{
           this.record = true;
           this.norecord = false;
         }
        }
      },err => console.log(err)
    )
  }
  //Gets the filter activities
  getFilterActivities(){
    let date;
    if(this.dateObj == undefined){
      date = null;
    }
    else{
      if(this.dateObj.value == ""){
        date =  null;
      }else{
        date = this.dateObj.value;        
      }
    }
    let acti;
    if(this.activity.length <= 0){
      acti = null;
    }
    else{
      acti = this.activity;
    }
    if(this.validateData()){
      this.activityrecord = [];
        let filter = {
          date : date,
          activity : acti,
          collaborator : this.filterCollab,
          client: this.filterClient
        };
        console.log(acti);
        this.recordService.getAdminInitial(filter).subscribe(
          res =>{
            if(res != null){
              let temp : any = [];
              temp = res;
              
              this.activityrecord = temp.RA;
              if(this.activityrecord.length <= 0){
                this.record = false;
                this.norecord = true;
             }
             else{
               this.record = true;
               this.norecord = false;
             }
            }
          },err => {
            this.showerror = true;
            this.messageerror = err.error.message;

          }
        )
    } 
  }
  //Validates data
  validateData(){
    if(this.filterCollab != null && this.filterClient != null){
      this.showerror = true;
      this.messageerror = "No se puede marcar un cliente y un colaborador al mismo tiempo.";
      return false;
    }
    else{
      return true;
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
    this.recordService.getPDF(this.activityrecord).subscribe(
      res =>{
        if(res != null){
          let temp : any;
          temp = res;
          let base64String =temp.report.toString();
          this.downloadPdf(base64String,"Historial de actividades");
        
        }
      },err => console.log(err)
    )
    
  }
  //change the select options for filter
  changeUser(u : any){
    if(u == "clientes"){
      if(this.chcollab && !this.chclient){
        this.chclient = false;
        this.chcollab = false;
        this.showclients = false;
        this.showcollabs= false;
        this.filterClient = null;
      }
      else{
        this.chcollab = true;
        this.chclient = false;
        this.showclients = true;
        this.showcollabs = false;
      }

    }
    else{
      if(!this.chcollab && this.chclient){
        this.chclient = false;
        this.chcollab = false;
        this.showclients = false;
        this.showcollabs= false;
        this.filterCollab = null;
      }
      else{
        this.chclient = true;
        this.chcollab = false;
        this.showcollabs = true;
        this.showclients= false;
      }

    }
  }
  //change the client id for filter
  changeClient(c : any){
   if(c == undefined){
     this.filterClient = null;
   }
   else{
     this.filterClient = c.id_company;
   }
  }
  //change the collaborator id for filter
  changeCollab(c : any){
    if(c == undefined){
      this.filterCollab = null;
    }
    else{
      this.filterCollab = c.id_collaborators;
    }
  }
  //gets all the collaborators
  getCollaborators(){
    this.collaboratorService.getCollaborators().subscribe(
      res =>{
        let temp : any = [];
        temp = res;
        this.selectcollabs = temp.Collaborators;

      },
      err => console.log(err)
    );
  }
  //gets all the companies
  getCompanies(){
    this.companyService.getCompanies().subscribe(
      res=>{
        let comp: any = [];
        comp = res;
        this.selectclients = comp.data;
      },
      err => console.log(err)
    )
  }
  //registers all the activities
  registerActivity(activity : any){
    if(this.checkArray(activity)){
      this.activity.push(activity);
    }
  }
  //Checks if the activity array contains the activity and deletes it
  checkArray(a : any){
    for (let i = 0; i < this.activity.length; i++) {
      if(this.activity[i] == a){
        let pos = i;
        this.activity.splice(i,1);
        return false;
      }
    }
    return true;
  }
  //Cleans the filter
  cleanFilter(){
    this.chclient = false;
    this.chcollab = false;
    this.showclients = false;
    this.showcollabs= false;
    this.filterClient = null;
    this.dateObj = undefined;
    if(this.type1){
      this.type1 = false;
      this.type2 = true;
    }
    else{
      this.type2 = false;
      this.type1 = true;
    }
  }
}
