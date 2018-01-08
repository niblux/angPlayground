import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ViewChild } from '@angular/core/src/metadata/di';
import { Input } from '@angular/core/src/metadata/directives';
import { ElementRef } from '@angular/core/src/linker/element_ref';

@Component({
  selector: 'app-password-test',
  templateUrl: './password-test.component.html',
  styleUrls: ['./password-test.component.css']
})
export class PasswordTestComponent{

  public originalValue: string[] = [];
  public asteriskvalue: string;

  storedValue: string = '';
  starredValue: string[] = [];

  @ViewChild('passwordText') input: ElementRef;

  onChange(va: any) {
    this.originalValue.push(va.srcElement.value);

    let i;
    let j;

    for (i = 0; i < this.originalValue.length; i++) {
      this.asteriskvalue = this.originalValue[i];
    }

    // console.log(this.asteriskvalue);
    
    

    let keyUpObs = Observable.from(this.input.nativeElement);
    console.log(keyUpObs);
    

    // keyUpObs.subscribe((results) => {
    //   this.starredValue.push(results);

    //   for (j = 0; j < this.starredValue.length; j++) {
    //     this.asteriskvalue = this.starredValue[j].replace(/./g, '*');;
    //   }

    // });

    // keyUpObs.map((x : string) => {
    //   this.starredValue = x;
    //   this.starredValue.replace(/./g, '*')
    //   console.log(this.starredValue);
    // }).subscribe(y => {
    //   console.log('starred',y)
    // })

  }

  // public keyUp = document.querySelector('keyUpNode');

  // @ViewChild('passwordText') input; 

  // ngAfterViewInit() {
  //   let keyUpObs = Observable.fromEvent(this.input.nativeElement,'keyup');

  //   keyUpObs.subscribe((results: any) => {
  //     console.log('Original Value',results.srcElement.value);
  //     this.originalValue = results;
  //   });

  //   keyUpObs.map((x : string) => {
  //     x.replace(/./g, '*')
  //   }).subscribe(y => {
  //     console.log(y)
  //   })

    // keyUpObs.map((x : string) => {
    //  this.asteriskvalue = x.replace(/./g, "*");
    // }).subscribe(results => {
    //      console.dir('Map Result',results);
    // });
  // }

}
