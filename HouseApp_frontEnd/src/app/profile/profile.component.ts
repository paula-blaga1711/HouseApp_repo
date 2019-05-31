import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';

import { RequestService } from '../../app/services/request.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  token = '';

  myself: any = {
    value: [],
    message: "",
    error: "",
  }

  constructor(private requestService: RequestService) { }

  ngOnInit() {
    this.token = localStorage.getItem('id_token');
    this.getMyself()
  }

  getMyself() {
    return this.requestService.requestGet(`${environment.apiUrl}/users/myself`, this.myself, "user", { "Authorization": `Bearer ${this.token}` });
  }


}