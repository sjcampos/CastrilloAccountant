import { Component, OnInit } from '@angular/core';

import {  IDatePickerConfig} from 'ng2-date-picker/date-picker/date-picker-config.model';
//models
import { Request } from '../../models/request.model';
//services
import { ClientreportServiceService } from '../../services/client-report/clientreport-service.service';
import { StorageServiceService } from '../../services/localstorage/storage-service.service';


@Component({
  selector: 'app-client-meeting',
  templateUrl: './client-meeting.component.html',
  styleUrls: ['./client-meeting.component.css']
})
export class ClientMeetingComponent implements OnInit {

  config : IDatePickerConfig= {
    format : "YYYY-MM-DD",
    
  };

  record: boolean = false;
  norecord : boolean = true;

  meetings : any = [];

  newRequest : Request ={};

  selectedDate: any;
  selectedTime: any;
  id : any;

  showerror : boolean = false;
  messageerror : string = "";

  loading : boolean = true;
  showreg : boolean = false;
  text : string = "Cargando información";
  p : number = 1;
  constructor(private storageService: StorageServiceService, private reportService: ClientreportServiceService) { }

  ngOnInit(): void {
    let data = this.storageService.readData();
    this.id = data.id;
    let timeoutId;
    this.getMeetings();
    timeoutId = setTimeout(() =>{
      this.loading = false;
      this.showreg = true;
    },800);
  }
  //Gets all the meetings
  getMeetings(){
    this.reportService.getMeetingsClient().subscribe(
      res =>{
        if(res!=null){
          let temp : any = [];
          temp = res;
          this.meetings = temp.applications;
          if(this.meetings.length > 0){
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
  
  //Shows the date in the historial
  showdate(d : any){
    let td = new Date(d);
    let tempdate = td.getFullYear().toString()+"-"+(td.getMonth()+1).toString()+"-"+td.getDate().toString();
    return tempdate;
  }
  //registers a new meeting
  registerMeeting(){
    let date;
    if(this.selectedDate == undefined){
      date = null;
    }
    else{
      date = this.selectedDate.value;
    }
    let time;
    if(this.selectedTime == undefined){
      time = undefined;
    }
    else{
      let h = this.selectedTime._d.getHours();
      let m = this.selectedTime._d.getMinutes();
      time = h.toString() +":"+m.toString()+":00";
    }

    this.newRequest.date_application = date;
    this.newRequest.hour_application = time;
    this.newRequest.type_application = "Reunion";
    this.newRequest.description = "Solicitud de reunión";
    this.newRequest.id_company = Number.parseInt(this.id);
    if(this.validData(this.newRequest)){
      this.showreg = false;
      this.loading = true;
      this.text = "Procesando solicitud...";
      this.reportService.registerRequest(this.newRequest).subscribe(
        res =>{
          if(res != null){

            let timeoutId;
            this.getMeetings();
            timeoutId = setTimeout(() =>{
              this.loading = false;
              
              this.showreg = true;
              this.cleanValues();
            },800);
          }
        },err=>{
          this.loading = false;
          this.showreg = true;
          this.showerror = true;
          this.messageerror = err.error.message;
          
        }
      )

    }

  }
  //Cleans all the form and resets the form
  cleanValues(){
    this.text = "";
    this.showerror = false;
    this.messageerror = "";
    this.newRequest.date_application = "";
    this.newRequest.hour_application = "";
    this.selectedDate = null;
    this.selectedTime = undefined;
  }
  //Validates the data before register
  validData(r : Request){
    if(r.date_application == null || r.date_application == undefined){
      this.showerror = true;
      this.messageerror = "Debe seleccionar una fecha valida."
      return false;
    }
    if(r.hour_application == undefined || r.hour_application == null){
      this.showerror = true;
      this.messageerror = "Debe seleccionar una hora valida."
      return false;
    }
    else{
      return true;
    }
  }


}
