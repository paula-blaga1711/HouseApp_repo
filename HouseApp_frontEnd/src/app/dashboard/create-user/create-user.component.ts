import { Component, OnInit } from '@angular/core';

import { RequestService } from '../../../app/services/request.service';
import { environment } from 'src/environments/environment';
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  token = ''

  gender = '';
  confirm_password = '';


  validation: boolean;
  errorMessages = [];

  new_user: any = {
    value: [],
    message: "",
    error: "",
  }

  create_user = {

    name: '',
    gender: '',
    email: '',
    password: '',


  }

  constructor(private requestService: RequestService, private router: Router) { }

  ngOnInit() {

    this.token = localStorage.getItem('id_token');

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

  postUser() {

    let body = this.create_user;

    if (body.gender === '') {
      body.gender = 'altele'
    } else body.gender = this.gender;



    console.log(body);

    if (this.checkBody(body) === false)
      return;

    return this.requestService.requestPost(`${environment.apiUrl}/users`, this.new_user, body, { "Authorization": `Bearer ${this.token}` },
      () => {
        if (this.new_user.message) {
          setTimeout(() => {
            this.router.navigate(['dashboard/user-list']);
          }, 1500);
        }
      },

    );
  }

}
