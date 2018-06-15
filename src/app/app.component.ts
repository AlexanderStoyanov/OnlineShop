import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { EventService } from './event.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  user = []
  constructor(private _authService: AuthService, private _eventService: EventService) { }

  
  ngOnInit() {
    this._eventService.getHistory()
      .subscribe(
      res => {
        this.user = res
        console.log(res)
      },
      err => console.log(err)
      )
  }
  
}
