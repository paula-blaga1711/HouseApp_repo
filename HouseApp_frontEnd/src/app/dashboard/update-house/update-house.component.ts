import { Component, OnInit } from '@angular/core';
import { JudeteService } from '../../../app/services/judete.service';
import { State } from '../../clases/State';
import { Country } from '../../clases/country';

import { RequestService, BodyTypes } from '../../../app/services/request.service';
import { environment } from 'src/environments/environment';

import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";

@Component({
  selector: 'app-update-house',
  templateUrl: './update-house.component.html',
  styleUrls: ['./update-house.component.css']
})
export class UpdateHouseComponent implements OnInit {

  token = ''

  selectedCountry: Country = new Country('', '');
  countries: Country[];
  states: State[];


  tags = {
    value: [],
    message: "",
    error: "",
  }

  new_house = {
    value: [],
    message: "",
    error: "",
  }


  create_house = {

    title: '',
    content: '',
    surface: '',
    price: '',
    county: '',
    city: '',
    /* oldTags: '', */
    /* newTags: '', */
    /* houseimg: '', */

  }

  newTag: any = [];
  oldTag: any = [];

  house: any = {

    value: [],
    message: "",
    error: "",

  }

  id: any = '';

  thumbnail = { imageFile: undefined, imageSrc: undefined, inputModel: undefined };

  constructor(private selectService: JudeteService, private requestService: RequestService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.token = localStorage.getItem('id_token');
    this.id = this.route.snapshot.paramMap.get('_id')

    this.countries = this.selectService.getCountries();
    this.onSelect(this.selectedCountry.id);

    this.getTags();
    this.getHousesById();
  }

  onSelect(countryid) {
    this.states = this.selectService.getStates().filter((item) => item.countryid == countryid);
  }

  getTags() {
    return this.requestService.requestGet(`${environment.apiUrl}/tags`, this.tags, "tags", {}, () => {
      console.log(this.tags);
    });

  }


  putHouse() {

    let body = this.create_house;
    console.log(body);

    let object = Object.keys(body)
    let house_body: any = {};

    for (let key of Object.keys(body)) {
      if (body[key] !== '')
        house_body[key] = body[key];
    }
    return this.requestService.requestPut(`${environment.apiUrl}/houses/${this.id}`, this.new_house, house_body, { "Authorization": `Bearer ${this.token}` },
      () => {
        if (this.new_house.message) {
          setTimeout(() => {
            this.router.navigate(['dashboard/house-list']);
          }, 1500);
        }
      },

      /* {
        bodyType: BodyTypes.FORMDATA, image: {
          name: "houseimg",
          file: this.thumbnail.imageFile
        }
      }, */
    );
  }

  getHousesById() {

    return this.requestService.requestGet(`${environment.apiUrl}/houses/${this.id}`, this.house, "house", {}, () => {

      this.create_house.title = this.house.value.title;
      this.create_house.content = this.house.value.content;
      this.create_house.price = this.house.value.price;
      this.create_house.surface = this.house.value.surface;



    });

  }

  /*  setFile($ev) {
     if ($ev === null) { this.thumbnail = { imageFile: undefined, imageSrc: undefined, inputModel: undefined }; return; }
     if ($ev.target.files.length === 0) return; this.thumbnail.imageFile = $ev.target.files[0];
 
     if (this.thumbnail) { const reader = new FileReader(); reader.onload = e => this.thumbnail.imageSrc = reader.result + ""; reader.readAsDataURL(this.thumbnail.imageFile); }
   } */
}
