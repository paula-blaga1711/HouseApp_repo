import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../app/services/request.service';
import { environment } from 'src/environments/environment';
import { Router } from "@angular/router";
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  token = ''

  users: any = {
    value: [],
    message: "",
    error: "",
  }

  user: any = {
    value: [],
    message: "",
    error: "",
  }

  id = '';

  constructor(private requestService: RequestService, private router: Router) {
    this.token = localStorage.getItem('id_token');
  }

  ngOnInit() {
    this.getUsers();
  }


  getUsers() {
    return this.requestService.requestGet(`${environment.apiUrl}/users`, this.users, "users", { "Authorization": `Bearer ${this.token}` }, () => {
      this.users.value.reverse();
    });
  }

  deleteUser() {
    return this.requestService.requestPut(`${environment.apiUrl}/users/delete/${this.id}`, this.users, "users", { "Authorization": `Bearer ${this.token}` }, () => {
      this.getUsers()
    });
  }


  geUserId(user) {

    this.id = user._id;

  }

  getUserById() {
    return this.requestService.requestGet(`${environment.apiUrl}/users/${this.id}`, this.user, "user", { "Authorization": `Bearer ${this.token}` });
  }

  updateUser(user) {
    this.router.navigateByUrl('dashboard/user-list/' + user._id);
  }
}
