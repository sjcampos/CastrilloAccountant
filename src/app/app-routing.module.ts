import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { AuthAdminGuard } from './guard/admin/auth-admin.guard';
import { AuthManagerGuard } from './guard/manager/auth-manager.guard';
import { AuthCollaGuard } from './guard/colla/auth-colla.guard';
import { AuthClientGuard } from './guard/client/auth-client.guard';
import { AuthreportsGuard } from './guard/reports/authreports.guard';

import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';
import { LoginComponent } from './components/login/login.component';
import { ClientsViewComponent } from './components/clients/clients-view/clients-view.component';
import { ClientsFormComponent } from './components/clients/clients-form/clients-form.component';
import { CompanyViewComponent } from './components/company/company-view/company-view.component';
import { CompanyFormComponent } from './components/company/company-form/company-form.component';
import { ProviderFormComponent } from './components/providers/provider-form/provider-form.component';
import { ProviderViewComponent } from './components/providers/provider-view/provider-view.component';
import { CollaboratorViewComponent } from './components/collaborators/collaborator-view/collaborator-view.component';
import { CollaboratorFormComponent } from './components/collaborators/collaborator-form/collaborator-form.component';
import { AccountsViewComponent } from './components/accounts/accounts-view/accounts-view.component';
import { CompanyCollabComponent } from './components/company-collab/company-collab.component';
import { ExistingAccountsComponent } from './components/accounts/existing-accounts/existing-accounts.component';
import { RolViewComponent } from "./components/roles/rol-view/rol-view.component";
import { CompaniesResetComponent } from './components/resetpassword/companies-reset/companies-reset.component';
import { CollaboratorsResetComponent } from './components/resetpassword/collaborators-reset/collaborators-reset.component';
import { UserresetComponent } from './components/resetpassword/userreset/userreset.component';
import { ForgotpasswordComponent } from './components/resetpassword/forgotpassword/forgotpassword.component';
import { ManagerNavbarComponent } from './components/manager-navbar/manager-navbar.component';
import { CompanyAccountingComponent } from './components/company-accounting/company-accounting.component';
import { AccountingEntriesComponent } from './components/accounting-entries/accounting-entries.component';
import { AccountantDashboardComponent } from './components/accountant-dashboard/accountant-dashboard.component';
import { CollaboratorNavbarComponent } from './components/collaborator-navbar/collaborator-navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { ClientNavbarComponent } from './components/client-navbar/client-navbar.component';
import { ClientReportsComponent } from './components/client-reports/client-reports.component';
import { ClientMeetingComponent } from './components/client-meeting/client-meeting.component';
import { ManagerGeneratereportsComponent } from './components/manager-generatereports/manager-generatereports.component';
import { MenuReportsComponent } from './components/reports/menu-reports/menu-reports.component';
import { BGCViewComponent } from './components/reports/bgc-view/bgc-view.component';
import { EriViewComponent } from './components/reports/eri-view/eri-view.component';
import { BxcViewComponent } from './components/reports/bxc-view/bxc-view.component';
import { CxcViewComponent } from './components/reports/cxc-view/cxc-view.component';
import { CxpViewComponent } from './components/reports/cxp-view/cxp-view.component';
import { VtsViewComponent } from './components/reports/vts-view/vts-view.component';
import { AscViewComponent } from './components/reports/asc-view/asc-view.component';
import { ClixempViewComponent } from './components/reports/clixemp-view/clixemp-view.component';
import { ProxempViewComponent } from './components/reports/proxemp-view/proxemp-view.component';
import { ProyViewComponent } from './components/reports/proy-view/proy-view.component';
import { NotAccessComponent } from './components/not-access/not-access.component';

  


