import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  newItemData = {}
  constructor(private _event: EventService, private _router: Router) { }

  ngOnInit() {
  }

  addNewItem() {
    this._event.addNewItem(this.newItemData)
      .subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
      )
  }

}
