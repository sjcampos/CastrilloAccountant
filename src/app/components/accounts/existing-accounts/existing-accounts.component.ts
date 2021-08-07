import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from "@angular/router";

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
  selector: 'app-existing-accounts',
  templateUrl: './existing-accounts.component.html',
  styleUrls: ['./existing-accounts.component.css']
})
export class ExistingAccountsComponent implements OnInit {

    loading : boolean = false;
    showregister : boolean = false;
    loadinginit : boolean = true;
    p : number = 1;

    //array to insert in db
    newaccounts : any = [];

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

  existingaccounts : any = [];

  showclients : boolean = true;
  showproviders : boolean = true;

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

  client : clients;
  provider : provider;
  
  account_code : any;
  
  accountModel : newAccount;
  accountType : accountType;

  constructor(private accountService : AccountServiceService,private router: Router, private activedRoute: ActivatedRoute,private clientService : ClientServiceService, private providerService : ProviderServiceService) { }

  ngOnInit(): void {
    let timeoutId;
    const params = this.activedRoute.snapshot.params;
    if(params.slug){
      this.slug = params.slug;
      this.getAccounts(this.slug);
      this.getClients(this.slug);
      this.getProviders(this.slug);
      timeoutId = setTimeout(() =>{
          this.loadinginit = false;
          this.showregister = true;  
      },750)
    }
  }
  //Get all the accounts
  getAccounts(slug: string){
    let filter = "all";
    this.accountService.getAccounts(slug,filter).subscribe(
      res=>{
        let temp : any = [];
        temp = res;
        this.existingaccounts = temp.accounts;  
        this.selectaccounts = temp.accounts;
      }
    );  
  }
  //Deletes an existing account
  async deleteAccount(acc : any){
    if(acc.classification == "afectable" && acc.balance == 0){
      await Swal.fire({
        title: 'Eliminar cuenta',
        text: 'Al eliminar esta cuenta no se podra recuperar',
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor:'#0096d2',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          
          this.accountService.deleteAccount(this.slug,acc.id_account).subscribe(
            res=>{
                  if(res != null){
                    this.getAccounts(this.slug);
                    Swal.fire({
                      title:'Error al eliminar la cuenta',
                      text:'La cuenta no ha sido eliminada.',
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      confirmButtonColor:'#0096d2',
                      icon:'success'
                    })
                  }
                  else{
                    Swal.fire({
                      title:'Eliminado',
                      text:'La cuenta ha sido eliminada.',
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      confirmButtonColor:'#0096d2',
                      icon: 'error'
                    })
                  }
            }, error => Swal.fire({
              title:'Error al eliminar la cuenta seleccionada',
              text:error.error.message,
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonColor:'#0096d2',
              icon:'error'
            })
          )  
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title:'Cancelado',
            text:'La cuenta no ha sido eliminado.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor:'#0096d2',
            icon:'error'
          })
        }
      })
    }else{
      Swal.fire({
        title:'Cancelado',
        text:'La cuenta seleccionada no puede ser eliminada. <br> Para eliminar una cuenta debe ser afectable y su balance debe ser igual a 0.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor:'#0096d2',
        icon:'error'
      })
    }


  }
  //Registers a new account
  addAccount(){
    let date;
    if(this.dateObj == undefined){
      date = null;
    }
    else{
      date = this.dateObj.value;
    }
    let fid;
    if(this.newAccount.id_father == undefined){
        fid = "0";
    }
    else{
        fid = this.newAccount.id_father.toString();
    }
    let tempAccount : newAccount={
      id_account: "0",
      id_father:  fid,
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
     
     let accounts : any = [];
     accounts.push(tempAccount);
      this.accountService.registerAccounts(accounts,this.slug).subscribe(
        res=>{
          if(res != null){
            this.existingaccounts = [];
            this.selectaccounts = [];
            this.getAccounts(this.slug);
            this.cleanForm();
          }else{
           
          }
        },
        (err) =>{
         this.showerror = true;
         this.messageerror = err['error']['message'];
        }
      )
   }
  }
  //Filter the accounts by code
  searchAccount(){
    if(this.account_code == ""){
      this.getAccounts(this.slug);
    }
    else{
      this.existingaccounts = this.existingaccounts.filter((res: newAccount) =>{
        return res.account_code?.match(this.account_code)
      });
    }
  }
  //Cleans the account form
  cleanForm(){
    this.getClients(this.slug);
    this.getProviders(this.slug);
    this.showerror = false;
    this.messageerror = "";
    this.newAccount.id_father = "";
    this.newAccount.account_name = "";
    this.newAccount.account_type = "";
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
      this.newAccount.id_father = father.id_account;
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
    for (let i = 0; i < this.existingaccounts.length; i++) {
      if(this.existingaccounts[i].account_code == code){
        return true;
      }
    }
    return false;
  }

}
