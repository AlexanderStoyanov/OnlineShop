import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class EventService {

  private _eventsUrl = "http://localhost:3000/api/events"
  private _specialEventsUrl = "http://localhost:3000/api/special"
  private _buyItemUrl = "http://localhost:3000/api/buyItem"
  private _addNewItemUrl = "http://localhost:3000/api/add"
  private _historyUrl = "http://localhost:3000/api/history"

  constructor(private http: HttpClient, private _router: Router) { }

  addNewItem(item) {
    return this.http.post<any>(this._addNewItemUrl, item)
  }

  buyItem(item) {
    return this.http.post<any>(this._buyItemUrl, item)
  }

  getEvents() {
    return this.http.get<any>(this._eventsUrl)
  }

  getSpecialEvents() {
    return this.http.get<any>(this._specialEventsUrl)
  }

  getHistory() {
    return this.http.get<any>(this._historyUrl)
  }

}
