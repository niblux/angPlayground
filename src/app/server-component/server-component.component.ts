import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-component',
  templateUrl: './server-component.component.html',
  styleUrls: ['./server-component.component.css']
})
export class ServerComponentComponent implements OnInit {

    starFilled: boolean;
    colour    : string  = 'red';

    constructor() {
        setTimeout(() => {
            this.starFilled = !this.starFilled;
        }, 2000);
    }

    ngOnInit() {
    
    }
  
 

}
