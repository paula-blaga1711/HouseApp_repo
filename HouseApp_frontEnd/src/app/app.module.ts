import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { ListComponent } from './list/list.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';

import { MatCardModule } from '@angular/material';
import { PostComponent } from './post/post.component';
import { AuthService } from './auth.service';
import { NavbarComponent } from './navbar/navbar.component';
import { ImobileService } from './imobile.service';
import { OrderComponent } from './order/order.component';
import { AuthGuardService } from './auth-guard.service';

import { DialogComponent } from './dialog/dialog.component';

import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PageNotFoundTwoComponent } from './page-not-found-two/page-not-found-two.component';
import { ProfileComponent } from './profile/profile.component';

import { FormsModule } from '@angular/forms';


import { HttpClientModule } from '@angular/common/http';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';

import { DashpanalComponent } from './dashboard/dashpanal/dashpanal.component';
import { HouseListComponent } from './dashboard/house-list/house-list.component';
import { CreateHouseComponent } from './dashboard/create-house/create-house.component';
import { UserListComponent } from './dashboard/user-list/user-list.component';
import { UpdateUserComponent } from './dashboard/update-user/update-user.component';
import { CreateUserComponent } from './dashboard/create-user/create-user.component';
import { TagListComponent } from './dashboard/tag-list/tag-list.component';
import { CreateTagComponent } from './dashboard/create-tag/create-tag.component';
import { HouseDetailComponent } from './dashboard/house-detail/house-detail.component';
import { FooterComponent } from './footer/footer.component';
import { UpdateHouseComponent } from './dashboard/update-house/update-house.component';




@NgModule({
  declarations: [

    AppComponent,
    routingComponents,
    LoginComponent,
    ListComponent,
    PostComponent,
    NavbarComponent,
    OrderComponent,
    DialogComponent,
    PageNotFoundComponent,
    PageNotFoundTwoComponent,
    ProfileComponent,
    DashboardHomeComponent,
    DashpanalComponent,
    HouseListComponent,
    CreateHouseComponent,
    UserListComponent,
    UpdateUserComponent,
    CreateUserComponent,
    TagListComponent,
    CreateTagComponent,
    HouseDetailComponent,
    FooterComponent,
    UpdateHouseComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatCardModule,
    MatDialogModule,
    FormsModule,
    HttpClientModule,
  ],

  entryComponents: [
    DialogComponent,
  ],

  providers: [AuthService, ImobileService, AuthGuardService, NgbModalConfig, NgbModal],
  bootstrap: [AppComponent]
})
export class AppModule { }