const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'admindashboard', component:AdminDashboardComponent , canActivate:[AuthAdminGuard]},
  {path: 'managerdashboard', component:ManagerDashboardComponent ,canActivate:[AuthManagerGuard]},
  {path:'accountantdashboard', component:AccountantDashboardComponent ,canActivate:[AuthCollaGuard]},
  {path: 'managernav', component:ManagerNavbarComponent ,canActivate:[AuthManagerGuard]},
  {path: 'mainnav', component:MainNavbarComponent, canActivate:[AuthAdminGuard]},
  {path:'collabnav', component:CollaboratorNavbarComponent ,canActivate:[AuthCollaGuard]},
  {path: 'clientnav', component:ClientNavbarComponent, canActivate:[AuthClientGuard]},
  {path: 'clientdashboard', component:ClientDashboardComponent,canActivate:[AuthClientGuard]},
  {path: 'login', component:LoginComponent},
  //NOT FOUND
  {path:'404', component:NotFoundComponent},
  {path:'not-access', component:NotAccessComponent},
  //Clients routes
  {path: 'clientslist/:slug', component:ClientsViewComponent, canActivate:[AuthAdminGuard]},
  {path: 'clientsform/:slug', component:ClientsFormComponent, canActivate:[AuthAdminGuard]},
  {path: 'clientsform/edit/:id/:slug', component:ClientsFormComponent, canActivate:[AuthAdminGuard]},
  //Company routes
  {path: 'companylist', component:CompanyViewComponent ,canActivate:[AuthAdminGuard]},
  {path: 'companyform', component:CompanyFormComponent, canActivate:[AuthAdminGuard]},
  {path: 'companyform/edit/:id', component:CompanyFormComponent, canActivate:[AuthAdminGuard]},
  //Provider routes
  {path: 'providerlist/:slug', component:ProviderViewComponent, canActivate:[AuthAdminGuard]},
  {path: 'providerform/:slug', component:ProviderFormComponent, canActivate:[AuthAdminGuard]},
  {path: 'providerform/edit/:id/:slug', component:ProviderFormComponent, canActivate:[AuthAdminGuard]},
  //Collaborators routes
  {path: 'collaboratorlist', component:CollaboratorViewComponent,canActivate:[AuthAdminGuard]},
  {path: 'collaboratorform', component:CollaboratorFormComponent, canActivate:[AuthAdminGuard]},
  {path: 'collaboratorform/edit/:id', component:CollaboratorFormComponent, canActivate:[AuthAdminGuard]},
  //Accounts routes
  {path: 'accountslist/:slug', component:AccountsViewComponent, canActivate:[AuthAdminGuard]},
  {path: 'accountsview/:slug', component:ExistingAccountsComponent, canActivate:[AuthAdminGuard]},
  //Company collaborators routes
  {path: 'companycollaborators/:id',component:CompanyCollabComponent, canActivate:[AuthAdminGuard]},
  //Roles routes
  {path: 'rolesview', component:RolViewComponent, canActivate:[AuthAdminGuard]},
  //Reset password routes
  {path:'reset/companies', component:CompaniesResetComponent, canActivate:[AuthAdminGuard]},
  {path:'reset/collaborators', component:CollaboratorsResetComponent, canActivate:[AuthAdminGuard]},
  {path:'reset/user/:id/:co', component:UserresetComponent},
  {path: 'reset/user', component:ForgotpasswordComponent},
  //Company accounting
  {path: 'company/manager/accounting', component:CompanyAccountingComponent, canActivate:[AuthManagerGuard]},
  {path: 'company/accounting/:filter',component:CompanyAccountingComponent ,canActivate:[AuthCollaGuard]}, //Revisar navbar de colaborador
  {path: 'accountingentries/:slug', component:AccountingEntriesComponent, canActivate:[AuthManagerGuard]},
  {path: 'accountingentries/collaborator/:slug', component:AccountingEntriesComponent, canActivate:[AuthCollaGuard]},
  //Client
  {path: 'reportrequest',component:ClientReportsComponent, canActivate:[AuthClientGuard]},
  {path: 'meetingrequest', component:ClientMeetingComponent, canActivate:[AuthClientGuard]},
  //manager
  {path: 'generatereport/:slug/:description/:date_application/:id_application', component:ManagerGeneratereportsComponent,  canActivate:[AuthManagerGuard]},
  //reports
  {path: 'reportmenu', component:MenuReportsComponent,canActivate:[AuthreportsGuard]}, //falta guard
  {path: 'reportbgc', component:BGCViewComponent,canActivate:[AuthreportsGuard]},
  {path: 'reporteri', component:EriViewComponent,canActivate:[AuthreportsGuard] },
  {path: 'reportbxc' , component:BxcViewComponent,canActivate:[AuthreportsGuard]},
  {path: 'reportcxc' , component:CxcViewComponent,canActivate:[AuthreportsGuard]},
  {path: 'reportcxp' , component:CxpViewComponent,canActivate:[AuthreportsGuard]},
  {path: 'reportvts' , component:VtsViewComponent,canActivate:[AuthreportsGuard]},
  {path: 'reportasc' , component:AscViewComponent,canActivate:[AuthreportsGuard]},
  {path: 'reportclixc' , component:ClixempViewComponent,canActivate:[AuthreportsGuard]},
  {path: 'reportproxc' , component:ProxempViewComponent,canActivate:[AuthreportsGuard]},
  {path: 'reportproy' , component:ProyViewComponent,canActivate:[AuthreportsGuard]}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
        this.router.navigate(['404']); // or redirect to default route
    }
  }
}
