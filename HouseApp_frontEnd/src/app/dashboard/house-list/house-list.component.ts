import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../app/services/request.service';
import { environment } from 'src/environments/environment';
import { Router } from "@angular/router";

@Component({
  selector: 'app-house-list',
  templateUrl: './house-list.component.html',
  styleUrls: ['./house-list.component.css']
})
export class HouseListComponent implements OnInit {

  token = ''

  houses = {
    value: [],
    message: "",
    error: "",
  }

  search_text = {
    value: [],
    message: "",
    error: "",
  }

  id = '';

  search = '';
  price1 = '';
  price2 = '';

  constructor(private requestService: RequestService, private router: Router) {
    this.token = localStorage.getItem('id_token');
  }

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

  deleteHouse() {
    return this.requestService.requestDelete(`${environment.apiUrl}/houses/${this.id}`, this.houses, "houses", { "Authorization": `Bearer ${this.token}` }, () => {
      this.getHouses()
    });
  }


  getHouseId(house) {
    this.id = house._id;
    console.log(this.id);
  }

  openHouseDetail(house) {
    this.router.navigateByUrl('dashboard/house-list/' + house._id);
  }

  modifyHouseDetail(house) {
    this.router.navigateByUrl('dashboard/house-list/modify/' + house._id);
  }

  getFilter() {
    return this.requestService.requestGet(`${environment.apiUrl}/houses?text=${this.search}`, this.houses, "houses", { "Authorization": `Bearer ${this.token}` }, () => {
      if (this.search == '') {
        this.getHouses();
      }
    });
  }

  getFilterByTags() {

    return this.requestService.requestGet(`${environment.apiUrl}/houses?prices[0]=${this.price1}&prices[1]=${this.price2}`, this.houses, "houses", { "Authorization": `Bearer ${this.token}` });
  }

}
