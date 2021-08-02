import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
//service
import { StorageServiceService } from '../../services/localstorage/storage-service.service';
import { LoginServiceService } from '../../services/login/login-service.service';
@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.css']
})
export class MainNavbarComponent implements OnInit {

  prueba : boolean = true;

  constructor(private storageService : StorageServiceService, private router : Router, private loginService : LoginServiceService) { }

  ngOnInit(): void {
  }

  //logs out the user
  logout(){
    this.loginService.logout().subscribe(
      res =>{
        if(res != null){
          this.storageService.logout();
          this.router.navigate(['login']);
        }
      }
    );
  }
}
