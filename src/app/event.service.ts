import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class EventService {

  public firstName: BehaviorSubject<String> = new BehaviorSubject<String>(null);
  public balance: BehaviorSubject<Number> = new BehaviorSubject<Number>(null);

  private _shopUrl = "http://localhost:3000/api/shop"
  private _buyItemUrl = "http://localhost:3000/api/buyItem"
  private _addNewItemUrl = "http://localhost:3000/api/add"
  private _boughtItemsUrl = "http://localhost:3000/api/getBoughtItems"
  private _nameUrl = "http://localhost:3000/api/getName"
  private _balanceUrl = "http://localhost:3000/api/getBalance"
  private _paymentInfoUrl = "http://localhost:3000/api/getPaymentInfo"

  constructor(private http: HttpClient, private _router: Router) { }

  addNewItem(item) {
    return this.http.post<any>(this._addNewItemUrl, item)
  }

  buyItem(item) {
    return this.http.post<any>(this._buyItemUrl, item)
  }

  getShop() {
    return this.http.get<any>(this._shopUrl)
  }

  getBoughtItems() {
    return this.http.get<any>(this._boughtItemsUrl)
  }

  getName() {
    return this.http.get<any>(this._nameUrl)
  }

  getBalance() {
    return this.http.get<any>(this._balanceUrl)
  }

  getPaymentInfo() {
    return this.http.get<any>(this._paymentInfoUrl)
  }

}
