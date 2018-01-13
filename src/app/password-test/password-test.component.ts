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

  public name: string = 'Nabs'

  public originalValue;
  public starredValue;


  @ViewChild('passwordText') input;

  ngOnInit() {

    let keyUpObs = Observable.fromEvent(this.input.nativeElement, 'keyup');
    let keyDownObs = Observable.fromEvent(this.input.nativeElement, 'keyup');
    
    
    keyDownObs.subscribe((x : KeyboardEvent) => {
        let charValue = x.key;      
        charValue.replace(/./g, '*');
    })

    keyUpObs.map((x) => {
      return (<HTMLInputElement>event.target).value;
    }).subscribe(x => {
      this.starredValue = x.replace(/./g, '*');
    })


    keyUpObs.subscribe((x: HTMLInputElement) => {
      this.originalValue = (<HTMLInputElement>event.target).value;
    })


  }

}
