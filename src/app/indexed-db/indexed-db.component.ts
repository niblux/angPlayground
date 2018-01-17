import { ViewChild } from '@angular/core/src/metadata/di';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-indexed-db',
  templateUrl: './indexed-db.component.html',
  styleUrls: ['./indexed-db.component.css']
})
export class IndexedDBComponent implements OnInit {

  emailDbRequest
  openDBRequest;
  email: string;
  storedEmailAddress: string;
  request;
  db;
  sabreObjectStore = 'sabreDatabase';

  @ViewChild('username') username;


  constructor() { }

  ngOnInit() {

    /**
     * Attempting to retrieve the email address without a value check raises an error
     * as there is no value to retrieve prior to the database being created. 
     */

    if (this.username.nativeElement.value == '') {
      this.storeEmailAddress();
    } else {

    }

  }

  createDatabase() {
    let dbOpenRequestObject = window.indexedDB;

    this.openDBRequest = dbOpenRequestObject.open('sabreIndexedDatabase');

    this.openDBRequest.onupgradeneeded = (e: any) => {

      let requestHandler = e.target.result;

      let objectStoreHandler: IDBObjectStore;

      objectStoreHandler = requestHandler.createObjectStore(['usernames'], { autoIncrement: true });
    }

    this.openDBRequest.onerror = () => {
      console.log('Error');
    }
  }

  storeEmailAddress() {
    let indexDBRequestObject = window.indexedDB;

    this.emailDbRequest = indexDBRequestObject.open('sabreIndexedDatabase');

    /**
     * Every Indexed DB connection returns an event object which is used as a handler to perform CRUD actions
     * on the created database. 
     */

    this.emailDbRequest.onsuccess = (event: any) => {
      let dbEmailEventhandler = event.target.result

      let transaction: IDBTransaction;

      transaction = dbEmailEventhandler.transaction(['usernames'], 'readonly');

      let transactionStoreHandler = transaction.objectStore('usernames');

      let transactionRequestHandler = transactionStoreHandler.get('username');

      transactionRequestHandler.onsuccess = (event: any) => {
        this.storedEmailAddress = event.target.result;
      }
    }

    return this.storedEmailAddress;
  }

  /**
  * The username entered is stored and used to add to the database 
  * (if database isn't created) 
  * and update the inserted value 
  * (if there is already a username stored).
  * 
  * @param usernameValue
  */
  retrieveUsername(usernameValue: string) {

    let retrieveUsernameObject = window.indexedDB;

    this.openDBRequest = retrieveUsernameObject.open('sabreIndexedDatabase');

    this.openDBRequest.onsuccess = (e: any) => {

      let dbEventHandler = e.target.result;

      let transaction: IDBTransaction;

      transaction = dbEventHandler.transaction(['usernames'], 'readwrite');

      let storeHandler = transaction.objectStore('usernames');

      let req = storeHandler.put(usernameValue, 'username')

      req.onsuccess = (event: any) => {
      }

      let getReq = storeHandler.get('username');

      getReq.onsuccess = (event: any) => {
        console.log('Username saved as', event.target.result)
        this.storedEmailAddress = event.target.result;
      }
    }
  }

  }


