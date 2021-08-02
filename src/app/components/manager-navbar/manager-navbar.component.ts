import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
//service
import { StorageServiceService } from '../../services/localstorage/storage-service.service';
import { LoginServiceService } from '../../services/login/login-service.service';

@Component({
  selector: 'app-manager-navbar',
  templateUrl: './manager-navbar.component.html',
  styleUrls: ['./manager-navbar.component.css']
})
export class ManagerNavbarComponent implements OnInit {
  
  accounting : boolean = false;
  reports : boolean = false;
  constructor( private storageService : StorageServiceService, private router : Router,private loginService : LoginServiceService) { }

  ngOnInit(): void {
    let data = this.storageService.readData();
    if(data.permissions.includes("3")){
      this.accounting = true;
    }
    if(data.permissions.includes("2")){
      this.reports = true;
    }


  }
  //logs out the user
  logout(){
    this.loginService.logout().subscribe(
      res =>{
        if(res != null){
          this.storageService.logout();
          this.router.navigate(['login']);
        }
      }, err => console.log(err)
    );
  }

}
