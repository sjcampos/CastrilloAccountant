import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2';
import { TreeComponent } from '@circlon/angular-tree-component';
//models
import { newAccount } from '../../../models/newAccount.model';
import { accountType } from '../../../models/accountType.model';
import { clients } from "../../../models/client.model";
import { provider } from '../../../models/provider.model';
//services
import { AccountServiceService } from '../../../services/accounts/account-service.service';
import { ClientServiceService } from "../../../services/clients/client-service.service";
import { ProviderServiceService } from "../../../services/providers/provider-service.service";



@Component({
  selector: 'app-accounts-view',
  templateUrl: './accounts-view.component.html',
  styleUrls: ['./accounts-view.component.css']
})
export class AccountsViewComponent implements OnInit {

  //array to insert in db
  newaccounts : any = [];
  //array to show in the treeview
  treeaccounts : any = [];
  //array to show in the subaccount select
  selectaccounts : any = [];
  //array for the types
  accountsTypes : any = [];
  //array clients
  clients : any = [];
  //array  providers
  providers : any = [];

  dateObj : any;
  pickdate : boolean = false;

  slug: string = "";

  height : number = 0;

  showselectaccounts : boolean = false;
  showselectaccounts2 : boolean = false;

  showerror : boolean = false;
  messageerror : string = "";

  //titulation
  optionSelected : string = "0";
  seeSelection : string = "";

  //accounts type
  divprima : boolean = true;
  divprima2 : boolean = false;

  divsecondact : boolean = false;
  divsecondact2 : boolean = false;

  divsecondpass: boolean = false;
  divsecondpass2 : boolean = false;

  divsecondpm : boolean = false;
  divsecondpm2 : boolean  = false;

  divthird : boolean = false;

  acctype : string = "";

  //primary
  chact : boolean = false;
  chpass :boolean = false;
  chpm : boolean = false;
  ching: boolean = false;
  chgast: boolean = false;
  chcost: boolean = false;

  //second
  chactc : boolean = false;
  chactnc: boolean = false;
  choact : boolean = false;

  chpassc : boolean = false;
  chpassnc : boolean = false;
  chopass : boolean = false;
  
  chcp : boolean = false;
  chop : boolean = false;

  loading : boolean = false;
  showregister : boolean = false;
  loadinginit : boolean = true;

  existingaccounts : any = [];
  //options the tree view
  options = {
    useVirtualScroll: true,
    nodeHeight: this.height,
    dropSlotHeight: 3
  }

   newAccount: newAccount={
    id_account: "0",
    id_father:  "",
    account_name: "",
    account_type: "",
    classification : "",
    debit : 0,
    credit: 0,
    balance: 0,
    account_code: "",
    id_client: 0,
    id_provider: 0,
    sons:  []
  };

  client : clients [];
  provider : provider [];

  showclients : boolean = true;
  showproviders : boolean = true;

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  accountModel : newAccount;
  accountType : accountType;
  constructor(private accountService : AccountServiceService,private router: Router, private activedRoute: ActivatedRoute,private clientService : ClientServiceService, private providerService : ProviderServiceService) { }

  ngOnInit(): void {
    let timeoutId;
    const params = this.activedRoute.snapshot.params;
    if(params.slug){
      this.slug = params.slug;
      this.getAccounts(this.slug);
      timeoutId = setTimeout(() =>{

        if(this.existingaccounts  != undefined){

          if(this.existingaccounts.length > 0){
            this.router.navigate([`/accountsview/${this.slug}`]);
          }
          else{
            this.getClients(this.slug);
            this.getProviders(this.slug);
            this.loadinginit = false;
            this.showregister = true;
          }
        }
        else{
          this.getClients(this.slug);
          this.getProviders(this.slug);
          this.loadinginit = false;
          this.showregister = true;
        }
      },750)
      


    }
    
  }

