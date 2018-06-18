import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { EventService } from './event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  isAdmin: boolean = false;
  firstName: String;
  balance: number;
  constructor(private _authService: AuthService, private _eventService: EventService) { }

  
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
