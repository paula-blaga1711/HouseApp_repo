import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

import { RequestService } from '../../app/services/request.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']

})
export class ListComponent implements OnInit {

  houses = {

    value: [],

    message: "",

    error: "",

  }

  constructor(private router: Router, public authService: AuthService, private requestService: RequestService) { }


  ngOnInit() {

    this.getHouses();

  }

  getImageFromHouses(house) {
    if (house.image)
      return environment.imageBaseUrl + '' + house.image;
    return '';
  }

  getHouses() {

    return this.requestService.requestGet(`${environment.apiUrl}/houses`, this.houses, "houses", {}, () => {

      console.log(this.houses);

    });

  }

  openHouseDetail(house) {

    this.router.navigateByUrl('list/' + house._id)

  }


}
