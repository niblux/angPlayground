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

    // MAP Array Function (Iterator/Mutator)
    Array.prototype.map = function (projectionFunction) {
      var results = [];
      this.forEach(function (itemInArray) {
        results.push();

      });

      return results;
    };

    // Reduce Array Function (Iterator)
    Array.prototype.reduce = function (projectionFunction) {
      var results = [];
      this.forEach(function (itemInArray) {
        results.push();

      });

      return results;
    };

    // ?? Scan Array Function (Iterator)
    Array.prototype.scan = function (projectionFunction) {
      var results = [];
      this.forEach(function (itemInArray) {
        results.push();

      });

      return results;
    };



// JSON.stringify([1,2,3].map(function(x) { return x + 1; })) === '[2,3,4]'
  }

}
