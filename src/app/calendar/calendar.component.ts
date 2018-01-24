import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarRow, CalendarDiv } from 'common/interfaces/calendar-data.interface';
import { element } from 'protractor';
import { CalendarSearchComponent } from './../calendar-search/calendar-search.component';
import { CalendarHeading } from 'common/interfaces/calendar-heading-interface';
import { CalendarSearchService } from 'common/services/calendar-search.service';
import { Component, OnInit, Input } from '@angular/core';
import { EmployeeCalendar } from 'common/classes/employee-calendar.class';
import { Observable } from 'rxjs';
import { SabreCommon } from 'common/classes/sabre-common.class';
import * as _ from 'lodash';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarViewComponent implements OnInit {

  calendarSearchRecords = [];
  calRecords = [];

  // initial divs for quarter view
  monthlyHeadings = [];
  dayBlocks = [];
  calendarRows = [];

  dateRange: number;

  // handle monthly headings
  currentDate = new Date();
  monthName: string;

  constructor(
    private calendarSearchComponent: CalendarSearchComponent
  ) { }

  ngOnInit() {
    this.dayBlocks.length = 31;

    this.retrieveCalendarRecords();

    this.intialiseQuarter();
  }

  retrieveCalendarRecords() {
    this.calendarSearchComponent.getAllLeaveRecords()
      .subscribe(records => {
        this.calendarSearchRecords = records;

        this.calendarSearchRecords.forEach(record => {

          // Create the events object to go inside events property of the calendar blocks    
          let calendarEventsObject: CalendarEvent = {
            approved: true,
            endAt: record.ecal_endat,
            endDate: record.ecal_enddate,
            leaveType: record.calty_name,   // to store the calty_code, e.g. SLEAVE, ITRAIN
            startAt: record.ecal_startat,
            startDate: record.ecal_startdate,
            text: ''
          }

          let eventDivs: CalendarEvent[] = []
          eventDivs.push(calendarEventsObject);

          let calendarDivsObject: CalendarDiv = {
            approved: true,
            date: record.ecal_startat,
            halfdayIndicator: record.ecal_startat,    // blank if all day, else A | P,
            leaveType: record.ecal_calty_ID,    // to store the calty_code, e.g. SLEAVE, ITRAIN
            text: ''
          }

          let divsArray: CalendarDiv[] = [];
          divsArray.push(calendarDivsObject);


          // Create the blocks to go inside of the dayblocks array
          let calendarRowObject: CalendarRow = {
            empID: record.ecal_emp_ID,
            name: record.ecal_emp_name,
            divs: divsArray,
            events: eventDivs
          }

          // Push the calendarRowObject into the dayblocks array
          // dayblocks is 31 in length     
          this.calRecords.push(calendarRowObject);

        })
        console.log(this.calRecords);


        return this.calRecords;
      })
  }

  // initially quarter, will use switch case to determine view
  // ngSwitch within template. 
  intialiseQuarter() {

    let i;
    let monthNumber = this.currentDate.getMonth();

    for (i = monthNumber; i <= 2; i++) {
      this.monthlyHeadings.push(this.getMonthName(i));
    }

    return this.monthlyHeadings;
  }

  getMonthName(monthNumber: number) {

    let monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return this.monthName = monthNames[monthNumber];
  }

}
