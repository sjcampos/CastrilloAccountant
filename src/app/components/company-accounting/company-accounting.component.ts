import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import Swal from 'sweetalert2';

//services
import { CompanyServiceService } from '../../services/companies/company-service.service';
import { StorageServiceService } from '../../services/localstorage/storage-service.service';

@Component({
  selector: 'app-company-accounting',
  templateUrl: './company-accounting.component.html',
  styleUrls: ['./company-accounting.component.css']
})
export class CompanyAccountingComponent implements OnInit {
  companies : any = [];
  showtable : boolean = false;
  loadinginit : boolean = true;

  nocompany : boolean = false;
  coll : boolean = false;
  manager : boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,private companyService:CompanyServiceService,private storageService : StorageServiceService) { }

  ngOnInit(): void {
    let timeoutId;
    const params = this.activatedRoute.snapshot.params;
    let data = this.storageService.readData();
    if(data.permissions.includes("4") && data.permissions.includes("5")){
      this.coll = false;
      this.manager = true;
    }
    else{
      this.coll = true;
      this.manager = false;
    }
    if(params.filter){
      if(params.filter == "accountant"){
        this.getCollaCompanies(data.id);
        timeoutId = setTimeout(() =>{
        if(this.companies.length <= 0){
          this.showtable = false;
          this.loadinginit = false;
          this.nocompany = true;
        }
        else{
          this.showtable = true;
          this.loadinginit = false;
          this.nocompany = false;
        }
        this.loadinginit = false;
        this.nocompany = false;
      },750)
      }else{
        this.router.navigate(['accountantdashboard']);
      }
    }else{
      this.getCompanies();
      timeoutId = setTimeout(() =>{
        this.loadinginit = false;
        this.showtable= true;
      },750)
    }
  }

  //Gets all the companys
  getCompanies(){
    this.companyService.getCompanies().subscribe(
      res=>{
        let comp: any = [];
        comp = res;
        this.companies = comp.data;        
      },
      err =>{
        
      }
    )
  }
  //Gets the specific companies of a collaborator
  getCollaCompanies(id : any){
    this.companyService.getCollabCompanies(id).subscribe(
      res =>{
        let temp : any = [];
        temp = res;
        this.companies = temp.companys;
      }
    )
  }

}
