import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-component',
  templateUrl: './server-component.component.html',
  styleUrls: ['./server-component.component.css']
})
export class ServerComponentComponent implements OnInit {

    changedClassIcon = '';

    constructor() {
    }

    ngOnInit() {
    
    }
  
    changeProperty(){ 
        this.changedClassIcon = 'fas fa-code';
    }  

}
