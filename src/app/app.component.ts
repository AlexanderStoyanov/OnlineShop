import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { EventService } from './event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isAdmin: Boolean = false;
  firstName: String;
  balance: Number;

  constructor(private _authService: AuthService, private _eventService: EventService) {
    this._eventService.firstName.subscribe(value => {
      this.firstName = value;
    });
    this._eventService.balance.subscribe(value => {
      this.balance = value;
    });
    this._authService.isAdmin.subscribe(value => {
      this.isAdmin = value;
    });
  }

  
  ngOnInit() {

    this._eventService.getName()
      .subscribe(
      res => {
        this.firstName = res
        console.log(res)
      },
      err => console.log(err)
      )

    this._eventService.getBalance()
      .subscribe(
      res => {
        this.balance = res
        console.log(res)
      },
      err => console.log(err)
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
  
}
