const convert = require('convert-units');
const debug = require('debug')('measurements');
const arrayEqual = require('../common/index').arraysEqual;
const measurementCategory = require('./constants').category;
const measurements = {};

// {
//     from: 'this',
//     fromType: 'thing',
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
const expectedInputKeys = [ 'from','fromType', 'result', 'to', 'value'  ]
const isInputValid = (conversionObj) => {
    if (arrayEqual(Object.keys(conversionObj), expectedInputKeys)) {
        debug("don't match input eys")
        return false;
    }
    
    // check conversion values types
    let fromType = typeof conversionObj.from === 'string';
    let toType = typeof conversionObj.to === 'string';
    let valueType = typeof conversionObj.value === 'number';
    let resultType = conversionObj.result === null || typeof conversionObj.result === 'number';

    if (!fromType || !toType || !valueType || !resultType) {
        debug(`fromType: ${fromType}, toType: ${toType}, valueType ${valueType}, resultType ${resultType} `)
        return false;
    }

    return true;
}

const removeSpaces = (conversionObj) => {
 debug('remove spaces', conversionObj)
    if (conversionObj.from.indexOf(' ') > -1) {
        let tempFrom = conversionObj.from.replace(/\s/,'-');
        conversionObj.from = tempFrom;
    }

    if (conversionObj.to.indexOf(' ') > -1) {
        let tempTo = conversionObj.to.replace(/\s/,'-');
        conversionObj.to = tempTo;
    }
    return conversionObj;
}

const isConversionPossible = (conversionObj) => {
    let updatedConversionObj = removeSpaces(conversionObj);
    let possibleMeasurements = convert().from(updatedConversionObj.from).possibilities();
    for (let i = 0; i < possibleMeasurements.length - 1; i++) {
        if (possibleMeasurements[i] === updatedConversionObj.to) {
            return true;
        }
    }
    debug(`check conversion from: ${updatedConversionObj.from} & to: ${conversionObj.to}`)
    return false;
}

function checkUnitType(reqDishItem) {
    
    debug("incoming unit", reqDishItem)
    let unit = reqDishItem.portionSize.unit;
    // let unit = removeSpaces(incUnit);
    if(unit === 'qty') {
        return 'qty';
    }

    for (let i = 0; i < measurementCategory.mass.length; i++) {
        if (measurementCategory.mass[i] === unit) {
            return 'mass';
        }
    }
    for (let i = 0; i < measurementCategory.volume.length; i++) {
        if (measurementCategory.volume[i] === unit) {
            return 'volume';
        }
    }
    debug(unit + ' did not match any known category of unit');
    return null;
};

measurements.checkUnitType = checkUnitType;

// create conversion object
function createConversionObj(reqDishItem, dishItemNutrition) {
    this.from = reqDishItem.portionSize.unit;
    this.fromType = this.checkUnitType(reqDishItem);
    this.value = Number(reqDishItem.portionSize.value);
    this.to = setTo(dishItemNutrition);
    this.result = null;
    // methods
    function setTo(dishItemNutrition) {
        debug("ftom type", this.fromType)
        var toUnit = dishItemNutrition.nutrients[0].unit;
        if(this.fromType === 'volume') {
            debug("labels",dishItemNutrition.nutrients[0])
            toUnit = dishItemNutrition.nutrients[0].measures[0].label
        }
        return toUnit
    }
}

createConversionObj.prototype.get = function(name) {
    return this[name];
}

createConversionObj.prototype.set = function(name, value) {
    this[name] = value;
}

createConversionObj.prototype.checkUnitType = checkUnitType;
createConversionObj.prototype.setToUnitType = function(dishItemNutrition) {
    var toUnit = dishItemNutrition.nutrients[0].unit;;
    if(this.fromType === 'volume') {
        toUnit = dishItemNutrition.nutrients[0].measures[0].label
    }
    return toUnit
}

measurements.createConversionObj = createConversionObj;

measurements.conversion = (obj) => {
    let convertUnit = obj;
    // validate inputs
    debug("check incoming object", convertUnit)
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
    convertUnit.result = Number(convert(convertUnit.value).from(convertUnit.from).to(convertUnit.to).toFixed(3))
    debug("typeof ", typeof convertUnit.result, convertUnit.result)
    // .catch( error => {
    //     debug(error)
    // })

    return convertUnit;
}
    
module.exports = measurements;



