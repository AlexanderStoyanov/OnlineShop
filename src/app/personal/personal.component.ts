import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  userInfo = {}
  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  updateInfo() {
    this._auth.updateUserInfo(this.userInfo)
      .subscribe(
      res => {
        console.log(res)
        //localStorage.setItem('firstName', res.name)
        //localStorage.setItem('token', res.token)
        //this._router.navigate(['/special'])
      },
      err => console.log(err)
      )
  }

  addMoney() {
    this._auth.addMoney(this.userInfo)
      .subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
      )
  }

}
