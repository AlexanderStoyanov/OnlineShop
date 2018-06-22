import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { EventService } from '../event.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerUserData = {};
  invalidEmail: Boolean = false;
  constructor(private _authService: AuthService, private _router: Router, private _eventService: EventService) { }

  ngOnInit() {
  }

  registerUser() {
    this._authService.registerUser(this.registerUserData)
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
      err => {
        if (err.status == 406) {
          this.invalidEmail = true;
          setTimeout(() => this.falseInvalidEmail()
            , 5000)
        }
      }
      )
  }

  falseInvalidEmail() {
    this.invalidEmail = false;
  }

}
