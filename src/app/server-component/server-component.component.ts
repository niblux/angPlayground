import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-server-component',
  templateUrl: './server-component.component.html',
  styleUrls: ['./server-component.component.css']
})
export class ServerComponentComponent implements OnInit {

    starFilled: boolean;
    colour    : string  = 'red';
    textValue : string = '';

    constructor() {
        setTimeout(() => {
            this.starFilled = !this.starFilled;
        }, 2000);
    }

    ngOnInit() {
      console.log(this.textValue);
      
    } 


    changeProperty() {
        this.starFilled = !this.starFilled;
    }

    storeValue(eventValue: string) {
        console.log(eventValue);   
        this.textValue = eventValue;
    }
  
 

}
