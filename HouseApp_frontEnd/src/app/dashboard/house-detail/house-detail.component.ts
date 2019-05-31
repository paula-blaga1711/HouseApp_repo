import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { RequestService } from '../../../app/services/request.service';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html',
  styleUrls: ['./house-detail.component.css']
})
export class HouseDetailComponent implements OnInit {

  house: any = {

    value: [],
    message: "",
    error: "",

  }

  id: any = '';

  houseID: any = {}
  constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestService) { }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('_id')
    this.getHousesById();
  }

  getImageFromHouses(houseID) {
    if (houseID.image)
      return environment.imageBaseUrl + '' + houseID.image;
    return '';
  }


  getHousesById() {

    return this.requestService.requestGet(`${environment.apiUrl}/houses/${this.id}`, this.house, "house", {}, () => {

      this.houseID = this.house.value;

    });
  }

}
