import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service'
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  isAdmin: Boolean = false;
  items = []
  constructor(private _eventService: EventService, private _router: Router, private _authService: AuthService) { }

  ngOnInit() {
    this._eventService.getShop()
      .subscribe(
      res => this.items = res,
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigate(['/login'])
          }
        }
      }
    )
    this._authService.checkAdmin()
      .subscribe(
      res => {
        this.isAdmin = res
        console.log(res)
      },
      err => console.log(err)
    )
  }

  buyItem(item) {
    this._eventService.buyItem(item)
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
      ), 2000)
  }

  deleteItem(item) {
    this._eventService.deleteItem(item)
      .subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
    )
    setTimeout(() => this._eventService.getShop()
      .subscribe(
      res => this.items = res,
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigate(['/login'])
          }
        }
      }
    ), 1000)
  }

}
