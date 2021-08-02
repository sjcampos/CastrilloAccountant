import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2';
//services
import { AccountServiceService } from '../../services/accounts/account-service.service';
import { StorageServiceService } from '../../services/localstorage/storage-service.service';
import { EntryServiceService } from '../../services/entry/entry-service.service';
//models
import { newAccount } from '../../models/newAccount.model';
import { entries } from "../../models/entries.model";


@Component({
  selector: 'app-accounting-entries',
  templateUrl: './accounting-entries.component.html',
  styleUrls: ['./accounting-entries.component.css']
})
export class AccountingEntriesComponent implements OnInit {

  showerror : boolean = false;
  messageerror : string = "";
  showerrorconfirm : boolean = false;
  messageerrorconfirm : string = "";
  dateObj : any;
  slug: string;
  iduser : number = 0;
  existingaccounts : any = [];
  accountModel : newAccount;
  currencytype: boolean = false;
  //checkboxes
  chdb : boolean = false;
  chhb : boolean = false;
  chcol : boolean = false;
  chdol : boolean = false;
  //div
  divasi1 : boolean = true;
  divasi2 : boolean = false;

  divchange1: boolean = true;
  divchange2: boolean = false;

  typechange : boolean = false;
  dateinput : boolean = false;
  detailinput : boolean = false;
  
  p : number  = 1;

  totaldebe : number = 0;
  totalhaber : number = 0;

  loadinginit : boolean = false;
  showform : boolean = true;

  seals : any = [];

  entry : entries = {
      id_account : 0 ,
      id_collaborator : this.iduser,
      pk : 0,
      register_date : new Date(),
      details : "",
      amount : 0,
      type_currency : 0,
      money_chance : 0,
      period : 0,
      fiscal_year : 0
  };

  constructor(private accountService : AccountServiceService,private router: Router, private activedRoute: ActivatedRoute, private storageService : StorageServiceService,
    private entryService :EntryServiceService) { }

