import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']

})
export class NavbarComponent implements OnInit {

  private routeSub: any;

  constructor(public authService: AuthService, public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {
    this.authService.handleAuthentication();
  }


  ngOnDestroy() {
    this.routeSub.unsubscribe()
  }


}
