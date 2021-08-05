import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {NgxPaginationModule} from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { TreeModule } from '@circlon/angular-tree-component';
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { DpDatePickerModule } from 'ng2-date-picker';
import { ChartsModule } from 'ng2-charts';

import { HttpConfigInterceptor} from './interceptor/httpconfig.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';
import { LoginComponent } from './components/login/login.component';

import { ClientsFormComponent } from './components/clients/clients-form/clients-form.component';
import { ClientsViewComponent } from './components/clients/clients-view/clients-view.component';
import { CompanyViewComponent } from './components/company/company-view/company-view.component';
import { CompanyFormComponent } from './components/company/company-form/company-form.component';
import { ProviderViewComponent } from './components/providers/provider-view/provider-view.component';
import { ProviderFormComponent } from './components/providers/provider-form/provider-form.component';
import { CollaboratorViewComponent } from './components/collaborators/collaborator-view/collaborator-view.component';
import { CollaboratorFormComponent } from './components/collaborators/collaborator-form/collaborator-form.component';
import { AccountsViewComponent } from './components/accounts/accounts-view/accounts-view.component';
import { CompanyCollabComponent } from './components/company-collab/company-collab.component';
import { ExistingAccountsComponent } from './components/accounts/existing-accounts/existing-accounts.component';
import { RolViewComponent } from './components/roles/rol-view/rol-view.component';
import { CompaniesResetComponent } from './components/resetpassword/companies-reset/companies-reset.component';
import { CollaboratorsResetComponent } from './components/resetpassword/collaborators-reset/collaborators-reset.component';
import { UserresetComponent } from './components/resetpassword/userreset/userreset.component';
import { ForgotpasswordComponent } from './components/resetpassword/forgotpassword/forgotpassword.component';
import { ManagerNavbarComponent } from './components/manager-navbar/manager-navbar.component';
import { CompanyAccountingComponent } from './components/company-accounting/company-accounting.component';
import { AccountingEntriesComponent } from './components/accounting-entries/accounting-entries.component';
import { AccountantDashboardComponent } from './components/accountant-dashboard/accountant-dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CollaboratorNavbarComponent } from './components/collaborator-navbar/collaborator-navbar.component';
import { ClientNavbarComponent } from './components/client-navbar/client-navbar.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
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




@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    ManagerDashboardComponent,
    MainNavbarComponent,
    LoginComponent,
    ClientsFormComponent,
    ClientsViewComponent,
    CompanyViewComponent,
    CompanyFormComponent,
    ProviderViewComponent,
    ProviderFormComponent,
    CollaboratorViewComponent,
    CollaboratorFormComponent,
    AccountsViewComponent,
    CompanyCollabComponent,
    ExistingAccountsComponent,
    RolViewComponent,
    CompaniesResetComponent,
    CollaboratorsResetComponent,
    UserresetComponent,
    ForgotpasswordComponent,
    ManagerNavbarComponent,
    CompanyAccountingComponent,
    AccountingEntriesComponent,
    AccountantDashboardComponent,
    NotFoundComponent,
    CollaboratorNavbarComponent,
    ClientNavbarComponent,
    ClientDashboardComponent,
    ClientReportsComponent,
    ClientMeetingComponent,
    ManagerGeneratereportsComponent,
    MenuReportsComponent,
    BGCViewComponent,
    EriViewComponent,
    BxcViewComponent,
    CxcViewComponent,
    CxpViewComponent,
    VtsViewComponent,
    AscViewComponent,
    ClixempViewComponent,
    ProxempViewComponent,
    ProyViewComponent,
    NotAccessComponent,

  
  ],
  imports: [
    TreeModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    Ng2SearchPipeModule,
    DpDatePickerModule, 
    ChartsModule,
    
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