  getAccounts(slug: string){
    let filter = "all";
    this.accountService.getAccounts(slug,filter).subscribe(
      res=>{
        let temp : any = [];
        temp = res;
        this.existingaccounts = temp.accounts;  
      }
    );
    
  }
  //Registers all the accounts in the db
  registerAccounts(){
    let timeoutId;
    this.showregister = false;
    this.loading = true;
    this.accountService.registerAccounts(this.newaccounts, this.slug).subscribe(
      res=>{
          if(res != null){
            timeoutId = setTimeout(() =>{
              this.router.navigate([`/companylist`]);
            },1500)

          }
      },
      (err) =>{
       this.showregister = true;
       this.loading = false;
       this.showerror = true;
       this.messageerror = err['error']['message'];
      }
    );
  }
  //Adds an account to the arrays
  addAccount(){
    let fathercode = this.newAccount.id_father;
    let date;
    if(this.dateObj == undefined){
      date = null;
    }
    else{
      date = this.dateObj.value;
    }
    let tempAccount : newAccount={
      id_account: "0",
      id_father:  "",
      account_name: this.newAccount.account_name,
      account_type: this.newAccount.account_type,
      classification : this.newAccount.classification,
      debit : 0,
      credit: 0,
      balance: 0,
      account_time : date,
      account_code: this.newAccount.account_code,
      sons: [],
      id_client: this.newAccount.id_client,
      id_provider: this.newAccount.id_provider   
   };
   if(this.validateData(tempAccount)){
     let tempname = tempAccount.account_code +" - "+tempAccount.account_name;
     let type ={
         id : tempAccount.account_code,
         name: tempname,      
         children: [
         ]
      };
      if(fathercode != ""){
        if(this.addNormalArray(tempAccount,fathercode)){
          if(this.addTreeArray(fathercode,type)){
            this.cleanForm();
            this.showselectaccounts = true; 
          }  
          else{
            this.showerror = true;
            this.messageerror = "Esta cuenta no se pudo agregar, por favor recargue la página."
            
          } 
        }
        else{
          this.showerror = true;
            this.messageerror = "Esta cuenta no permite subcuentas."
        }
      }
      else{
        this.newaccounts.push(tempAccount);
        this.selectaccounts.push(tempAccount);
        this.treeaccounts.push(type);
        this.height = this.treeaccounts.length;
        this.tree.treeModel.update();
        this.showselectaccounts = true; 
        
        this.cleanForm();
      }
     
     this.dateObj = undefined;
     this.client = [this.client[0]];
     this.provider = [];
     
   }
  }
  //Cleans the account form
  cleanForm(){
    this.showerror = false;
    this.messageerror = "";
    //this.newAccount.id_father = "";
    this.newAccount.account_name = "";
    //this.newAccount.account_type = "";
    this.newAccount.account_code = "";
    this.newAccount.classification = "";
    this.newAccount.id_client = 0;
    this.newAccount.id_provider = 0;
    this.optionSelected = "0";
    this.pickdate = false;
    if(this.divprima2 || this.divprima){
      if(this.divprima2){
        this.divprima = true;
        this.divprima2 = false;
      }
      else{
        this.divprima = false;;
        this.divprima2 = true;
      }
    }
    if(this.divsecondact || this.divsecondact2){
      if(this.divsecondact){
        this.divsecondact = false;
        this.divsecondact2 = true;
      }
      else{
        this.divsecondact = true;
        this.divsecondact2 = false;
      }
    }
    if(this.divsecondpass || this.divsecondpass2){
      if(this.divsecondpass){
        this.divsecondpass = false;
        this.divsecondpass2 = true;
      }
      else{
        this.divsecondpass2 = false;
        this.divsecondpass = true;
      }

    }
    if(this.divsecondpm || this.divsecondpm2){
      if(this.divsecondpm){
        this.divsecondpm = false;
        this.divsecondpm2= true;
      }
      else{
        this.divsecondpm = true;
        this.divsecondpm2= false;
      }
    }
    
    this.cleanCheckBoxes();
   
    
  }
  //cleans all the checkboxes
  cleanCheckBoxes(){
     //primary
     this.chact = false;
     this.chpass = false;
     this.chpm = false;
     this.ching = false;
     this.chgast = false;
     this.chcost = false;
     //second
     this.chactc = false;
     this.chactnc = false;
     this.choact = false;
 
     this.chpassc = false;
     this.chpassnc = false;
     this.chopass = false;
 
     this.chop = false;
     this.chcp = false;
  }
  //Adds the sons to the father account in the newaccounts array
  addNormalArray(tempAccount: any, fathercode : any,){
    for (let i = 0; i < this.newaccounts.length; i++) {
      if(this.newaccounts[i].account_code == fathercode){
          this.newaccounts[i].sons.push(tempAccount);
          this.selectaccounts.push(tempAccount);
          return true;
      }
      else{
        if(this.newaccounts[i].sons != undefined){

          if(this.newaccounts[i].sons.length > 0){

            for (let s = 0; s < this.newaccounts[i].sons.length; s++) {
              if( this.newaccounts[i].sons[s].account_code == fathercode){
                this.newaccounts[i].sons[s].sons.push(tempAccount);
                this.selectaccounts.push(tempAccount);
                return true;
              }
              else{
                if(this.newaccounts[i].sons[s].sons != undefined){

                  if(this.newaccounts[i].sons[s].sons.length > 0){
     
                    for (let o = 0; o < this.newaccounts[i].sons[s].sons.length; o++) {
                      if(this.newaccounts[i].sons[s].sons[o].account_code == fathercode){
                        this.newaccounts[i].sons[s].sons[o].sons.push(tempAccount);
                        this.selectaccounts.push(tempAccount);
                        return true;
                      }
                      else{
                        if(this.newaccounts[i].sons[s].sons[o].sons != undefined){

                          if(this.newaccounts[i].sons[s].sons[o].sons.length > 0){
             
                            for (let f = 0; f < this.newaccounts[i].sons[s].sons[o].sons.length; f++) {
                               if(this.newaccounts[i].sons[s].sons[o].sons[f].account_code == fathercode){
                                this.newaccounts[i].sons[s].sons[o].sons[f].sons.push(tempAccount);
                                this.selectaccounts.push(tempAccount);
                                return true;
                               }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }            
            }
          }
        }
      }
    }
    return false;
  }
  //Adds the son to treeaccounts array
  addTreeArray(fathercode : any, type : any){
    
    for (let j = 0; j < this.treeaccounts.length; j++) {
      if(this.treeaccounts[j].id == fathercode){
        this.treeaccounts[j].children.push(type);
        this.height = this.treeaccounts.length;
        this.tree.treeModel.update();
        return true;
      }
      else{
        if(this.treeaccounts[j].children != undefined){

          if(this.treeaccounts[j].children.length > 0){
            for (let k = 0; k < this.treeaccounts[j].children.length; k++) {
              if(this.treeaccounts[j].children[k].id == fathercode){
                this.treeaccounts[j].children[k].children.push(type);
                this.height = this.treeaccounts.length;
                this.tree.treeModel.update();
                return true;               
              }
              else{
                if(this.treeaccounts[j].children[k].children != undefined){

                  if(this.treeaccounts[j].children[k].children.length > 0){

                      for (let r = 0; r < this.treeaccounts[j].children[k].children.length; r++) {
                        if(this.treeaccounts[j].children[k].children[r].id == fathercode){
                          this.treeaccounts[j].children[k].children[r].children.push(type);
                          this.height = this.treeaccounts.length;
                          this.tree.treeModel.update();
                          return true;
                        }
                        else{
                          if( this.treeaccounts[j].children[k].children[r].children != undefined){

                            if( this.treeaccounts[j].children[k].children[r].children.length >0){

                              for (let u = 0; u <  this.treeaccounts[j].children[k].children[r].children.length; u++) {
                                if(this.treeaccounts[j].children[k].children[r].children[u].id == fathercode){
                                  this.treeaccounts[j].children[k].children[r].children[u].children.push(type);
                                  this.height = this.treeaccounts.length;
                                  this.tree.treeModel.update();
                                  return true;                                  
                                }    
                              }
                            }
                          }
                        }  
                      }
                  }
                } 
              }    
            }
          }
        }
      } 
    }
    return false;
  }
  //Adds the account classification
  addTitu(){
    this.seeSelection = this.optionSelected;
    if(this.seeSelection != "0"){
      this.newAccount.classification = this.seeSelection;
    }
    else{
      this.newAccount.classification = "";
    }
  }
  //Shows a modal to delete an account from the list
  showModal(acc : any){
     Swal.fire({
      title: `Eliminar cuenta ${acc.node.data.name}`,
      text: 'Al eliminar este registro perdera todas las cuentas asociadas',
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor:'#0096d2',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
          if(this.removeAccount(acc.node.data.id)){
            Swal.fire({
              title:'Eliminado',
              text:'El registro de la cuenta ha sido eliminado.',
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonColor:'#0096d2',
              icon:'success'
            })
          }
          else{
            Swal.fire({
              title:'Error',
              text:'El registro de la cuenta no ha sido eliminado de manera exitosa.',
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonColor:'#0096d2',
              icon:'error'
            })
          }
              
            
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title:'Cancelado',
          text:'El registro del colaborador no ha sido eliminado.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonColor:'#0096d2',
          icon:'error'
        })
      }
    })
  }
  //change the provider id
  changePro(pro : any){
    
    if(pro == undefined){
      this.newAccount.id_provider = 0;
      this.pickdate = false;
    }
    else{
      this.newAccount.id_provider = pro.id_provider;
      this.pickdate = true;
    }
  }
  //Change the client id
  changeCli(cli : any){
    if(cli == undefined){
      this.newAccount.id_client = 0;
      this.pickdate = false;
    }
    else{
      this.newAccount.id_client = cli.id_client;
      this.pickdate = true;
    }

  }
  //gets all the clients
  getClients(slug : any){
    this.clientService.getClients(slug).subscribe(
      res=>{
          let temp : any = [];
          temp= res;
          this.clients = temp.data;
          if(this.clients.length <= 0){
              this.showclients = false;
          }
          else{
              this.showclients = true;
          }
      }
      ,err=> {

      }
    );
  }
  //gets all the providers
  getProviders(slug : any){
    this.providerService.getAllProviders(slug).subscribe(
      res=>{
        let temp : any = [];
        temp = res;
        this.providers = temp.data;
        if(this.providers.length <= 0){
          this.showproviders = false;
        }
        else{
          this.showproviders = true;
        }
        }
      )
  }
  //Removes an account from all the lists
  removeAccount(code : any){
    if(this.removeNormalArray(code)){
      if(this.removeTreeArray(code)){
          if(this.removeSelectArray(code)){
            return true;
          }
          else{ 
            return false;
          }
      }
      else{
        return false;
      }
    }else{
      return false;
    }
  }
  //Gets all the accounts to delete from select array
  removeSelectArray(code :any){
    let tempAccounts : any = [];
    for (let i = 0; i < this.selectaccounts.length; i++) {
      if(this.selectaccounts[i].account_code == code){
        tempAccounts.push(this.selectaccounts[i]);
        if(this.selectaccounts[i].sons != undefined && this.selectaccounts[i].sons.length > 0){
          let second = this.selectaccounts[i].sons;
           for (let s = 0; s < second.length; s++) {
             tempAccounts.push(second[s]);
             if(second[s].sons != undefined && second[s].sons.length > 0){
               let divthird= second[s].sons;
               for (let t = 0; t < divthird.length; t++) {
                 tempAccounts.push(divthird[t]);
                 if(divthird[t].sons != undefined && divthird[t].sons.length > 0){   
                    let fourth = divthird[t].sons;
                    for (let f = 0; f < fourth.length; f++) {
                      tempAccounts.push(fourth[f]);
                      if(fourth[f].sons != undefined && fourth[f].sons.length > 0){ 
                        let fith = fourth[f].sons;
                        for (let fi = 0; fi < fith.length; fi++) {
                          tempAccounts.push(fith[fi]);   
                          if(fith[fi].sons != undefined && fith[fi].sons.length > 0){
                            let sixth = fith[fi];
                            for (let si = 0; si < sixth.length; si++) {
                              tempAccounts.push(sixth[si]);
                            }
                        }                   
                      }
                    }
                  }
                }
              }          
            }             
          }
        }
      }
    }
    for (let r = 0; r < tempAccounts.length; r++) {
      if(this.removeSingleAccount(tempAccounts[r])){
          continue;
      }
      else{
        return false;
      }
    }
    return true;
  }
  //Removes an account from the select array
  removeSingleAccount(account : any){
    for (let x = 0; x < this.selectaccounts.length; x++) { 
      if(this.selectaccounts[x].account_code == account.account_code){
        let pos = x;
        this.selectaccounts.splice(pos,1);
          return true;
      }
    }
    return false;

  }
 //Deletes an account from the newaccounts array
  removeNormalArray(code : any){
   for (let i = 0; i < this.newaccounts.length; i++) {
    if(this.newaccounts[i].account_code == code){
        let pos = i;
        this.newaccounts.splice(pos,1);
        return true;
    }
    else{
      if(this.newaccounts[i].sons != undefined){

        if(this.newaccounts[i].sons.length > 0){

          for (let s = 0; s < this.newaccounts[i].sons.length; s++) {
            if( this.newaccounts[i].sons[s].account_code == code){
              let pos = s;
              this.newaccounts[i].sons.splice(pos,1);
              return true 
            }
            else{
              if(this.newaccounts[i].sons[s].sons != undefined){

                if(this.newaccounts[i].sons[s].sons.length > 0){
   
                  for (let o = 0; o < this.newaccounts[i].sons[s].sons.length; o++) {
                    if(this.newaccounts[i].sons[s].sons[o].account_code == code){
                      let pos = o;
                      this.newaccounts[i].sons[s].sons.splice(pos,1);
                      return true
                    }
                    else{
                      if(this.newaccounts[i].sons[s].sons[o].sons != undefined){

                        if(this.newaccounts[i].sons[s].sons[o].sons.length > 0){
           
                          for (let f = 0; f < this.newaccounts[i].sons[s].sons[o].sons.length; f++) {
                             if(this.newaccounts[i].sons[s].sons[o].sons[f].account_code == code){
                              let pos = f;
                              this.newaccounts[i].sons[s].sons[o].sons.splice(pos,1);
                              return true
                             }
                             else{
                               if(this.newaccounts[i].sons[s].sons[o].sons[f].sons != undefined){

                                if(this.newaccounts[i].sons[s].sons[o].sons[f].sons.length > 0){
                                  for (let q = 0; q < this.newaccounts[i].sons[s].sons[o].sons[f].sons.length; q++) {
                                    if(this.newaccounts[i].sons[s].sons[o].sons[f].sons[q].account_code == code){
                                      let pos = q;
                                      this.newaccounts[i].sons[s].sons[o].sons[f].sons.splice(pos,1);
                                      return true
                                    } 
                                  }
                                }

                               }
                             }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }            
          }
        }
      }
    }
  }
  return false;
  }
 //Deletes an account from the treeaccounts array
  removeTreeArray(code : any){    
    for (let j = 0; j < this.treeaccounts.length; j++) {
      if(this.treeaccounts[j].id == code){
        let pos = j;
        this.treeaccounts.splice(pos,1);
        this.height = this.treeaccounts.length;
        this.tree.treeModel.update();
        return true;
      }
      else{
        if(this.treeaccounts[j].children != undefined){

          if(this.treeaccounts[j].children.length > 0){
            for (let k = 0; k < this.treeaccounts[j].children.length; k++) {
              if(this.treeaccounts[j].children[k].id == code){
                let pos = k;
                this.treeaccounts[j].children.splice(pos,1);               
                this.height = this.treeaccounts.length;
                this.tree.treeModel.update();
                return true;               
              }
              else{
                if(this.treeaccounts[j].children[k].children != undefined){

                  if(this.treeaccounts[j].children[k].children.length > 0){

                      for (let r = 0; r < this.treeaccounts[j].children[k].children.length; r++) {
                        if(this.treeaccounts[j].children[k].children[r].id == code){
                          let pos = r;
                          this.treeaccounts[j].children[k].children.splice(pos,1); 
                          this.height = this.treeaccounts.length;
                          this.tree.treeModel.update();
                          return true;
                        }
                        else{
                          if( this.treeaccounts[j].children[k].children[r].children != undefined){

                            if( this.treeaccounts[j].children[k].children[r].children.length >0){

                              for (let u = 0; u <  this.treeaccounts[j].children[k].children[r].children.length; u++) {
                                if(this.treeaccounts[j].children[k].children[r].children[u].id == code){
                                  let pos = u;
                                  this.treeaccounts[j].children[k].children[r].children.splice(pos,1);
                                  this.height = this.treeaccounts.length;
                                  this.tree.treeModel.update();
                                  return true;                                  
                                }else{
                                  if(this.treeaccounts[j].children[k].children[r].children[u].children != undefined){
                                    for (let m = 0; m < this.treeaccounts[j].children[k].children[r].children[u].children.length; m++) {
                                      if(this.treeaccounts[j].children[k].children[r].children[u].children[m].id == code){
                                        let pos = m;
                                        this.treeaccounts[j].children[k].children[r].children[u].children.splice(pos,1);
                                        this.height = this.treeaccounts.length;
                                        this.tree.treeModel.update();
                                        return true; 
                                      } 
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }  
                      }
                  }
                } 
              }    
            }
          }
        }
      } 
    }
    return false;
  }
  //Changes the account type for the father accounts
  changeAccountType(type : any){ 
    if(type == undefined){
      this.newAccount.account_type = "";
      this.cleanCheckBoxes();
    }
    else{
       if(this.newAccount.account_type === type){
         this.newAccount.account_type = "";
         this.cleanCheckBoxes();
       }
       else{
          switch (type) {
            case "activo":
              this.newAccount.account_type = type;
              this.chpass = true;
              this.chpm = true;
              this.ching = true;
              this.chgast = true; 
              this.chcost = true;
              break;
            case "pasivo":
              this.newAccount.account_type = type;
              this.chact = true;
              this.chpm = true;
              this.chpm = true;
              this.ching = true;
              this.chgast = true; 
              this.chcost = true;
              break;
            case "patrimonio_neto":
              this.newAccount.account_type = type;
              this.chact = true;
              this.chpass = true;
              this.ching = true;
              this.chcost = true;
              this.chgast = true; 
              break;
            case "otros_patrimonio":
              this.newAccount.account_type = type;
              this.chcp = true;
              break;
            case "capital_contable":
              this.newAccount.account_type = type;
              this.chop = true;
              break;
            case "ingreso":
              this.newAccount.account_type = type;
              this.chact = true;
              this.chpm = true;
              this.chpass = true;
              this.chcost = true;
              this.chgast = true; 
              break;
            case "gastos":
              this.newAccount.account_type = type;
              this.chact = true;
              this.chpm = true;
              this.chpass = true;
              this.ching = true;
              this.chcost = true;
              break;
            case "costos":
              this.newAccount.account_type = type;
              this.chact = true;
              this.chpm = true;
              this.chpass = true;
              this.ching = true;
              this.chgast = true; 
              break;
            case "activo_corriente":
              this.newAccount.account_type = type;
              this.chactnc = true;
              this.choact = true;
              break;
            case "activo_no_corriente":
              this.newAccount.account_type = type;
              this.chactc = true;
              this.choact = true;
              break;
            case "otros_activo":
              this.newAccount.account_type = type;
              this.chactc = true;
              this.chactnc = true;
              break;
            case "pasivo_corriente":
              this.newAccount.account_type = type;
              this.chpassnc = true;
              this.chopass = true;
              break;
            case "pasivo_no_corriente":
              this.newAccount.account_type = type;
              this.chpassc = true;
              this.chopass = true;
              break;
            case "otros_pasivo": 
              this.newAccount.account_type = type;
              this.chpassc = true;
              this.chpassnc = true;
              break;
            default:
              break;
          }
       }
    }

  }
  //Changes the father account
  changeFatherAccount(father : any){
    if(father == undefined){
      this.newAccount.id_father = "";
      this.cleanCheckBoxes();
      this.createInitialTypes();
    }
    else{
      this.newAccount.id_father = father.account_code;
      this.createSecondTypes(father.account_type);
    }
  }
  //Charge the mains types for the account
  createInitialTypes(){
    this.divprima = true;
    this.divprima2 = false;
    this.divsecondact = false;
    this.divsecondact2 = false;
    this.divsecondpass2 = false;
    this.divsecondpass = false;
    this.divsecondpm2 = false;
    this.divsecondpm = false;
    this.divthird = false;
  }
  //Creates the second types for the accounts
  createSecondTypes(at : string){
    this.cleanCheckBoxes();
    this.divprima = false;
    this.divprima2 = false;
    if(at === "activo"){
      this.divsecondact2 = true;
      this.divsecondact = false;
      this.divsecondpass = false;
      this.divsecondpass2 = false;
      this.divsecondpm = false;
      this.divsecondpm2 = false;
    }
    else if(at === "pasivo"){
      this.divsecondpass2 = true;
      this.divsecondpass = false;
      this.divsecondpm2 = false;
      this.divsecondpm = false;
      this.divsecondact = false;
      this.divsecondact2 = false;
    }
    else if(at === "patrimonio_neto"){
      this.divsecondpm2= true;
      this.divsecondpm = false;
      this.divsecondact = false;
      this.divsecondact2 = false;
      this.divsecondpass = false;
      this.divsecondpass2 = false;
    }
    else if(at === "ingreso"){
      this.divsecondact2 = false;
      this.divsecondact = false;
      this.divsecondpass = false;
      this.divsecondpass2 = false;
      this.divsecondpm = false;
      this.divsecondpm2 = false;
      this.divthird = true;
      this.acctype = "Ingresos"
      this.newAccount.account_type = "ingreso";
    }
    else if(at === "gastos"){
      this.divsecondact2 = false;
      this.divsecondact = false;
      this.divsecondpass = false;
      this.divsecondpass2 = false;
      this.divsecondpm = false;
      this.divsecondpm2 = false;
      this.divthird= true;
      this.acctype = "Gastos"
      this.newAccount.account_type = "gastos";
    }
    else if(at === "costos"){
      this.divsecondact2 = false;
      this.divsecondact = false;
      this.divsecondpass = false;
      this.divsecondpass2 = false;
      this.divsecondpm = false;
      this.divsecondpm2 = false;
      this.divthird = true;
      this.acctype = "Costos"
      this.newAccount.account_type = "costos";
    }
    else{
      this.createThirdType(at);
    }
  }
  //Creates the divthird types for the accounts
  createThirdType(at : string){
    this.divthird= true;
    this.divsecondact2 = false;
    this.divsecondact = false;
    this.divsecondpass = false;
    this.divsecondpass2 = false;
    this.divsecondpm = false;
    this.divsecondpm2 = false;
    switch (at) {
      case "activo_corriente":
        this.acctype = "Activo corriente"
        this.newAccount.account_type = "activo_corriente";
        break;
      case "activo_no_corriente":
        this.acctype = "Activo no corriente"
        this.newAccount.account_type = "activo_no_corriente";
        break;
      case "otros_activo":
        this.acctype = "Otros activos"
        this.newAccount.account_type = "otros_activo";
        break;
      case "pasivo_corriente":
        this.acctype = "Pasivo corriente"
        this.newAccount.account_type = "pasivo_corriente";
        break;
      case "pasivo_no_corriente":
        this.acctype = "Pasivo no corriente"
        this.newAccount.account_type = "pasivo_no_corriente";
        break;
      case "otros_pasivo":
        this.acctype = "Otros pasivos"
        this.newAccount.account_type = "otros_pasivo";
        break;
      case "capital_contable":
        this.acctype = "Capital contable";
        this.newAccount.account_type = "capital_contable";
        break;
      case "otros_patrimonio":
        this.acctype = "Otros patrimonios";
        this.newAccount.account_type = "otros_patrimonio";
        break;
      default:
        break;
    }
  }
  //Validates the account data
  validateData(account :newAccount){
    if(account.account_name == "" || account.account_name == undefined){
      this.showerror = true;
      this.messageerror = "Debe agregar un nombre de cuenta valido."
      return false;
    }
    if(account.account_type == "" || account.account_type == undefined){
      this.showerror = true;
      this.messageerror = "Debe agregar un tipo de cuenta valido."
      return false;
    }
    if(account.account_code == "" || account.account_code == undefined){
      this.showerror = true;
      this.messageerror = "Debe de agregar un código a la cuenta."
      return false;
    }
    if(this.validCode(account.account_code)){
      this.showerror = true;
      this.messageerror = "El código de cuenta debe ser único."
      return false;
    }
    if(account.account_type == "" || account.account_type == undefined){
      this.showerror = true;
      this.messageerror = "Debe escoger un tipo valido de cuenta."
      return false;
    }
    if(account.id_client != 0  && account.id_provider != 0){
      this.showerror = true;
      this.messageerror = "No puede seleccionar un cliente y un proveedor al mismo tiempo.";
      return false;
    }
    if(account.classification == "" || account.classification == undefined){
      this.showerror = true;
      this.messageerror = "Debe agregar una titulación a la cuenta.";
      return false;
    }
    else{
      return true;
    }

  }
  //Validates if the account code is unique
  validCode(code : any){
    for (let i = 0; i < this.newaccounts.length; i++) {
      if(this.newaccounts[i].account_code == code){        
          return true;
      }
      else{
        if(this.newaccounts[i].sons != undefined){

          if(this.newaccounts[i].sons.length > 0){

            for (let s = 0; s < this.newaccounts[i].sons.length; s++) {
              if( this.newaccounts[i].sons[s].account_code == code){               
                return true;
              }
              else{
                if(this.newaccounts[i].sons[s].sons != undefined){

                  if(this.newaccounts[i].sons[s].sons.length > 0){
     
                    for (let o = 0; o < this.newaccounts[i].sons[s].sons.length; o++) {
                      if(this.newaccounts[i].sons[s].sons[o].account_code ==code){                       
                        return true;
                      }
                      else{
                        if(this.newaccounts[i].sons[s].sons[o].sons != undefined){

                          if(this.newaccounts[i].sons[s].sons[o].sons.length > 0){
             
                            for (let f = 0; f < this.newaccounts[i].sons[s].sons[o].sons.length; f++) {
                               if(this.newaccounts[i].sons[s].sons[o].sons[f].account_code == code){      
                                return true;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }            
            }
          }
        }
      }
    }
    return false;
  }


}


