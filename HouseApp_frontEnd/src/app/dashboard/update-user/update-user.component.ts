import { Component, OnInit } from '@angular/core';

import { RequestService } from '../../../app/services/request.service';
import { environment } from 'src/environments/environment';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  id = '';
  token = ''

  gender = '';
  confirm_password = '';


  validation: boolean;
  errorMessages = [];

  user: any = {

    value: [],
    message: "",
    error: "",

  }

  updated_user: any = {

    value: [],
    message: "",
    error: "",

  }

  update_user = {

    name: '',
    gender: '',
    email: '',
    password: '',

  }

  constructor(private requestService: RequestService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.id = (this.route.snapshot.paramMap.get('_id'));
    this.token = localStorage.getItem('id_token');
    this.getUserById();

  }

  checkBody(body) {

    this.errorMessages = [];

    if (body.password.length < 6) {
      this.errorMessages.push("The password is to short")
      this.validation = false;
    }

    if (body.password !== this.confirm_password && body.password.length >= 6) {
      this.errorMessages.push("Passwords are not the same");
      this.validation = false;
    }

    return this.errorMessages.length === 0;

  }

  getUserById() {
    return this.requestService.requestGet(`${environment.apiUrl}/users/${this.id}`, this.user, "user", { "Authorization": `Bearer ${this.token}` });
  }

  putUser() {

    let body = this.update_user;

    if (body.gender === '') {
      body.gender = 'altele'
    } else body.gender = this.gender;

    if (this.checkBody(body) === false)
      return;

    return this.requestService.requestPost(`${environment.apiUrl}/users`, this.updated_user, body, { "Authorization": `Bearer ${this.token}` },
      () => {
        if (this.updated_user.message) {
          setTimeout(() => {
            this.router.navigate(['dashboard/user-list']);
          }, 1500);
        }
      },

    );
  }

}
