import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../app/services/request.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {

  token = '';

  myself = {
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
