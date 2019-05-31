import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { RequestService } from '../../app/services/request.service';
import { environment } from 'src/environments/environment';




@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  house: any = {

    value: [],
    message: "",
    error: "",

  }

  id: any = '';


  houseId: any = {};

  constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestService) { }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('_id')
    this.getHousesById();
  }


  getImageFromHouses(houseId) {
    if (houseId.image)
      return environment.imageBaseUrl + '' + houseId.image;
    return '';
  }

  getHousesById() {

    return this.requestService.requestGet(`${environment.apiUrl}/houses/${this.id}`, this.house, "house", {}, () => {

      this.houseId = this.house.value;

    });

  }




}
