import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../app/services/request.service';
import { environment } from 'src/environments/environment';
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-tag',
  templateUrl: './create-tag.component.html',
  styleUrls: ['./create-tag.component.css']
})
export class CreateTagComponent implements OnInit {

  token = ''

  validation: boolean;
  errorMessages = [];

  create_tag: any = {
    value: [],
    message: "",
    error: "",
  }

  tag = {

    text: '',

  }

  constructor(private requestService: RequestService, private router: Router) { }

  ngOnInit() {

    this.token = localStorage.getItem('id_token');

  }

  checkBody(body) {
    this.errorMessages = [];

    if (body.text.length < 1) {
      this.errorMessages.push("The tag must exist")
      this.validation = false;
    }

    return this.errorMessages.length === 0;
  }

  postTag() {

    let body = this.tag;

    if (this.checkBody(body) === false)
      return;

    return this.requestService.requestPost(`${environment.apiUrl}/tags`, this.create_tag, body, { "Authorization": `Bearer ${this.token}` },
      () => {
        if (this.create_tag.message) {
          setTimeout(() => {
            this.router.navigate(['dashboard/tag-list']);
          }, 1500);
        }
      },

    );
  }



}
