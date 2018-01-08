import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordTestComponent } from './password-test.component';

describe('PasswordTestComponent', () => {
  let component: PasswordTestComponent;
  let fixture: ComponentFixture<PasswordTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
