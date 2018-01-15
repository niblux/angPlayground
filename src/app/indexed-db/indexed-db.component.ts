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

  addData(){
    let userObject = [{
      username: this.email
    }]

    let transaction = this.db.transaction(this.sabreObjectStore, 'readwrite');

    transaction.oncomplete = (event) => {
      console.log('Transacton Completed Successfully')
    }


    let transactionObjectStore = transaction.objectStore(this.sabreObjectStore);
    console.log(transactionObjectStore.username);

    let transactionRequest = transactionObjectStore.add(userObject[0]);

    transactionRequest.onsuccess = (event) => {
      console.log('Transaction Successful ' + event);

    }
  }

}
