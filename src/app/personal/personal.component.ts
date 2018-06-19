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

  userInfo = {};
  boughtItems = [];
  paymentInfo = [];
  constructor(private _eventService: EventService, private _authService: AuthService, private _router: Router) { }

  ngOnInit() {
    this._eventService.getBoughtItems()
      .subscribe(
      res => { this.boughtItems = res },
      err => console.log(err)
    )

    this._eventService.getPaymentInfo()
      .subscribe(
      res => {
        this.paymentInfo = res;
      },
      err => console.log(err)
    )
  }

  updateInfo() {
    this._authService.updateUserInfo(this.userInfo)
      .subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
    )
    setTimeout(()=> this._eventService.getPaymentInfo()
      .subscribe(
      res => {
        this.paymentInfo = res;
      },
      err => console.log(err)
      ), 2000)
  }

  addMoney() {
    this._authService.addMoney(this.userInfo)
      .subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
    )
    setTimeout(()=> this._eventService.getBalance()
      .subscribe(
      res => {
        this._eventService.balance.next(res)
      },
      err => console.log(err)
    ), 1000)
  }

}
