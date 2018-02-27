// TUESDAY 27TH ATTEMPTS

let calendarRow: CalendarRow[] = [];
let singleRecord;
let singleRow;
let newData;

let annualLeaveRecords = leaveRecords;
console.log('x', annualLeaveRecords);

// this.getHeadings(); == quarter for testing
let columnHeadings = columnsAndDayblocks // <- quarter for now 3 months each with 31 days 
// console.log(columnHeadings);
for (let i = 0; i < annualLeaveRecords.length; i++) {
    singleRecord = annualLeaveRecords[i];
    for (let c = 0; c < columnHeadings.length; c++) {
        singleRow = columnHeadings[c];
        if (singleRecord.records.startDate === singleRow.dayBlocks.key) {

            let calRow: CalendarRow = {
                empID: singleRecord.name.id,
                name: singleRecord.name.name,
                divs: singleRow.dayBlocks,
                events: singleRecord.records
            }

            calendarRow.push(calRow);
            newData = this.removeDuplicates(calendarRow);
        }
    }

}

// annualLeaveRecords.forEach(rec => {
//    singleRecord = rec; 
//      columnHeadings.forEach(col => {
//         singleRow = col;
//         if (singleRecord.startDate === singleRow.dayBlocks.key) {

//             // export interface CalendarRow {
//             //     empID: number,
//             //     name: string,
//             //     divs: CalendarDiv[] // insert day blocks. populate with array of data attributes
//             //     events: CalendarEvent[] // insert calendar records , populate with actual leave records
//             // }

//             let calRow : CalendarRow = {
//                 empID:singleRecord.name.id, 
//                 name:singleRecord.name.name,
//                 divs:singleRow.dayBlocks,
//                 events:singleRecord.records
//             }

//             calendarRow.push(calRow);
//         }
//      })
// });

console.log('Calendar Row', calendarRow);


        // console.log('one record', singleRecord);
        // console.log('one heading and dayblocks ', singleRow);


// THURSDAY 23RD ATTEMPTS 
// Attempt at a Helper Functions 
assignKeyValuePairs(objectName, nameOfKey, key, nameOfValue, value) {
    objectName = new Object();

    objectName = {
        nameOfKey: key,
        nameOfValue: value
    }

    console.log(objectName);

    return objectName;
}

/// WEDNESDAY 21st Attempts 
// trying to match records with ids , creating a two dimensional array 

    // Find id in list
    // let j; 
    // for (let j = 0; j < employeesToMatch.length; j++) {
    //     employeeRecord = employeesToMatch[j];
    //     employeeID     = employeesToMatch[j].id
    // }
    // employeesToMatch.forEach(emp => {
    //     employeeRecord = emp;
    //     employeeID     = emp.id;
    //     console.log(employeeID);
    // });

let i;
for (let i = 0; i < employeesToMatch.length; i++) {

    employeeRecord = employeesToMatch[i];
    employeeID = employeesToMatch[i].id

    combinedObject.employee_name = employeeRecord;

    let j;
    for (let j = 0; j < this.leaveRecords.length; j++) {
        let recordToProcess = this.leaveRecords[j];

        if (recordToProcess.empID === employeeID) {

            let leaveRecordNoEmpID = {
                startDate: recordToProcess.startDate,
                leaveDate: recordToProcess.leaveDate,
                startAt: recordToProcess.startAt,
                endAt: recordToProcess.endAt,
                calty_code: recordToProcess.calty_code
            }

            combinedObject.records.push(leaveRecordNoEmpID);
        }
    }

    this.sortedLeaveRecords.push(combinedObject);

}




let i;
for (let i = 0; i < this.leaveRecords.length; i++) {
    let twod = [];
    let record = this.leaveRecords[i];
    let j;
    for (let j = 0; j < employeesToMatch.length; j++) {
        let employeeRecord = employeesToMatch[j];
        let employeeID = employeesToMatch[j].id

        if (employeeID === record.empID) {

            let leaveObject = {
                startDate: record.startDate,
                leaveDate: record.leaveDate,
                startAt: record.startAt,
                endAt: record.endAt,
                calty_code: record.calty_code
            }

            twod.push();

            this.sortedLeaveRecords.push({ employeeName: employeeRecord, records: [leaveObject] }, );
            // twod[employeeRecord] = [record];
            // console.log(twod);
        }
    }
}

    for (let i = 0; i < this.sortedEmployeeIDS.length; i++) {
        employeeToMatch = this.sortedEmployeeIDS[i].id;
    }

    var result = this.leaveRecords.forEach(item => {
        // console.log('from leave records', item.empID);
        if (item.empID === employeeRecord) {
            // this.sortedLeaveRecords = [];
            this.sortedLeaveRecords.push({emp:employeeRecord, leaveRecords:item});
        }
    })


