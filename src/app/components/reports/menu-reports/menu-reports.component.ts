import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
//services
import { CompanyServiceService } from '../../../services/companies/company-service.service';
import { StorageServiceService } from '../../../services/localstorage/storage-service.service';


@Component({
  selector: 'app-menu-reports',
  templateUrl: './menu-reports.component.html',
  styleUrls: ['./menu-reports.component.css']
})
export class MenuReportsComponent implements OnInit {
  companies : any = [];
  showtable : boolean = false;
  loadinginit : boolean = true;

  nocompany : boolean = false;

  slug : any;
  companyName : any;
  allow : boolean = true;
  coll : boolean = false;
  manager : boolean = false;
  constructor(private companyService:CompanyServiceService,private storageService : StorageServiceService) { }

  ngOnInit(): void {
    let data = this.storageService.readData();
    if(data.permissions.includes('1') && data.permissions.includes('2')){
      this.allow = true;
    }else{
      this.allow = false;
    }
    if(data.permissions.includes("4") && data.permissions.includes("5")){
      this.coll = false;
      this.manager = true;
      
    }
    else{
      this.coll = true;
      this.manager = false;
    }
    
  }


}
