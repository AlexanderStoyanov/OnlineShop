import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUserData = {}
  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  loginUser() {
    this._auth.loginUser(this.loginUserData)
      .subscribe(
      res => {
        console.log(res)
        localStorage.setItem('firstName', res.name)
        localStorage.setItem('token', res.token)
        localStorage.setItem('balance', res.balance)
        this._router.navigate(['/shop'])
      },
      err => console.log(err)
      )
  }

}
