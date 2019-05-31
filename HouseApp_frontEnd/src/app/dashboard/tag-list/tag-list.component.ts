import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../app/services/request.service';
import { environment } from 'src/environments/environment';
import { Router } from "@angular/router";

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  token = ''

  tags: any = {
    value: [],
    message: "",
    error: "",
  }

  tag_by_id: any = {
    value: [],
    message: "",
    error: "",
  }

  update_tag: any = {
    value: [],
    message: "",
    error: "",
  }


  tag = {

    text: '',

  }

  id = '';

  constructor(private requestService: RequestService, private router: Router) {
    this.token = localStorage.getItem('id_token');
  }

  ngOnInit() {
    this.getTags();
  }

  getTags() {
    return this.requestService.requestGet(`${environment.apiUrl}/tags`, this.tags, "tags", { "Authorization": `Bearer ${this.token}` }, () => {
      console.log(this.tags);
    });
  }

  getTagById() {
    return this.requestService.requestGet(`${environment.apiUrl}/tags/${this.id}`, this.tag_by_id, "tag", { "Authorization": `Bearer ${this.token}` });
  }

  putTag() {
    let body = this.tag;
    return this.requestService.requestPut(`${environment.apiUrl}/tags/${this.id}`, this.update_tag, body, { "Authorization": `Bearer ${this.token}` }, () => {
      this.getTags();
    });
  }
  getTagId(tag) {
    this.id = tag._id;
    console.log(this.id);
  }

}
