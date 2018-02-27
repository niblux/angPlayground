import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarParentComponent } from './calendar-parent.component';

describe('CalendarParentComponent', () => {
  let component: CalendarParentComponent;
  let fixture: ComponentFixture<CalendarParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
