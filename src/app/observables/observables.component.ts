import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'app-observables',
  templateUrl: './observables.component.html',
  styleUrls: ['./observables.component.css']
})
export class ObservablesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    Array.prototype.map = function (projectionFunction) {
      var results = [];
      this.forEach(function (itemInArray) {
        results.push();

      });

      return results;
    };

// JSON.stringify([1,2,3].map(function(x) { return x + 1; })) === '[2,3,4]'
  }

}
