import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {

  public isAdmin: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  private _registerUrl = "http://localhost:3000/api/register";
  private _loginUrl = "http://localhost:3000/api/login";
  private _updateUrl = "http://localhost:3000/api/update";
  private _addMoneyUrl = "http://localhost:3000/api/addMoney";
  private _getAdminUrl = "http://localhost:3000/api/getAdmin";

  constructor(private http: HttpClient, private _router: Router) { }

  addMoney(user) {
    return this.http.post<any>(this._addMoneyUrl, user)
  }

  updateUserInfo(user) {
    return this.http.post<any>(this._updateUrl, user)
  }

  checkAdmin() {
    return this.http.get<boolean>(this._getAdminUrl)
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

  logoutUser() {
    localStorage.removeItem('token')
    this._router.navigate(['/login'])
  }

}
