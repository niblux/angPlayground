import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'app-observables',
  templateUrl: './observables.component.html',
  styleUrls: ['./observables.component.css']
})
export class ObservablesComponent implements OnInit {

  dataObject = ([
    { name: 'micahel', age: '57', pets: 'bubbles', wife: 'lisa-marie'},
    { name: 'kanye',  age: '37', pets: 'tiger', wife: 'kim' },
  ]
);

  storedNames = [];

  constructor() { }

  ngOnInit() {
  
  }

  forLoopTest(dataObject) {
    let i;

    for (i=0; this.dataObject.length; i++){
      let names = this.dataObject[i];

      this.storedNames.push(names);

      return this.storedNames;
    }
  }

}
