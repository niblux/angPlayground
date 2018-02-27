import { CalendarRow } from 'common/interfaces/calendar-data.interface';
import { CalendarHeading } from 'common/interfaces/calendar-heading-interface';
import { CalendarSearchService } from 'common/services/calendar-search.service';
import { Component, OnInit, Input } from '@angular/core';
import { EmployeeCalendar } from 'common/classes/employee-calendar.class';
import { Observable } from 'rxjs';
import { SabreCommon } from 'common/classes/sabre-common.class';

@Component({
    selector   : 'app-calendar-view',
    inputs     : ['fromDate'],
    templateUrl: './calendar-view.component.html',
    styleUrls  : ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {

    public employeeLeaveRecordsEmpID: EmployeeCalendar[] = [];
    public calendarData             : CalendarRow[]      = [];

    public calendarHeadings: CalendarHeading[] = [];

    private monthlyHeadings: CalendarHeading[] = [];
    private weeklyHeadings: CalendarHeading[]  = [];
    private dailyHeadings: CalendarHeading[]   = [];

    constructor(
        private calendarSearchService: CalendarSearchService
    ) { }

    ngOnInit() {
        this.calendarSearchService.subscribeToCalendarData()
            .subscribe(calendarData => { 
                this.calendarData = calendarData
            });
        
        this.calendarSearchService.subscribeToCalendarHeading()
            .subscribe(calendarHeadings => { 
                // console.log('Calendar Headings', calendarHeadings)
                this.calendarHeadings = calendarHeadings;
            });
    }
   

}