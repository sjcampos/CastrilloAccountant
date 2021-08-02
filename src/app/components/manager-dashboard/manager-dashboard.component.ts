import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
//services
import { RecordServiceService } from '../../services/record/record-service.service';
import { CollaboratorServiceService } from '../../services/collaborators/collaborator-service.service';
import { StorageServiceService } from '../../services/localstorage/storage-service.service';
import { ClientreportServiceService } from '../../services/client-report/clientreport-service.service';
//models
import { collaborator } from '../../models/collaborator.model';


@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent implements OnInit {
  
  activityrecord : any = [];
  dateObj : any;

  chclient : boolean = false;
  chcollab : boolean = false;

  hasactivities : boolean = true;
  noactivities: boolean = false;
  
  collab : collaborator;

  filterClient : any = null;
  filterCollab : any = null;

  selectclients : any = [];
  selectcollabs : any = [];

  activity : any = [];

  showerror : boolean = false;
  messageerror : string = "";

  p : number = 1;
  pr : number = 1;
  pm : number = 1;

  download : boolean = false;
  record : boolean = false;

  loadinginit : boolean = true;
  showtable : boolean = false;

  recordreport: boolean = false;
  norecordreport : boolean = true;
  reports : any = [];
  meetings : any = [];
  meeting : boolean = true;
  nomeeting : boolean = false;

  type1: boolean = true;
  type2: boolean = false;

  constructor(private recordService : RecordServiceService,private collaboratorService : CollaboratorServiceService, private storageService : StorageServiceService, 
  private reportService : ClientreportServiceService) { }

  ngOnInit(): void {
    let timeoutId;
    let data = this.storageService.readData();
    if(data.permissions.includes("4") && data.permissions.includes("5")){
      this.record = true;
    }
    if(data.permissions.includes("1")){
      this.download = true;
    }
    this.getInitalRecord("oninit");
    this.getCollaborators();
    this.getReports();
    this.getMeetings();
    timeoutId = setTimeout(() =>{
      this.loadinginit = false;
      this.showtable= true;
    },850)

  }

  //Gets all the meetings
  getMeetings(){
    this.reportService.getMeetings().subscribe(
      res =>{
        if(res!=null){
          let temp : any = [];
          temp = res;
          this.meetings = temp.applications;
          if(this.meetings.length > 0){
            this.meeting = true;
            this.nomeeting = false;
          }
          else{
            this.meeting = false;
            this.nomeeting = true;
          }
        }
      }
    )
  }
  //Shows the date in the historial
  showdate(d : any){
    let td = new Date(d);
    let tempdate = td.getFullYear().toString()+"-"+(td.getMonth()+1).toString()+"-"+td.getDate().toString();
    return tempdate;
  }
  //Updates the meeting status
  updateApplicationState(status_application : string, id_application : any){
    this.reportService.updateState(id_application, status_application).subscribe(
      res =>{
        if(res != null){
          this.getMeetings();
          Swal.fire(
            'Solicitud de reunión',
            'La solicitud de reunión fue procesada de manera exitosa.',
            'success')
        }
        
      },err => {
        console.log(err);
        Swal.fire(
          'Error',
          'No se pudo procesar la solicitud de manera exitosa.',
          'error')
      }
    ) 
  }
  //Gets all the reports
  getReports(){
    this.reportService.getReports().subscribe(
      res =>{
        if(res!=null){
          let temp : any = [];
          temp = res;
          this.reports = temp.applications;
          if(this.reports.length > 0){
            this.recordreport = true;
            this.norecordreport = false;
          }
          else{
            this.recordreport = false;
            this.norecordreport = true;
          }
          
        }
      }
    )
  }
  //Show the details of an activity
  showDetails(act : any){
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
      activity : [3,4],
      collaborator : null,
      client: null
    }
    this.recordService.getAdminInitial(filter).subscribe(
      res =>{
        if(res != null){
          let temp : any = [];
          temp = res;
          if(temp.RA.length <= 0){ 
            this.hasactivities = false;
            this.noactivities = true;
          }
          else{
            this.hasactivities = true;
            this.noactivities = false;
            this.activityrecord = temp.RA;
            this.filterCollab = 0;
            this.activity = [];
          }
        }
      },err => console.log(err)
    )
  }
  //Cleans the filter
  cleanFilter(){
    this.dateObj = undefined;
    this.filterCollab = null;
    if(this.type1){
      this.type1 = false;
      this.type2 = true;
    }
    else{
      this.type2 = false;
      this.type1 = true;
    }
  }
  //Gets the filter activities
  getFilterActivities(){
    console.log(this.filterCollab);
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
      acti = [3,4];
    }
    else{
      acti = this.activity;
    }
    if(this.filterCollab == null){
      this.filterCollab = 0;
    }
    if(this.validateData()){
      this.activityrecord = [];
      if(this.filterCollab == 0){
          this.filterCollab = null;
      }
      
        let filter = {
          date : date,
          activity : acti,
          collaborator : this.filterCollab,
          client: this.filterClient
        };
        this.recordService.getAdminInitial(filter).subscribe(
          res =>{
            if(res != null){
              let temp : any = [];
              temp = res;
              
              if(temp.RA.length <= 0){ 
                this.hasactivities = false;
                this.noactivities = true;
              }
              else{
                this.hasactivities = true;
                this.noactivities = false;
                this.activityrecord = temp.RA;
                this.filterCollab = 0;
                this.activity = [];
                this.dateObj = undefined;
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
    if(this.filterCollab == null || this.filterCollab == undefined){
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
    if(this.activityrecord.length > 0){
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
    }else{
      Swal.fire(
        'Error',
        'No se cuenta con un historial para descargar.',
        'error')
    }
    
  }
  //change the collaborator id for filter
  changeCollab(c : any){
    if(c == undefined){
      this.filterCollab = 0;
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

}
