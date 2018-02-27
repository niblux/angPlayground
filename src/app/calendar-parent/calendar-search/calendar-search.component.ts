import { AnnualLeaveYTDCalculator } from 'common/services/annual-leave-ytd-calculator.service';
import { ApiPayload } from 'common/classes/api-payload.class';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { CalendarRow, CalendarDiv, CalendarEvent } from 'common/interfaces/calendar-data.interface';
import { CalendarEventType } from 'common/classes/calendar-event-type.class';
import { CalendarViewComponent } from '../calendar-view/calendar-view.component';
import { CalendarSearchService } from 'common/services/calendar-search.service';
import { Component, EventEmitter } from '@angular/core';
import { Department } from 'common/classes/department.class';
import { EmployeeCalendar } from 'common/classes/employee-calendar.class';
import { EmployeeProfile } from 'common/classes/employee-profile.class';
import { LookupTableService } from 'common/services/lookup-table.service';
import { Observable } from 'rxjs/Observable';
import { OnInit, OnDestroy } from '@angular/core';
import { PopupService } from 'common/services/popup.service';
import { Response } from '@angular/http';
import { SabreAPIService } from 'common/services/sabre-api.service';
import { SabreCommon } from 'common/classes/sabre-common.class';
import { SelectDropdownService } from 'common/services/select-dropdown.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ViewChild } from '@angular/core';

@Component({
    selector: 'app-calendar-search',
    inputs: [],
    outputs: ['employeeEmpRecordEvent', 'employeeFilterRecordEvent', 'showQuarterEvent', 'showMonthEvent', 'showWeekEvent',
        'hideFilterEvent', 'hideEmpSearchEvent', 'calendarEmployeeDataEvent'],
    templateUrl: './calendar-search.component.html',
    styleUrls: ['./calendar-search.component.scss']
})


export class CalendarSearchComponent implements OnInit {

    constructor(
        private sabreApiService: SabreAPIService,
        private dropdownService: SelectDropdownService,
        protected toastService: ToasterService,
        protected popupService: PopupService,
        private calendarSearchService: CalendarSearchService
    ) {

    }

    private enableFilter = true;
    private apiPayload    : ApiPayload;
    private selectAllValue: 'Select All..'

    // Employee Properties
    private employeeLabel     = 'List of Employees';
    private employeeIdentifer = 'employees';
    private employeeList   : string[];
    private employeeProfile: EmployeeProfile[] = [];
    private empID          : number;

    // Department Properties
    private departmentIdentifer = 'departments';
    private departmentLabel     = 'List of Departments';
    private departmentList  : string[];
    public  deptLeaveRecords: EmployeeCalendar[] = [];
    private deptName        : string;
    private deptID          : number;

    /* Send employee record data up to parent for consumption by child views */
    public employeeEmpRecordEvent: EventEmitter<EmployeeCalendar[]>    = new EventEmitter();
    public employeeFilterRecordEvent: EventEmitter<EmployeeCalendar[]> = new EventEmitter();

    /* Toggle between Quarter , Monthly , Weekly Views */
    public showQuarterEvent: EventEmitter<boolean> = new EventEmitter();
    public showMonthEvent: EventEmitter<boolean>   = new EventEmitter();
    public showWeekEvent: EventEmitter<boolean>    = new EventEmitter();

    /* Show and Hide Views dependant on selected search */
    public hideFilterEvent: EventEmitter<boolean>    = new EventEmitter();
    public hideEmpSearchEvent: EventEmitter<boolean> = new EventEmitter();

    // Leave type Properties
    private leaveType     : number;
    private leaveTypesList: string[];
    private leaveIdentifier = 'calendar-event-type';
    private leaveTypeLabel  = 'List of Leave Types';
    private maxDate         = '';

    public currentDate;
    private fromDate: string;
    public  endDate : string;

    /* Calendar Objects */
    private calendarEmployeeDataEvent: EventEmitter<CalendarRow[]> = new EventEmitter();
    private singleEmployeeRecordEvent: EventEmitter<CalendarRow[]> = new EventEmitter();

    private fromDateEvent: EventEmitter<String> = new EventEmitter();

    public daysInMonth: number;
    public daysArray = [];
    public mthValue: number;
    public yrValue : number;
    public newDate;

    public date = new Date();
    public dd = this.date.getDate();
    public mm = this.date.getMonth() + 1;
    public yr = this.date.getFullYear();

    public exactDate: any;

    public crtDate = SabreCommon.dateFormat(this.date, ['yn', 'm2', 'd2'], '-');

    public firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    public lastDay  = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

    public numDate: number;
    public mthDate: number;
    public yrDate : number;

    ngOnInit() {
        this.getEmployeeList();
        this.getDepartmentList();
        this.getLeaveTypesList();
        this.getSingleEmployeeLeaveRecord();
        this.setDefaultDate();
<<<<<<< HEAD
        this.searchCalendar();
        
=======
       // this.searchCalendar();
>>>>>>> 50a75ce2f5506ec1bfddf54a664e539f3e9aa94b
       this.fromDate = SabreCommon.dateFormat(this.date,['yn', 'm2', 'd2'], '-');
       
        // Subscribe Using Employee ID

        this.dropdownService.getServiceObservable(this.employeeIdentifer)
            .subscribe(empID => {
                this.getSingleEmployeeLeaveRecord(empID);
            });

        // Obtain Dropdown ID 
        this.dropdownService.getServiceObservable(this.departmentIdentifer)
            .subscribe(deptID => {
                this.deptID = deptID;
            });

        // Obtain Leave Type 
        this.dropdownService.getServiceObservable(this.leaveIdentifier)
            .subscribe(leaveType => {
                this.leaveType = leaveType;
            });

            this.testMethod();

    }

    // Stores Date from DatePicker
    getDateRange(date) {
        this.fromDate = date; // string 
    }

    // Set Default date if DatePicker empty
    setDefaultDate() {
        if (this.fromDate == null) { 
            this.fromDate = this.crtDate;
    }
    }

    testMethod() {
        console.log(this.fromDate);
    }

    searchCalendar() {
        this.calendarSearchService.generateCalendarHeadingData('q');
    
        this.calendarSearchService.generateCalendarData(null, this.deptID, this.leaveType, null,
            this.fromDate, '2017-12-11');
    }

    getSingleEmployeeLeaveRecord(empID: number = null) {
        let employeeCalendar = new EmployeeCalendar(this.sabreApiService, null);

        employeeCalendar.filterCalendarRecords(empID)
            .subscribe(empRecords => {
                if (empRecords.length < 1) {
                    this.popupService.toasterDarkBlue('No results found', 'Please select a new employee');
                } else {
                    this.employeeEmpRecordEvent.emit(empRecords);
                }
            })
        
        this.hideEmpSearchEvent.emit();

    }

    /* Retrieve the employee records list */
    getEmployeeList() {
        let employeeProfileData = new EmployeeProfile(this.sabreApiService, null)
        employeeProfileData.listEmployees().
            subscribe(
            response => { this.employeeList = response },
            error => { },
            () => { }
            )
    }

    /**
  * Retrieve the List of department
  */
    getDepartmentList() {
        let departmentData = new Department(this.sabreApiService, null);
        departmentData.getDropdownList().
            subscribe(
            response => { this.departmentList = response }, () => { }
            )

    }

    /**
   * Retrieve the list of Calendar Event Types 
   */
    getLeaveTypesList() {
        let calendarEventType = new CalendarEventType(this.sabreApiService, null);

        calendarEventType.retrieveCalendarEventTypes().subscribe(data => {
            this.leaveTypesList = data;
        })
    }


}