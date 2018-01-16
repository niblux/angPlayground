import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-indexed-db',
  templateUrl: './indexed-db.component.html',
  styleUrls: ['./indexed-db.component.css']
})
export class IndexedDBComponent implements OnInit {

  email: string;
  request;
  db;
  sabreObjectStore = 'sabreDatabase';

  constructor() { }

  ngOnInit() {
  }

}
