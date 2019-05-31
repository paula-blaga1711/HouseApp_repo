import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashpanal',
  templateUrl: './dashpanal.component.html',
  styleUrls: ['./dashpanal.component.css']
})
export class DashpanalComponent implements OnInit {

  slide = false;

  constructor() { }

  ngOnInit() {
  }

  sideBar() {
    if (this.slide === true) {
      this.slide = false;
    } else this.slide = true;
  }
}
