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

  email: string;
  request;
  db;
  sabreObjectStore = 'usernames';
  idbRequest;
  idbRequestCapture;
  storedEmailAddress: string;


  captureStoredEmail() {
    let idbCapture = window.indexedDB;

    this.idbRequestCapture = idbCapture.open('sabreIndexedDatabase');

    this.idbRequestCapture.onsuccess = (event: any) => {
      let dbCapture = event.target.result

      let transaction: IDBTransaction;

      transaction = dbCapture.transaction(['usernames'], 'readonly');

      let captureHandler = transaction.objectStore('usernames');

      let captureRequest = captureHandler.get('username');

      captureRequest.onsuccess = (event: any) => {
        this.storedEmailAddress = event.target.result;
        console.log('Retrieved From Init', this.storedEmailAddress)
      }
    }

    return this.storedEmailAddress;
  }

  storeEmailLocalStorage(usernameValue: string) {

    console.log(usernameValue);

    let idb = window.indexedDB;
    this.idbRequest = idb.open('sabreIndexedDatabase');

    //console.log(this.idbRequest);

    this.idbRequest.onupgradeneeded = (e: any) => {

      let requestHandler = e.target.result;

      let objectStoreHandler: IDBObjectStore;
      // console.log(objectStoreHandler);

      objectStoreHandler = requestHandler.createObjectStore(['usernames'], { autoIncrement: true });
      // autoIncrement key
      // keyPath : has to be a value

      // objectStoreHandler.createIndex('nameIndex', 'username');

      console.log(objectStoreHandler);

      // objectStoreHandler.put({ // put
      //     username: usernameValue,
      // })

      // objectStoreHandler.put(usernameValue, 1)

      console.log('Upgraded');
    }
    // END UPGRADE NEEDED

    this.idbRequest.onerror = () => {
      console.log('Error');
    }
    // END ERROR NEEDED

    this.idbRequest.onsuccess = (e: any) => {

      let db = e.target.result;

      let transaction: IDBTransaction;

      transaction = db.transaction(['usernames'], 'readwrite');

      // // let storeHandler = transaction.objectStore(this.sabreObjectStore);

      let storeHandler = transaction.objectStore('usernames');

      let req = storeHandler.put(usernameValue, 'username')

      req.onsuccess = (event: any) => {
        console.log('Username', event.target.result);
      }

      let getReq = storeHandler.get('username');

      getReq.onsuccess = (event: any) => {
        console.log('Retrieved Username', event.target.result)
        this.storedEmailAddress = event.target.result;
      }

      // transaction.onerror = (event) => {
      //     console.log('Error', e);
      // }

      // storeHandler.get(0).onsuccess = function (e: any) {
      //     console.log('Username', e.target)
      // }

      // console.log('success');
      // // console.log(results);   
    }

    // END ON SUCCESS 
  }


    // addData() { 
    //     // TRANSACTION

    //     let userObject = [{
    //         username: this.email
    //     }]

    //     let transaction = this.db.transaction(this.sabreObjectStore, 'readwrite');

    //     transaction.oncomplete = (event) => {
    //         console.log('Transacton Completed Successfully')
    //     }


    //     let transactionObjectStore = transaction.objectStore(this.sabreObjectStore);
    //     console.log(transactionObjectStore.username);

    //     let transactionRequest = transactionObjectStore.add(userObject[0]);

    //     transactionRequest.onsuccess = (event) => {
    //         console.log('Transaction Successful ' + event);

    //     }
    // }

}
