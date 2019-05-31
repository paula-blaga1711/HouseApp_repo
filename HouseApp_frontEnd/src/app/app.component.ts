import { Component } from '@angular/core';
import { AuthService } from './auth.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public authService:AuthService){

  }
  login(){
    this.authService.login();
  }
}