  ngOnInit(): void {
    const params = this.activedRoute.snapshot.params;
    if(params.slug){
      this.slug = params.slug;
      let t = localStorage.getItem('UD');
      if(t != null){
        let tempid = this.storageService.decryptData(t!) ;
        this.iduser = Number.parseInt(tempid!);
        this.entry.id_collaborator = this.iduser;
        this.getAccounts(this.slug);
      }else{
        this.router.navigate(['company/manager/accounting']);
      }
    }
    else{
      this.router.navigate(['company/manager/accounting']);
    }
    
  }
  //registers the entries on the db
  registerEntries(){
    let timeoutId;
    if(this.entry.type_currency == 0 || this.entry.type_currency == undefined || this.entry.type_currency == null){
      Swal.fire(
        'Error al registrar asiento',
        'Debe seleccionar un tipo para registrar el asiento.',
        'error'
      )
    }
    if(this.entry.details == null || this.entry.details == "" || this.entry.details == undefined){
      Swal.fire(
        'Error al registrar asiento',
        'Debe ingresar un detalle para el asiento.',
        'error'
      )
    }else{
      if(this.totalhaber == this.totaldebe){
        if(this.seals.length > 0 && this.seals.length > 1){
          this.loadinginit = true;
          this.showform = false;
          
          this.entryService.registerEntries(this.slug, this.seals).subscribe(
            res =>{
              if(res != null){
                timeoutId = setTimeout(() =>{
                  this.loadinginit = false;
                  Swal.fire({
                    title: 'Registro de asiento',
                    text: 'Registro de movimientos completado de manera exitosa.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.router.navigate([`/company/manager/accounting`]);
                    } 
                  })
                },860)
              }
            }, error => {
              console.log(error);
              Swal.fire({
                title: 'Registro de asiento',
                text: 'No se pudo registrar los movimientos de manera exitosa, por favor intente de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.loadinginit = false;
                  this.showform = true;
                } 
              })
  
            }  
            /*Swal.fire(
              'Error al eliminar la cuenta seleccionada',
              error.error.message,
              'error'
            )*/
          )
        }
        else{
          Swal.fire(
            'Error al registrar asiento',
            'Debe registrar más de un movimiento.',
            'error'
          )
          
        }     
      }
      else{
        Swal.fire(
          'Error al registrar asiento',
          'Los montos totales del debe y haber no son iguales.',
          'error'
        )
  
      }

    }

  }
  //Deletes an entry from the seals array
  async deleteEntry(e : any){
    if(this.seals.includes(e)){
      let pos = this.seals.indexOf(e);
      this.seals.splice(pos,1); 
      this.subtractTotal(e);
    }
    
  
  }
  //Gets all the accounts of a company
  getAccounts(slug: string){
    let filter = "affected";
    this.accountService.getAccounts(slug, filter).subscribe(
      res=>{
        let temp : any = [];
        temp = res;
        for (let i = 0; i < temp.accounts.length; i++) {
          if(temp.accounts[i].classification == "afectable"){
            this.existingaccounts.push(temp.accounts[i]);
          }
        }
      }
    );
  }
  //Selects the id account for the entry
  selectAccount(a : any){
    console.log(a);
    if(a != undefined){
      if(this.entry.id_account == 0){
        this.entry.id_account = a.id_account;
        this.entry.account_name = a.account_name;
      }
      else if(this.entry.id_account != 0){
        this.entry.id_account = a.id_account;
        this.entry.account_name = a.account_name;
      }
      else{
        this.entry.id_account = 0;
        this.entry.account_name = "";
      }
      console.log(this.entry.id_account);
      console.log(this.entry.account_name);
    }
    else{
      this.entry.id_account = 0;
      this.entry.account_name = "";
    }
  }
  //Changes the currency type
  changeCurrency(c : number){
    this.checkBoxesCurrency(c);
    if(this.entry.type_currency == 0){
      this.entry.type_currency = c;
    }
    else{
      this.entry.type_currency = 0;
    }
  }
  //Change the state of the currency checkboxes
  checkBoxesCurrency(c : number){
    if(c == 1){
      if(this.entry.type_currency == 1){
        this.chcol = false;
        this.chdol = false;
        this.currencytype = false;
      }
      else{
        this.chcol = false;
        this.chdol = true;
      }
    }
    else{
      if(this.entry.type_currency == 2){
        this.chcol = false;
        this.chdol = false;
        this.currencytype = false;
      }
      else{
        this.chcol = true;
        this.chdol = false;
        this.currencytype = true;
      }

      
    }
  }
  //Change the pk of the entry
  changeEntryPK(pk : number){
    this.checkBoxes(pk);
    if(this.entry.pk == 0){
      this.entry.pk = pk;
    }
    else{
      this.entry.pk = 0;
    }
  }
  //Change the state of the pk checkboxes
  checkBoxes(pk : number){
      if(pk == 40){
        if(this.entry.pk == 40 ){
          this.chdb = false;
          this.chhb = false;
        }else{
          this.chdb = false;
          this.chhb = true;
        }
      }else{
        if(this.entry.pk == 50){
          this.chdb = false;
          this.chhb = false;
        }
        else{
          this.chdb = true;
          this.chhb = false;
        }

      }
  }
  //disable data inputs
  confirm(){
    if(this.entry.type_currency == 0 || this.entry.type_currency == undefined || this.entry.type_currency == null){
        this.showerrorconfirm = true;
        this.messageerrorconfirm = "Debe seleccionar un tipo de cambio antes de confirmar.";
    }
    if(this.entry.details == null || this.entry.details == "" || this.entry.details == undefined){
      this.showerrorconfirm = true;
      this.messageerrorconfirm = "Debe ingresar un detalle antes de confirmar.";
    }
    else{
      this.showerrorconfirm = false;
      this.messageerrorconfirm = "";
      this.chcol = true;
      this.chdol = true;
      this.typechange = true;
      this.dateinput = true;
      this.detailinput = true;

    }
  }
  //Enable the data inputs
  edit(){
    this.chcol = false;
    this.chdol = false;
    this.typechange = false;
    this.dateinput = false;
    this.detailinput = false;
    if(this.divchange1){
      this.divchange1 = false;
      this.divchange2 = true;
      this.currencytype = false;
      this.entry.money_chance = 0;
      this.entry.type_currency = 0;
    }
    else{
      this.divchange1 = true;
      this.divchange2 = false;
      this.currencytype = false;
      this.entry.money_chance = 0;
      this.entry.type_currency = 0;
    }
  }
  //Adds an entry to the seals array to show it
  addEntry(){
    let date;
    if(this.dateObj == undefined || this.dateObj.value == "" || this.dateObj.value == null){
      date = new Date();
      this.showerror = true;
      this.messageerror = "Debe seleccionar una fecha para el movimiento."
    }
    else{
      date = this.dateObj.value;
      let tempodate = new Date();
      let tempEntry : entries = {
        id_account : this.entry.id_account,
        account_name : this.entry.account_name,
        id_collaborator : this.entry.id_collaborator,
        pk : this.entry.pk,
        register_date : this.entry.register_date,
        account_date: date,
        details: this.entry.details,
        amount : this.entry.amount,
        type_currency : this.entry.type_currency,
        money_chance : this.entry.money_chance,
        period : tempodate.getMonth() + 1,
        fiscal_year : tempodate.getFullYear()
      }
      if(this.validateData(tempEntry)){
          this.seals.push(tempEntry);
          this.addTotal(tempEntry);
          this.cleanForm();
      }
    }
  }
  //subtracts from the total debe and haber the amount of the movement amount
  subtractTotal(e : any){
    if(e.pk == 40){
      this.totaldebe =   this.totaldebe - Number.parseFloat(e.amount);
    }
    else{
      this.totalhaber =  this.totalhaber - Number.parseFloat(e.amount);
    }
  }
  //sum to the total debe and haber the amount of the movement amount
  addTotal(e : any){
    if(e.pk == 40){
      this.totaldebe = Number.parseFloat(e.amount) + this.totaldebe;
    }
    else{
      this.totalhaber = Number.parseFloat(e.amount) + this.totalhaber;
    }
  }
  //cleans the form
  cleanForm(){
    this.entry.id_account = 0;
    this.entry.account_name = "";
    this.entry.pk = 0;
    this.entry.register_date = new Date();
    this.entry.amount = 0;
    this.entry.period = 0;
    this.entry.fiscal_year = 0;
    this.existingaccounts = [];
    this.getAccounts(this.slug);
    this.showerror = false;
    this.messageerror = "";
    this.chdb = false;
    this.chhb = false;
    if(this.divasi1){
      this.divasi1 = false;
      this.divasi2 = true;
    }
    else{
      this.divasi2 = false;
      this.divasi1 = true;
    }


  }
  //validates the data
  validateData(e : entries){
    if(e.id_account == 0){
      this.showerror = true;
      this.messageerror = "Debe escoger una cuenta para realizar un movimiento."
      return false;
    }
    if(e.pk == 0 || e.pk == undefined){
      this.showerror = true;
      this.messageerror = "Debe asignar el movimiento al debe o al haber."
      return false;
    }
    if(e.account_date == undefined || e.account_date == null){
      this.showerror = true;
      this.messageerror = "Debe ingresar una fecha del movimiento."
      return false;
    }
    if(e.details == "" || e.details == undefined || e.details.trim().length == 0){
      this.showerror = true;
      this.messageerror = "Debe ingresar un detalle al movimiento.";
      return false;
    }
    if(e.amount == undefined || e.amount <= 0){
      this.showerror = true;
      this.messageerror = "Debe ingresar un monto válido.";
      return false;
    }else{
      return true;
    }
  }

}
