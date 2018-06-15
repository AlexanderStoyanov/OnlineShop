import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http';
import { EventService } from '../event.service'

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  userInfo = {}
  boughtItems = []
  constructor(private _eventService: EventService, private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
    this._eventService.getHistory()
      .subscribe(
      res => this.boughtItems = res,
      err => console.log(err)
    )
  }

  updateInfo() {
    this._auth.updateUserInfo(this.userInfo)
      .subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
      )
  }

  addMoney() {
    this._auth.addMoney(this.userInfo)
      .subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
      )
  }

}
