import { Component, OnInit } from '@angular/core';
import { JudeteService } from '../../../app/services/judete.service';
import { State } from '../../clases/State';
import { Country } from '../../clases/country';

import { RequestService, BodyTypes } from '../../../app/services/request.service';
import { environment } from 'src/environments/environment';

import { Router } from "@angular/router";

@Component({
  selector: 'app-create-house',
  templateUrl: './create-house.component.html',
  styleUrls: ['./create-house.component.css']
})
export class CreateHouseComponent implements OnInit {

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

  thumbnail = { imageFile: undefined, imageSrc: undefined, inputModel: undefined };

  constructor(private selectService: JudeteService, private requestService: RequestService, private router: Router) { }

  ngOnInit() {
    this.token = localStorage.getItem('id_token');

    this.countries = this.selectService.getCountries();
    this.onSelect(this.selectedCountry.id);

    this.getTags();
  }

  onSelect(countryid) {
    this.states = this.selectService.getStates().filter((item) => item.countryid == countryid);
  }

  getTags() {
    return this.requestService.requestGet(`${environment.apiUrl}/tags`, this.tags, "tags", {}, () => {
      console.log(this.tags);
    });

  }


  postHouse() {

    let body = this.create_house;
    console.log(body);

    let object = Object.keys(body)
    let house_body: any = {};

    for (let key of Object.keys(body)) {
      if (body[key] !== '')
        house_body[key] = body[key];
    }
    return this.requestService.requestPost(`${environment.apiUrl}/houses`, this.new_house, house_body, { "Authorization": `Bearer ${this.token}` },
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


  /*  setFile($ev) {
     if ($ev === null) { this.thumbnail = { imageFile: undefined, imageSrc: undefined, inputModel: undefined }; return; }
     if ($ev.target.files.length === 0) return; this.thumbnail.imageFile = $ev.target.files[0];
 
     if (this.thumbnail) { const reader = new FileReader(); reader.onload = e => this.thumbnail.imageSrc = reader.result + ""; reader.readAsDataURL(this.thumbnail.imageFile); }
   } */
}
