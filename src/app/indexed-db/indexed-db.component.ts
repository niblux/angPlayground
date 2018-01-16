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

  storeEmailLocalStorage() {

    // Open connection to local database
    this.request = indexedDB.open(this.sabreObjectStore, 1);

    // Store database object request
    this.request.onsuccess = (event) => {
      this.db = event.target.result;

      // this.addData();
    }

    // Handle Upgrade of database.
    this.request.onupgradeneeded = (event) => {
      let upgradedDb = event.target.result;

      upgradedDb.onerror = (event) => {
        alert('Error ' + event)
      }

      let objectStore = this.db.createObjectStore('usernames', { keyPath: 'email' });

      objectStore.createIndex('index', 'email', { unique: true, });

    } // end upgrade
  }


}
