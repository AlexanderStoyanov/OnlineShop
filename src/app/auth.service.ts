import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  private _registerUrl = "http://localhost:3000/api/register"
  private _loginUrl = "http://localhost:3000/api/login"
  private _updateUrl = "http://localhost:3000/api/update"
  private _addMoneyUrl = "http://localhost:3000/api/addMoney"
  private _getMoneyUrl = "http://localhost:3000/api/getMoney"

  constructor(private http: HttpClient, private _router: Router) { }

  addMoney(user) {
    return this.http.post<any>(this._addMoneyUrl, user)
  }

  getMoney(user) {
    return this.http.post<any>(this._getMoneyUrl, user)
  }

  updateUserInfo(user) {
    return this.http.post<any>(this._updateUrl, user)
  }

  registerUser(user) {
    return this.http.post<any>(this._registerUrl, user)
  }

  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user)
  }

  loggedIn() {
    return !!localStorage.getItem('token')
  }

  getToken() {
    return localStorage.getItem('token')
  }

  getName() {
    return localStorage.getItem('firstName')
  }

  logoutUser() {
    localStorage.removeItem('token')
    this._router.navigate(['/events'])
  }

}
