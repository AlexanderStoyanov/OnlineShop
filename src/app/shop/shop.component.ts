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
  items = [];
  itemBought: Boolean = false;
  itemDeleted: Boolean = false;
  invalidBalance: Boolean = false;
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
      err => {
        if (err.status === 200) {
          this.itemBought = true;
          setTimeout(() => this.falseItemBought()
            , 5000)
        } else
        if (err.status === 406) {
          this.invalidBalance = true;
          setTimeout(() => this.falseInvalidBalance()
            , 5000)
        }
      }
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
      err => {
        if (err.status === 200) {
          this.itemDeleted = true;
          setTimeout(() => this.falseItemDeleted()
            , 5000)
        }
      }
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

  falseItemBought() {
    this.itemBought = false;
  }

  falseItemDeleted() {
    this.itemDeleted = false;
  }

  falseInvalidBalance() {
    this.invalidBalance = false;
  }

}