/// TUESDAY 20th Attempts 

assignKeyValues(arrayToSort: any[], emptyObj) {
    arrayToSort = [];

    // im going to just seperate the names and ids , or just use the existing set and use that to match the records 

    let i;
    for (i = 0; i <= this.employeeNameIDs.length; i++) {
        if (!empID && typeof (this.employeeNameIDs[i]) === 'number') {
            var empID = this.employeeNameIDs[i];
        } else if (typeof (this.employeeNameIDs[i]) != 'string') {
            var empID = this.employeeNameIDs[i];
        }
        arrayToSort.push(emptyObj.id = empID);
    }

    let j;
    for (j = 0; j <= this.employeeNameIDs.length; j++) {
        if (typeof (this.employeeNameIDs[j]) === 'string') {
            var empName = this.employeeNameIDs[j];
            emptyObj.name = empName;
        }
        arrayToSort.push(emptyObj);
    }

    return arrayToSort;
}

                    // Second pass to obtain leave records
                    this.calendarResults.forEach(record => {
                        this.leaveRecords.push(record.ecal_emp_ID, record.ecal_startdate, record.ecal_enddate, record.calendarEventType.calty_name, record.ecal_status,
                            record.ecal_startat, record.ecal_endat);
                    })

                                 // match up records with employee ids and names
                     for (let i = 0; i < this.sortedEmployeeIDS.length; i++) {
                         const employee = this.employeeNameIDs[i];
                         for (let j = 0; j < this.leaveRecords.length; j++) {
                             const leaveRecord = this.leaveRecords[j];
                             if (this.leaveRecords.indexOf(employee) > 1) {
                                //  console.log(true);

                                this.sortedLeaveRecords.push(leaveRecord);
                             }
                         }
                     }        

                    console.log(this.sortedLeaveRecords);
       

// First pass to obtain employee name and id
this.calendarResults.forEach(emp => {
    this.employees.push(emp.ecal_emp_ID, emp.ecal_emp_name);
    this.employeeNameIDs = this.removeDuplicateUsingSet(this.employees);
})

for (const e of this.employeeNameIDs) {
    if (typeof (e) === 'number') {
        this.employeeObject.id = e;
    } else if (typeof (e) === 'string') {
        this.employeeObject.name = e;
    }

    console.log(this.employeeObject);

}
       


function removeDuplicates(originalArray, objKey) {
             var trimmedArray = [];
             var values = [];
             var value;

             for (var i = 0; i < originalArray.length; i++) {
                  value = originalArray[i][objKey];

                  if (values.indexOf(value) === -1) {
                       trimmedArray.push(originalArray[i]);
                       values.push(value);
                  }
             }

             return trimmedArray;

        }


 ////////   WORKING WITH SETS AND MAP DATA STRUCTURES

//// MAPS

 this.employees.push({ id: x.ecal_emp_ID }, {name: x.ecal_emp_name});

 this.anotherSet = new Set([{ id: x.ecal_emp_ID}, {name: x.ecal_emp_name}]);
 this.anotherSet = new Set();
 this.anotherSet.add([{ id: x.ecal_emp_ID }, { name: x.ecal_emp_name }]);
 this.mySet.add(x.ecal_emp_name);

 this.employeeObject = {
      id:x.ecal_emp_ID, 
      name:x.ecal_emp_name
 }


 //// SETS 

 this.anotherSet = new Map();
 this.anotherSet.set('id', x.ecal_emp_ID);
 this.anotherSet.set('name', x.ecal_emp_name);

 this.mySet.add(x.ecal_emp_ID);
 this.mySet.add(x.ecal_emp_name);


 this.mySet.forEach(e => {
   if (typeof(e) === typeof(String)) {
         console.log(e);
   }
 })

 this.mySet.add(this.employees)
 for (let index = 0; index < this.employees.length; index++) {
      const element = this.employees[index];
      console.log(element);
      if (typeof(element) === typeof(String)) {
           console.log(element);
      }
 }


 //////// FIND UNIQUE VALUE IN ARRAY


 var uniqEs6 = (arrArg) => {
      return arrArg.filter((elem, pos, arr) => {
           return arr.indexOf(elem) == pos;
      });
 }

 this.employeeNameIDs = uniqEs6(this.employees);
 
 console.log(this.employeeNameIDs);


