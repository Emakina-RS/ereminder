'use strict';

const Constants = {
    stringFormats:{
        dateTime:'dd-mm-yyyy hh:mm:ss',
        date:'dd-mm-yyyy'
    },
    errorMessages:{
        requiredField: (fieldName) => '${fieldName} is required',
        invalidDate:'',
        invalidDateTime:'',
        invalidDateTime:'',
        futureDate:'',
        invalidEmail:'',
        missingEmail:'',
        missingPassword:'',
        unmatchedPassword:''
    }
}


module.exports = Constants;