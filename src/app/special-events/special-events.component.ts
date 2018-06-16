import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service'
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-special-events',
  templateUrl: './special-events.component.html',
  styleUrls: ['./special-events.component.css']
})
export class SpecialEventsComponent implements OnInit {

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
  }

  //buyItem(item) {
  //  this._eventService.buyItem(item)
  //    .subscribe(
  //    res => {
  //      console.log(res)
        
  //    },
  //    err => console.log(err)
  //    )
  //}

}
