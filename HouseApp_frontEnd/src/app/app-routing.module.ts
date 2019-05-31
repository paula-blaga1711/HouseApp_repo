import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ListComponent } from './list/list.component';
import { PostComponent } from './post/post.component';
import { OrderComponent } from './order/order.component';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { DialogComponent } from './dialog/dialog.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { DashpanalComponent } from './dashboard/dashpanal/dashpanal.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { HouseListComponent } from './dashboard/house-list/house-list.component';
import { CreateHouseComponent } from './dashboard/create-house/create-house.component';
import { UserListComponent } from './dashboard/user-list/user-list.component';
import { CreateUserComponent } from './dashboard/create-user/create-user.component';
import { UpdateUserComponent } from './dashboard/update-user/update-user.component';
import { HouseDetailComponent } from './dashboard/house-detail/house-detail.component';
import { TagListComponent } from './dashboard/tag-list/tag-list.component';
import { CreateTagComponent } from './dashboard/create-tag/create-tag.component';
import { UpdateHouseComponent } from './dashboard/update-house/update-house.component';



const routes: Routes = [

  { path: 'home', component: HomeComponent },
  { path: 'list', component: ListComponent },
  { path: 'post', component: PostComponent },
  { path: 'list/:_id', component: PostComponent },

  { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard', canActivate: [AuthGuard], component: DashpanalComponent,
    children: [

      { path: 'home-dashboard', component: DashboardHomeComponent },
      { path: 'house-list', component: HouseListComponent },
      { path: 'house-list/:_id', component: HouseDetailComponent },
      { path: 'house-list/modify/:_id', component: UpdateHouseComponent },
      { path: 'create-house', component: CreateHouseComponent },

      { path: 'user-list', component: UserListComponent },
      { path: 'create-user', component: CreateUserComponent },
      { path: 'user-list/:_id', component: UpdateUserComponent },

      { path: 'tag-list', component: TagListComponent },
      { path: 'create-tag', component: CreateTagComponent },

      { path: "**", component: DashboardHomeComponent },
    ]
  },
  { path: "**", component: HomeComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [HomeComponent, DashpanalComponent, DashboardHomeComponent, LoginComponent, ListComponent, PostComponent, OrderComponent, DialogComponent, PageNotFoundComponent,
  ProfileComponent
]
