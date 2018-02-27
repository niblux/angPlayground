import { DashboardComponent } from './../../dashboard/dashboard.component';
import { CalendarRow } from 'common/interfaces/calendar-data.interface';
import { CalendarEventType } from 'common/classes/calendar-event-type.class';
import { CalendarSearchService } from 'common/services/calendar-search.service';
import { Component, OnInit } from '@angular/core';
import { EmployeeCalendar } from 'common/classes/employee-calendar.class';
import { Observable } from 'rxjs/Observable';
import { SelectDropdownService } from 'common/services/select-dropdown.service';

@Component({
    selector: 'app-calendar-parent',
    inputs: [],
    templateUrl: './calendar-parent.component.html',
    styleUrls: ['./calendar-parent.component.scss']
})

export class CalendarParentComponent implements OnInit {

    private empID    : number;
    private deptID   : number;
    private leaveType: number;

    public quarterViewType: 'q';
    public monthlyViewType: 'm';
    public weeklyViewType : 'w';

    public fromDate;
    public currentDate;

    public calendarData: CalendarRow[];

    constructor(
        private calendarSearchService: CalendarSearchService
    ) { }

    ngOnInit() {
    }

    fromDateValue(from_Date : string) { 
        this.fromDate = from_Date;
    }


}
