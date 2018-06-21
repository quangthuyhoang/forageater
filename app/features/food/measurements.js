const convert = require('convert-units');
const debug = require('debug')('measurements');
const arrayEqual = require('../common/index').arraysEqual;
const measurements = {};

// {
//     from: 'this',
//     to: 'that',
//     value: 'num',
//     result: 'num'
// }

// {
//     error: 'conversion fail'
//     from: 'this',
//     to: 'that',
// }

// input validation
const expectedInputKeys = [ 'from', 'result', 'to', 'value' ]
const isInputValid = (conversionObj) => {
    if (arrayEqual(Object.keys(conversionObj), expectedInputKeys)) {

        console.log("check keys:", conversionObj, arrayEqual(Object.keys(conversionObj), expectedInputKeys) )
        debug("check keys:", conversionObj);
        return false;
    }
    
    // check conversion values types
    let fromType = typeof conversionObj.from === 'string';
    let toType = typeof conversionObj.to === 'string';
    let valueType = typeof conversionObj.value === 'number';
    let resultType = conversionObj.result === null || typeof conversionObj.result === 'number';

    if (!fromType || !toType || !valueType || !resultType) {
        console.log("check values:", fromType, toType, valueType, resultType )
        debug("check values: ", conversionObj)
        return false;
    }

    return true;
}

const isConversionPossible = (conversionObj) => {
    let possibleMeasurements = convert().from(conversionObj.from).possibilities();
    for(let i = 0; i < possibleMeasurements.length - 1; i++) {
        if (possibleMeasurements[i] === conversionObj.to) {
            return true;
        }
    }
    debug(`check conversion from: ${conversionObj.from} & to: ${conversionObj.to}`)
    return false;
}

measurements.conversion = (obj) => {
    let convertUnit = obj;
    // validate inputs
    if(!isInputValid(convertUnit)) {
        return {
            error: 'invalid conversion object',
            from: obj.from,
            to: obj.to
        }
    }
    // can conversion be done -> reject if not
    if(!isConversionPossible(convertUnit)){
        return {
            error: 'Incompatible conversion units.',
            from: obj.from,
            to: obj.to
        }
    }

    // invoke specific conversion based on conversion type
    convertUnit.result = convert(convertUnit.value).from(convertUnit.from).to(convertUnit.to)
    // .catch( error => {
    //     debug(error)
    // })

    return convertUnit;
}
    
module.exports = measurements;



