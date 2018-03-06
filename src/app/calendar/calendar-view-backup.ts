import { AsyncSubject } from 'rxjs/AsyncSubject';
import { CalendarEvent, CalendarRow, CalendarDiv } from 'common/interfaces/calendar-data.interface';
import { CalendarHeading } from 'common/interfaces/calendar-heading-interface';
import { CalendarHeadings } from 'common/interfaces/calendar-data.interface';
import { CalendarSearchComponent } from './../calendar-search/calendar-search.component';
import { CalendarSearchService } from 'common/services/calendar-search.service';
import { CalendarService } from 'common/services/calendar.service';
import { Component, OnInit, Input } from '@angular/core';
import { Data } from '@angular/router/src/config';
import { element } from 'protractor';
import { EmployeeCalendar } from 'common/classes/employee-calendar.class';
import { Observable } from 'rxjs';
import { SabreCommon } from 'common/classes/sabre-common.class';
import * as _ from 'lodash';

export interface DayBlock {
    empID: number,
    name: string,
    date: Date,
    day: Date,     // insert calendar records , populate with actual leave records
}

@Component({
    selector   : 'app-calendar-view',
    inputs     : ['calendarSearchRecords'],
    templateUrl: './calendar-view.component.html',
    styleUrls  : ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {

    calendarResults = [];
    calendarData = [];

    employees
    employeeNameIDs = [];

    leaveRecords = [];
    sortedLeaveRecords = [];

    employeeObject = {
        id: undefined,
        name: ''
    };

    leaveRecordObject = {
        empID: undefined,
        startDate: '',
        leaveDate: '',
        startAt: '',
        endAt: '',
        calty_code: undefined,
        calty_id: undefined
    }

    employeeNameList = [];
    employeeLeaveRecords = [];
    calendarHeadings = [];
    calendarDayBlocks = [];
    calendarRow;

    // Headings and Day Blocks
    date = new Date();
    currentDay = this.date.getDay();
    monthNumber = this.date.getMonth() + 1;
    year = this.date.getFullYear();
    dayBlocks = [];
    days = [];

    dayName: string = '';
    monthName: string = '';
    weekNumber: number;
    headingColumns = [];
    // dayblocks: DayBlock[] = [];

    // Test variables
    anotherSet;
    empID: number = undefined;
    empName: string = '';
    mySet = new Set();
    sortedEmployeeIDS = [];

    empIDsToProcess = [];
    leaveRecordsToProcess = [];


    constructor(
        private calendarService: CalendarService
    ) {
    }

    ngOnInit() {
        // Main retrieval methods
        this.dayBlocks.length = 31;
        this.retrieveCalendarRecords();

        // Calculating Day Blocks and Headers
        this.get12Months();
        this.getHeadings('quarter');

        this.daysInMonth();
    }

    removeDuplicates(arr) {
        let unique_array = Array.from(new Set(arr))
        // console.log(arr);
        return unique_array;
    }

    /**
    * FIRST PASS
    * Sort by employee id's and name
    * return result should be an array with emp_id's and corresponding names
    * @param singleEmp : which is each item in calendar leave records array.
    */
    retrieveCalendarRecords() {

        this.dayBlocks = this.getCalendardays();
        this.calendarService.getAllLeaveRecords()
            .subscribe(results => {
                this.calendarResults = results;

                // Empty array for next search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                this.sortedEmployeeIDS = [];
                this.employees = [];

                // console.log('Main Search Query', this.calendarResults);

                // First pass to obtain employee name and id
                this.calendarResults.forEach(emp => {

                this.employees.push(emp.ecal_emp_ID, emp.ecal_emp_name);
                // remove any duplicate employees
                    this.employeeNameIDs = this.removeDuplicates(this.employees);
                })
                // console.log(this.employeeNameIDs);
                
                /**
                * Get leave records from main result set to match up with ids
                */
                this.calendarResults.forEach(record => {
                    this.leaveRecordObject = {
                        empID     : record.ecal_emp_ID,
                        startDate : record.ecal_startdate,
                        leaveDate : record.ecal_enddate,
                        startAt   : record.ecal_startat,
                        endAt     : record.ecal_startat,
                        calty_code: record.calendarEventType.calty_code,
                        calty_id  : record.ecal_calty_ID
                    }

                    this.leaveRecords.push(this.leaveRecordObject)
                })

                // Assign name and id properties to the duplicate free Set()
                // console.log('in for each',this.employeeNameIDs);
                
                this.assignKeyValuePairs(this.employeeNameIDs); // 694 records with 
               
            
            });     // end getAllCalendarRecords
    } 

    /**
* SECOND PASS
* Match all employee ids and name with Leave records
* @param employeesToMatch : List of employees name and id.
*/

    matchRecordsWithEmployee(employeesToMatch) {
        this.sortedLeaveRecords = [];

        for (let j = 0; j < employeesToMatch.length; j++) {
            let employeeRecord = employeesToMatch[j];
            let employeeID = employeesToMatch[j].employeeID;

            let combinedRecords = {
                employeeName: '',
                records: []
            };

            for (let i = 0; i < this.leaveRecords.length; i++) {
                let record = this.leaveRecords[i];

                if (employeeID === record.empID) {

                    combinedRecords.employeeName = employeeRecord;

                    let leaveObject = {
                        startDate: record.startDate,
                        leaveDate: record.leaveDate,
                        startAt: record.startAt,
                        endAt: record.endAt,
                        calty_code: record.calty_code,
                        calty_id: record.calty_id
                    }

                    combinedRecords.records.push(leaveObject);
                }

            }
            this.sortedLeaveRecords.push(combinedRecords);
        }
        //  console.log('Matching records from view', this.sortedLeaveRecords);

        this.combineData(this.sortedLeaveRecords, this.headingColumns);
    }

    assignKeyValuePairs(employeeNameIDPairs : string[]) {
        let singleEmployee;
        let empID;
        let empName;
        let i;

        /**
         * Assign employee list key value pairs
         */
        for (let i = 0; i <= employeeNameIDPairs.length; i++) {
            singleEmployee = employeeNameIDPairs[i];
            if (typeof (singleEmployee) === 'number') {
                empID = singleEmployee;
            }

            if (typeof (singleEmployee) === 'string') {
                empName = singleEmployee;
                this.sortedEmployeeIDS.push({ employeeID: empID, employeeName: empName });
            }
        }

        // console.log('Duplicate free name and ids', this.sortedEmployeeIDS);

        return this.matchRecordsWithEmployee(this.sortedEmployeeIDS);
    }


    combineData(leaveRecords : any[], columnsAndDayblocks) {
       this.calendarRow = [];
       
       let annualLeaveRecords = leaveRecords;
       let columnHeadings     = columnsAndDayblocks  // <- quarter for now 3 months each with 31 days  
       
       let headings;
       let days;

       let calRow = {};

       // create new array with records, columns and day blocks

        annualLeaveRecords.forEach(record => {
            calRow = {
                employeeName: record.employeeName,
                records: record.records,
                // headings: columnHeadings,
                daysInMonth: columnHeadings[0].dayBlocks
            }
            this.calendarRow.push(calRow);
        })
       console.log('Calendar Row', this.calendarRow);
       
       return this.calendarRow
    }

    // TODO: need to work out day blocks marked with records before creating a calendar row 
    // ie: loop through records and day blocks and match by date, day block is going to need a date 
    // such as 31 day blocks : 01/01/2018, 02/01/2018, 03/01/2018, 04/01/2018. 
    // Loop those out and each time you get a match with a record start date , mark it with a boolean flag 
    // and add to calendar row , that way when row is looped out it will already have the marked days ??? 

    // headings 
    // dayBlocks 

    // ----- > daysblocks into daysOfMonth 

    // markDaysInRow(columns, rows, days) {

    //     columns.length = 3;  // dependant on view q=3, m=weekCount w = 1
    //     days.length    = 31 // dependant on view q=31*3, m=7*weekCount, w=5
    //     rows.length    = // the amount of employees to process

    //     for (let i = 0; i < columns.length; i++) {
    //         const element = array[i];

    //     }
    // }


    /** 
     * THIRD PASS : Calculate Headings
     * @param viewType : will be passed from the search query to determine which view is displayed
     * quarter, monthly, weekly. Each view type has its own number of columns which are populated with 
     * the correct month name (January, Febuary ..), week number (39, 40, 41, 42) and day name (Monday, Tuesday ..)
     */

    getHeadings(viewType: string) {
        let columns = [];

        switch (viewType) {
            case 'quarter':
                let currentMonth = this.date.getMonth();
                // let dayblocks = this.getDayBlocks();.
                let i;
                for (i = 0; i <= 2; i++) {
                    currentMonth++;
                    var quarterHeading: CalendarHeadings = {
                        monthName: this.getMonthName(currentMonth),
                        dayBlocks: this.dayBlocks,
                    }
                    columns.push(quarterHeading);
                }
                break;
            case 'monthly':
                let weekCount = this.weekCount(this.year, this.monthNumber, this.currentDay) - 1;
                this.weekNumber = SabreCommon.getISOWeekNumber() - 1;
                let w;
                for (w = 0; w < weekCount; w++) {
                    this.weekNumber++;

                    var weeklyHeading: CalendarHeadings = {
                        weekNumber: this.weekNumber
                    }
                    columns.push(weeklyHeading);
                }
                break;
            case 'weekly':

                let days = [];
                let dayName = this.getDayName(this.currentDay);

                let d;
                for (d = 0; d < 5; d++) {
                    switch (d) {
                        case 0:
                            this.dayName = 'Monday';
                            days.push(this.dayName);
                            break;
                        case 1:
                            this.dayName = 'Tuesday';
                            days.push(this.dayName);
                            break;
                        case 2:
                            this.dayName = 'Wednesday';
                            days.push(this.dayName);
                            break;
                        case 3:
                            this.dayName = 'Thursday';
                            days.push(this.dayName);
                            break;
                        case 4:
                            this.dayName = 'Friday';
                            days.push(this.dayName);
                            break;
                    }

                    var weeklyHeading: CalendarHeadings = {
                        day: days
                    }
                }

                columns.push(weeklyHeading);
                break;

            default: 'quarter'
                break;
        }

        this.headingColumns = columns
        // console.log(this.headingColumns);


        return this.headingColumns;
    }

    /** 
    * Convert Month Number to the correct name for the month ie: 1 = January , 2 = Feburary
    * @param addMonth
    */

    getMonthName(monthToString: number) {
        let monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return this.monthName = monthNames[monthToString - 1];
    }

    getDayName(currentDay: number) {
        switch (currentDay - 1) {
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
        }

        return this.dayName;
    }

    weekCount(year, month_number, startDayOfWeek) {
        var firstDayOfWeek = startDayOfWeek || 0;

        var firstOfMonth = new Date(year, month_number - 1, 1);
        var lastOfMonth = new Date(year, month_number, 0);
        var numberOfDaysInMonth = lastOfMonth.getDate();
        var firstWeekDay = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7;

        var used = firstWeekDay + numberOfDaysInMonth;

        return Math.ceil(used / 7);
    }

    getCalendardays() {
        let calendarDays = []

        for (let i = 0; i < 31; i++) {
            calendarDays.push({
                key: i, // used to match with daysInMonth
            })
        }
        //   console.log('calendar days', calendarDays);
        return calendarDays
    }


    daysInMonth(){
        // let day            = this.currentDay;
        // let dayCount = 1;
        // let month          = this.monthNumber;
        
        // let monthCount = 1;
        // let year           = this.year;
        // let totalDaysInFeb = 0;

        // /* Determing if Feb has 28 or 29 days in it. */
        // if (month == 2) {
        //     if ((year % 100 !== 0) && (year % 4 === 0) || (year % 400 === 0)) {
        //         totalDaysInFeb = 29;
        //     } else {
        //         totalDaysInFeb = 28;
        //     }
        // }

        // /* A placeholder value is placed at index[0] , this is so the number of the month match the indexes in the array
        // *  ie : month = 2 , daysInMonth[2] = Febuary
        // */ 
        // let totalDays = [0, 31, totalDaysInFeb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        // let daysInMonth: number = totalDays[month];
        // let incrementedDate;


        // let calRow = {
            
        // }

        // let dateObject = {
        //     day:undefined, 
        //     date:undefined, 
        //     year:undefined
        // }      

        // for (let j = 1; j <= 12; j++) {
        //     dateObject.date = j;
        //     for (let i = 1; i <= 31; i++) {
        //         dateObject.day = i;
        //     }
        //     // console.log(dateObject);
        // }
    
        // for (let i = 1; i <= 31; i++) {
        //     dayCount = i;
        //     if (dayCount <= daysInMonth) {
        //        for (let j = 0; j <= 12; j++) {
        //           monthCount = j;                   
        //        }
        //     } else {
        //         incrementedDate = dayCount + '-' + monthCount + '-' + year + ''                  
        //     }
        //     console.log(incrementedDate);
             
        // }

        // while (dayCount <= daysInMonth) {
        //     dayCount++
            
        //     if (monthCount <= 12) {
        //         monthCount + 1
        //     }

        //     // do {
        //     //     monthCount + 1
        //     // } while (monthCount <= 12);

        //     incrementedDate = dayCount + '-' + monthCount + '-' + year + ''
        //     console.log(incrementedDate);
        // }

            

            // if (dayCount == daysInMonth) {
            //     monthCount++
            // }

            // console.log(incrementedDate);
        

        // for (let i = 1; i < 31; i++) {
        //     // dayCount = i;
        //     dayCount++
        //     // console.log(incrementedDate);
        // }

        // for (let m = 1; m < 12; m++) {
        //     // monthCount = m;
        //     monthCount++
        //     // incrementedDate = dayCount + '-' + monthCount + '-' + year + ''                  
        // }

        // console.log('Month', monthCount);
        // console.log('Day', dayCount);
        

    }

    workoutDaysInEachCalendarMonth(month) {

        var monthYear = [];
        var totalFeb  = 0;
        var testing   = "";

        var current      = new Date();
        var currentMonth = current.getMonth();
        var day          = current.getDate();
        var year         = current.getFullYear();
        var tempMonth    = month + 1;
        var prevMonth    = month - 1;

        //Determing if Feb has 28 or 29 days in it.  
        if (month == 1) {
            if ((year % 100 !== 0) && (year % 4 === 0) || (year % 400 === 0)) {
                totalFeb = 29;
            } else {
                totalFeb = 28;
            }
        }

        var monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"];
        var totalDays = ["31", "" + totalFeb + "", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];

        var tempDate = new Date(tempMonth + ' 1 ,' + year);
        // console.log(tempDate);

        

        
        var tempweekday = tempDate.getDay();
        // console.log(tempweekday);
        
        var tempweekday2   = tempweekday;
        // checks which month it is and returns the amount of days 
        var dayAmount: any = totalDays[month];

        while (tempweekday > 0) {
            tempweekday--;
        }

        let dayCount : any = 1;
        while (dayCount <= dayAmount) {

            if (tempweekday2 > 6) {
                tempweekday2 = 0;
            }

            if (dayCount == day && month == currentMonth) {
                monthYear.push({
                    i: dayCount + '/' + currentMonth + '/' + year + ''
                })
            } else {
                monthYear.push({
                    i: dayCount + '/' + currentMonth + '/' + year + ''
                })
            }

            tempweekday2++;
            dayCount++;
            if (currentMonth <= 12) {
                currentMonth++
            }
        }
        
        var newDate = SabreCommon.dateFormat(tempDate, ['d2', 'm2', 'y2'], '-');


        // console.log({
        //     month: monthNames[month] + " " + year,
        //     daysInMonth: padding
        // })

        let daysInMonth = {
            month: monthNames[month] + " " + year,
            days: monthYear
        }

        // console.log(daysInMonth);
        

        return daysInMonth;

    }

    // Test to get 12 months of the year 
    get12Months() {
        let i
        for (i = 0; i < 12; i++) {
            this.workoutDaysInEachCalendarMonth(i);
        }
        return i;
    }
    

}