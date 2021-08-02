import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
//service
import { StorageServiceService } from '../../services/localstorage/storage-service.service';
import { LoginServiceService } from '../../services/login/login-service.service';


@Component({
  selector: 'app-client-navbar',
  templateUrl: './client-navbar.component.html',
  styleUrls: ['./client-navbar.component.css']
})
export class ClientNavbarComponent implements OnInit {

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
        }, err => console.log(err)
      );
    }

}
