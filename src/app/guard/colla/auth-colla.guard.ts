import { Injectable } from '@angular/core';
import { StorageServiceService } from '../../services/localstorage/storage-service.service';
import { Router,CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthCollaGuard implements CanActivate {
  constructor(private storageService : StorageServiceService, private router : Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let data = this.storageService.readData();
      if(data.permissions != null && data.code != null && data.id != null && data.token != null && data.rol != null){
        if(data.permissions.length > 0 && data.permissions.length < 4){
          let per : any = ["1","2","3"];
          if(data.permissions.includes("4") || data.permissions.includes("5") || data.permissions.includes("6")){
            this.storageService.logout();
            this.router.navigate(['not-access']);
            return false;
          }
          else{
            for (let i = 0; i < data.permissions.length; i++) {
              if(!per.includes(data.permissions[i])){
                this.storageService.logout();
                this.router.navigate(['not-access']);
                return false;
              }
            }
              if(data.token != null && data.token != undefined && data.token.trim().length != 0){
      
                  if(data.code == 'CO'){
      
                    if(data.id != null && data.id != undefined){
                      return true;
                    }
                    else{
                      this.storageService.logout();
                      this.router.navigate(['not-access']);
                      return false;
                    }
                  }else{
                    this.storageService.logout();
                    this.router.navigate(['not-access']);;
                    return false;
                  }
              }
              else{
                this.storageService.logout();
                this.router.navigate(['not-access']);
                return false;
              }
          }
        }
        else{
          this.storageService.logout();
          this.router.navigate(['not-access']);
          return false;
        }
      }
      else{
        this.storageService.logout();
        this.router.navigate(['not-access']);
        return false;
      }
  }
  
}