// ATTEMPT AT SORTING DATA USING FILTER/MAP IN A 
// FUNCTION WITH A PARAM THAT TAKES NEW ARRAY AND THE ARRAY TO PROCESS 
 
           console.log('Sorted', this.sortedArray);
    
                function organiseData(arr, newArr) {


                    return arr
                        .filter(item => typeof (item) === 'number')
                        .map(empID => {
                            return newArr.push({ id: empID });
                        });
                }

                var uniqueArray = removeDuplicateUsingSet(this.employeeNameIDs);

                console.log(organiseData(uniqueArray, this.employees));

                console.log();
                
// ATTEMPT AT SORTING DATA USING FILTER/MAP IN A 
// FUNCTION WITH A PARAM THAT TAKES NEW ARRAY AND THE ARRAY TO PROCESS

                let employeez = uniqueArray.filter(function (item) {
                        
                    // var empID : number = empObject.id;
                    // var empName : string = empObject.name;

                    let employees =  [];

                    var empObject: employeeObject;

                    if (typeof(item) === 'number') {
                        employees.push({ id:item })
                    } else if (typeof (item) === 'string') {
                        employees.push({ name: item });                        
                    }

                    return employees;

                    
                });

                .map(function(item) {
                   let employeeObjectTing : employeeObject;
                   employeeObjectTing.id = item;

                   return employeeObjectTing
                });
                uniqueArray.forEach(singleEmp => {
                    if(typeof(singleEmp) === typeof(Number)) {
                        console.log(this.employeeObject['id'] = singleEmp);                        
                    } else if(typeof(singleEmp) === typeof(String)) {
                        console.log(this.employeeObject['name'] = singleEmp);                        
                    }
                })

         
        
                var emptyArray = []; // two dimensional array , this will contain an array emp_IDS and names and leaveRecords

                var leaveRecords = [];    

                for (let i = 0; i < this.employeeNameIDs.length; i++) {
                     if (this.employeeNameIDs.indexOf(this.employeeNameIDs[i]) === i) {
                         this.employees.push(this.employeeNameIDs[i])
                     }
                }


                 /**
                 * SECOND PASS
                 * @param leaveRecord : is the leave record from the search query
                 */

                 // create an array of leave records to match up with employee id's


//////////////////////////////////// working example with a two deep array with ids and names \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
let employeeIDs = [];

let leaveRecord = [];

/**
 * FIRST PASS
 * Sort by employee id's and name
 * return result should be an array with emp_id's and corresponding names
 * @param singleEmp : which is each item in calendar leave records array.
 */

function removeDuplicateUsingSet(arr) {
  let unique_array = Array.from(new Set(arr))
  return unique_array;
}


this.calendarResults.map((x) => {
  return this.employees.push(x.ecal_emp_ID, x.ecal_emp_name)
});

var sortedArray = removeDuplicateUsingSet(this.employees);
// var sortedArray2 = removeDuplicates(this.employees);
// console.log(sortedArray);

// TODO: A nested forEach loop like concatAll will be needed when 
// looping through the multi dimensional array

var sortedIDs = sortedArray
  .filter(empId => typeof (empId) === 'number')
  .map(employeeID => {
    return this.employeeObject.id = employeeID;
  })

var sortedNames = sortedArray
  .filter(empName => typeof (empName) === 'string')
  .map(employeeName => {
    return this.employeeObject.name = String(employeeName);
  })


this.sortedEmployeeIDS.push({ id: sortedIDs });
this.sortedEmployeeIDS.push({ name: sortedNames });

// two dimensional array of employee ids
console.log(this.sortedEmployeeIDS[0]);   