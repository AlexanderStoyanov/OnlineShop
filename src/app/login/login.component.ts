import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { EventService } from '../event.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  loginUserData = {}
  constructor(private _authService: AuthService, private _router: Router, private _eventService: EventService) { }

  ngOnInit() {
  }

  loginUser() {
    this._authService.loginUser(this.loginUserData)
      .subscribe(
      res => {
        console.log(res)
        localStorage.setItem('token', res.token)
        this._eventService.getName()
          .subscribe(
          res => {
            this._eventService.firstName.next(res)
          },
          err => console.log(err)
        )
        this._eventService.getBalance()
          .subscribe(
          res => {
            this._eventService.balance.next(res)
          },
          err => console.log(err)
        )
        this._authService.checkAdmin()
          .subscribe(
          res => {
            this._authService.isAdmin.next(res)
          },
          err => console.log(err)
        )
        this._router.navigate(['/shop'])
      },
      err => console.log(err)
      )
  }

}
