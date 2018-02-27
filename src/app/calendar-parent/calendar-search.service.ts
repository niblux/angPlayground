import { ApiPayload } from 'common/classes/api-payload.class';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { CalendarEventType } from 'common/classes/calendar-event-type.class';
import { CalendarHeading } from 'common/interfaces/calendar-heading-interface';
import { CalendarRow, CalendarDiv, CalendarEvent } from 'common/interfaces/calendar-data.interface';
import { EmployeeCalendar } from 'common/classes/employee-calendar.class';
import { HeadingService } from './heading.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SabreAPIService } from 'common/services/sabre-api.service';
import { SabreCommon } from 'common/classes/sabre-common.class';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class CalendarSearchService {

    private calendarEventTypes = {};

    /* The data to be returned */
    private calendarData: CalendarRow[] = [];
    private dataStream: Subject<CalendarRow[]>;
    private headingsStream: Subject<CalendarHeading[]>;

    private calendarHeadings: CalendarHeading[] = [];
    private monthlyHeadings: CalendarHeading[]  = [];
    private weeklyHeadings: CalendarHeading[]   = [];
    private dailyHeadings: CalendarHeading[]    = [];

    /* number of days in the date range */
    private daysInDateRange: number = 0;

    /* to store the parameters provided to the service */
    private paramDeptID: number    = undefined;
    private paramEmpID: number     = undefined;
    private paramFromDate: string  = undefined;
    private paramLeaveType: number = undefined;
    private paramToDate: string    = '';


    private paramLeaveStatus  : string[];
    private paramSpecialCircum: string = undefined;
    private paramNotes        : string = undefined;

    /* parameters used for heading calculations */
    private monthName: string;
    private fromDate: string;
    

    public date        = new Date();
    public month       = this.date.getMonth();
    public year        = this.date.getFullYear();
    public day: number = 0;
    public dayName         : string;
    public startOf         : any;
    public startDateOfMonth: any;

public daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
public monthLength = this.daysInMonth[this.month];

public firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
public lastDay  = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

public currentDate;

public viewType: string;
public weekNo  : number;
 
public dateObject = new Date();
public crtMth = 0;


    // TODO: I think that we should add STATUSES as a parameter - it may be useful to list only items of a particular status - e.g. show all pending items so that they can be followed-up

    constructor(
        private sabreAPIService: SabreAPIService
    ) {
        this.dataStream = new Subject<CalendarRow[]>();
        this.headingsStream = new Subject<CalendarHeading[]>();
    }

    public subscribeToCalendarData(): Observable<CalendarRow[]> {
        return this.dataStream.asObservable();
    }

    public subscribeToCalendarHeading(): Observable<CalendarHeading[]> {
        return this.headingsStream.asObservable();
    }

    /**
     * This is the public method to call which will retrieve EmployeeCalendar records, and process the data into arrays of
     * CalendarBlock objects so that it can be used by the calendar view component
     * @param empID 
     * @param deptID 
     * @param leaveType 
     * @param fromDate 
     * @param toDate 
     */
    public generateCalendarData(
        empID: number = null, deptID: number = null, leaveType: number = null, leaveStatus: string[] = null,
        fromDate: string = '', toDate: string = null
    ) {

        /* this is the Observable by which the data will be returned to the calling process */
        // let subjectCalendarData = new AsyncSubject<CalendarRow[]>();

        /* keep hold of the parameters with which the service has been called  */
        this.paramDeptID      = deptID;
        this.paramEmpID       = empID;
        this.paramFromDate    = fromDate;
        this.paramLeaveType   = leaveType;
        this.paramToDate      = toDate;
        this.paramLeaveStatus = leaveStatus;

         this.dateObject = new Date(Date.parse(this.paramFromDate));

         this.crtMth = this.dateObject.getMonth();

         console.log('Passed in date', this.crtMth);

        /* we want to know how many days will be appearing in the calendar view */
        // this.daysInDateRange = SabreCommon.dateDifference(new Date(Date.parse(this.paramFromDate)),
        //     new Date(Date.parse(this.paramToDate))) + 1;

         this.daysInDateRange = SabreCommon.dateDifference(new Date(Date.parse(this.paramFromDate)),
            new Date(this.paramToDate)) + 1;

        /* initialise the data array for the next search */
        this.calendarData = [];

         this.calendarHeadings = [];
        // this.monthlyHeadings  = [];
        // this.weeklyHeadings   = [];
        // this.dailyHeadings    = [];


        /**
         * this sequence of events will retrieve and process the EmployeeCalendar data 
         * resulting in an array of CalendarData objects to be returned by this service
         *
         */

        /* fetch the matching EmployeeCalendar records */
        this.searchEmployeeCalendar()

            /* pass the employeeLeaveRecords on to the CalendarData object initialisation process */
            .switchMap((employeeLeaveRecords) => this.initialiseCalendarData(employeeLeaveRecords))

            /* identify the working days which exist in each EmployeeCalendar record, so that we can mark them in the CalendarBlock array */
            .switchMap(ready => this.markWorkingDaysInCalendarData())
            
            .subscribe(ready => {
                // Notify (pass on) other components of the calendarServiceData
                this.dataStream.next(this.calendarData);
            },
            error => {
                console.log(error);
            },
            () => { }
            );
    }

    public generateCalendarHeadingData(viewType : string) {
        this.generateHeadings(viewType) // returns stream of calendar headings
            // .switchMap(result => this.checkViewType() // applies checkViewType function to headings stream
            .subscribe(results => {      // subscribe to that result and add to stream
                this.headingsStream.next(this.calendarHeadings);
            }, error => {
                console.log(error)
            },
            () => { }

            );
    }

    /**
     * Find and return the EmployeeCalendar records which match the criteria
     */
    private searchEmployeeCalendar(): AsyncSubject<EmployeeCalendar[]> {

        let subjectEmployeeCalendarData = new AsyncSubject<EmployeeCalendar[]>();
        let employeeCalendar = new EmployeeCalendar(this.sabreAPIService, null);

        employeeCalendar.retrieveLeave(
            this.paramEmpID, this.paramDeptID, null, this.paramLeaveType, this.paramLeaveStatus, '', this.paramFromDate, 
            this.paramToDate, false
        )
            .subscribe(employeeCalendarRecords => {
                subjectEmployeeCalendarData.next(employeeCalendarRecords);
                subjectEmployeeCalendarData.complete();
            },
            error => { },
            () => { }
            );

        return subjectEmployeeCalendarData;
    }

    getMonthName(addMonth) {
        let monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        let d = new Date();
        return this.monthName = monthNames[addMonth];
    }

    weekCount(year, month_number) {
        var firstOfMonth = new Date(year, month_number - 1, 1);
        var lastOfMonth = new Date(year, month_number, 0);
        var used = firstOfMonth.getDay() + 6 + lastOfMonth.getDate();
        return Math.ceil(used / 7);
    }

    getQuarterHeadings() {
        let i;

        let currentMonth = this.crtMth

        console.log('Q Method', currentMonth);

        for (i = 0; i <= 2; i++) {

            let heading: CalendarHeading = {
                clickViewType: this.viewType = 'q',
                title: this.getMonthName(currentMonth),
            }

            currentMonth++;
            //console.log('Current month after calc',currentMonth);
            this.monthlyHeadings.push(heading);
        }

        this.calendarHeadings = this.monthlyHeadings
        return this.calendarHeadings;
    }

    getWeeklyHeadings() { 
        let i;
        let weekCount = this.weekCount(this.year, this.month);

        this.weekNo = SabreCommon.getISOWeekNumber();

        for (i = 0; i < this.weekCount(this.year, this.month); i++) {

            //    1 heading : 4-5 Weeks 
            var mthHeading: CalendarHeading = {
                clickViewType: this.viewType = 'm',
                weekNumber: this.weekNo,
                daysInMonth: this.monthLength,
                numberOfWeeks: this.weekCount(this.year, this.month),
            }

            this.weekNo++
            this.weeklyHeadings.push(mthHeading);
        }

        this.calendarHeadings = this.weeklyHeadings
        return this.calendarHeadings;

    }

    getDailyHeadings() { 
        let daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        let i;

        for (i = 1; i < 7; i++) {

            let wklHeading: CalendarHeading = {
                dayOfWeek: this.dayName,
                clickViewType: this.viewType = 'w'
            }

            switch (this.day) {
                case 0:
                    this.dayName = 'Monday';
                    break;
                case 1:
                    this.dayName = 'Tuesday';
                    break;
                case 2:
                    this.dayName = 'Wednesday';
                    break;
                case 3:
                    this.dayName = 'Thursday';
                    break;
                case 4:
                    this.dayName = 'Friday';
                    break;
                case 5:
                    this.dayName = 'Saturday';
                case 6:
                    this.dayName = 'Sunday';
                    break;
            }
            this.day++;
            this.dailyHeadings.push(wklHeading);
        }

        this.calendarHeadings = this.dailyHeadings;
        return this.calendarHeadings;

    }


    generateHeadings(viewType : string): AsyncSubject<CalendarHeading[]> {

        let subjectGenerateHeadings = new AsyncSubject<CalendarHeading[]>();


        if (viewType == 'q') {
            this.getQuarterHeadings();
        } else if (viewType == 'm') {
            this.getWeeklyHeadings();
        } else if (viewType == 'w') { 
            this.getDailyHeadings();
        }

        subjectGenerateHeadings.next(this.calendarHeadings);
       // console.log(this.calendarHeadings);
        subjectGenerateHeadings.complete();

        return subjectGenerateHeadings;

    }

    /**
     * We now need to initialise the CalendarData object based upon the data returned from EmployeeCalendar records
     * @param employeeLeaveRecords 
     */
    initialiseCalendarData(employeeLeaveRecords: EmployeeCalendar[]): AsyncSubject<boolean> {
        let subjectInitialisedCalendarData = new AsyncSubject<boolean>();

        let emptyDiv: CalendarDiv = {
            approved: undefined,
            date: '',
            halfdayIndicator: '',
            leaveType: null,
            text: ''
        };

        /* iterate list of employee (calendar) leave records, and add data to CalendarData object */
        employeeLeaveRecords.forEach((leaveRecord: EmployeeCalendar) => {

            /* look for the current employee within the object */
            let calendarRecord = _.find(this.calendarData, { empID: leaveRecord.ecal_emp_ID });

            /* add a new employee entry if not found */
            if (calendarRecord === undefined) {

                /* initiate the CalendarDiv array with empty CalendarDiv objects */
                let divs: CalendarDiv[] = [];
                for (let x = 0; x <= this.daysInDateRange; x++) {
                    divs.push(emptyDiv);
                }

                let events: CalendarEvent[] = [];

                /* initiate the new CalendarEmployee object */
                let newCalendarRecord: CalendarRow = {
                    empID: leaveRecord.ecal_emp_ID,
                    name: leaveRecord.ecal_emp_name,
                    divs: divs,
                    events: events
                };

                /* add the new record to the collection */
                this.calendarData.push(newCalendarRecord);

                /* set the reference to calendarRecord */
                calendarRecord = newCalendarRecord;
            }

            /* add this current employee calendar entry to the events array */
            let newEvent: CalendarEvent = {
                approved: leaveRecord.ecal_status === 'A',
                endAt: leaveRecord.ecal_endat,
                endDate: leaveRecord.ecal_enddate,
                leaveType: leaveRecord.calendarEventType.calty_code,
                startAt: leaveRecord.ecal_startat,
                startDate: leaveRecord.ecal_startdate,
                text: leaveRecord.ecal_notes
            }

            calendarRecord.events.push(newEvent);
        });

        subjectInitialisedCalendarData.next(true);
        subjectInitialisedCalendarData.complete();

        return subjectInitialisedCalendarData;
    }

    /**
     * This observable will
     * identify the working days which exist in each EmployeeCalendar record, so that we can mark them
     * in the CalendarBlock array
     */
    markWorkingDaysInCalendarData(): AsyncSubject<boolean> {
        let subjectMarkWorkingDays: AsyncSubject<boolean> = new AsyncSubject<boolean>();
        let listOfHttpObservables = [];

        // iterate each employee in CalendarData
        this.calendarData.forEach((employeeCalendarRecord) => {

            /* grab employee ID */
            let empID = employeeCalendarRecord.empID

            employeeCalendarRecord.events.forEach((leaveEvent) => {
                listOfHttpObservables.push(
                    this.accumulateWorkingDaysOnLeave(empID, leaveEvent)
                );
            });

        });

        Observable.forkJoin(listOfHttpObservables)
            .subscribe(
            data => { },
            error => { subjectMarkWorkingDays.error(error); },
            () => {
                subjectMarkWorkingDays.next(true);
                subjectMarkWorkingDays.complete();
            }
            );

        return subjectMarkWorkingDays;
    }

    public accumulateWorkingDaysOnLeave(empID: number, leaveEvent: CalendarEvent): AsyncSubject<boolean> {
        let streamAccumulateWorkingDaysOnLeave = new AsyncSubject<boolean>();
        let apiPayload = new ApiPayload();
        apiPayload.arguments = [leaveEvent.startDate, leaveEvent.endDate, false];

        this.sabreAPIService.callSabreApi('PublicHoliday', 'listWorkingDays', apiPayload)
            .subscribe((workingDaysOnLeave) => {
                /* to keep track of when to apply the endAt 1/2 day setting */
                // const lastIndexInList = workingDaysOnLeave.length - 1;


                let workingDaysInRange = _.filter(workingDaysOnLeave, (wday) => {
                    return wday >= this.paramFromDate && wday <= this.paramToDate;
                });

                let dayCounter = 0;
                let firstDay: boolean = true;
                let halfDayIndicator: string = '';

                /* iterate over the workingDaysOnLeave and place each one in the appropriate CalendarDiv array */
                workingDaysInRange.forEach(workingDay => {

                    if (firstDay) {
                        /* check whether first day is PM only */
                        if (leaveEvent.startAt === 'PM') {
                            halfDayIndicator = 'PM';
                        }
                        firstDay = false;
                    }

                    /* check for last day in sequence */
                    if (++dayCounter == workingDaysInRange.length) {
                        /* check whether last day is AM only */
                        if (leaveEvent.endAt === 'AM') {
                            halfDayIndicator = 'AM';
                        }
                    }

                    /* evaluate which element in the list of divs this date represents */
                    let divID =
                        this.daysInDateRange - SabreCommon.dateDifference(new Date(Date.parse(workingDay)), new Date(this.paramToDate));

                    /* locate the employee's CalendarDiv section in calendarServiceData and push the working day to the list */
                    let calendarDivs = _.find(this.calendarData, { empID: empID }).divs;
                    if (calendarDivs === undefined) {
                        throw Error(`Processing error - unable to find the data for emp ID ${empID}`);
                    }

                    let newCalendarDiv: CalendarDiv = {
                        approved: leaveEvent.approved,
                        date: workingDay,
                        halfdayIndicator: halfDayIndicator,
                        leaveType: leaveEvent.leaveType,
                        text: leaveEvent.text
                    }

                    calendarDivs[divID] = newCalendarDiv;

                });
            },
            error => {
                streamAccumulateWorkingDaysOnLeave.error(error);
            },
            () => {
                streamAccumulateWorkingDaysOnLeave.next(true);
                streamAccumulateWorkingDaysOnLeave.complete();
            }
            );

        return streamAccumulateWorkingDaysOnLeave;
    }





}
