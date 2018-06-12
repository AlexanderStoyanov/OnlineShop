import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  userInfo = {}
  constructor(private _authService: AuthService) { }

  getMoney() {
    this._authService.getMoney(this.userInfo)
      .subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
      )
  }
}
