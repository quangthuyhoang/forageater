const { getCalories, getProteins, getCarbohydrates, getFats, getSugars } = require('./apiParser');
const measurementCategory = require('./constants').category;
const convert = require('convert-units');
const debug = require('debug')('apiResHandler');
var apiHandler = {};

function transferNutrients(responseArray, requestArray) {

    var updatedReqArray = requestArray.map( food => {
        for(let i = 0; i < responseArray.length; i++) {
            if(food.data.ndbno === responseArray[i].desc.ndbno) {
                var unitType = checkUnitType(food.data);

                if(unitType === 'error') {
                    food.data.error = {type:'unit-type', message: 'unit type:' + food.data.portionSize.unit}
                    debug('bad unit type', food.data)
                }
            
                var scalefactor = getScaleFactor(food.data.portionSize, responseArray[i].nutrients, unitType);
          
                food.data.calories = getCalories(responseArray[i].nutrients);
                food.data.proteins = getProteins(responseArray[i].nutrients)
                food.data.carbohydrates = getCarbohydrates(responseArray[i].nutrients)
                food.data.fats = getFats(responseArray[i].nutrients);
                food.data.sugars = getSugars(responseArray[i].nutrients)

                var nfood = applyScaleFactor(scalefactor, food.data)
                debug(food)
                return nfood;
            }
        } 
    });
    return updatedReqArray;
}

function checkUnitType(reqDishItem) {
    
    let unit = reqDishItem.portionSize.unit;

    if(unit === 'qty') {
        return 'qty';
    }
    if(unit === 'g') {
        return 'g';
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
    return 'error';
};

const removeSpaces = (value) => {
    var newString = value;
       if (value.indexOf(' ') > -1) {
           newString = value.replace(/\s/,'-');
       }
   
       return newString;
   }

const isConversionPossible = (conversionObj) => {
    debug('isConversionPOssibe', conversionObj)
    conversionObj.from = removeSpaces(conversionObj.from);
    conversionObj.to = removeSpaces(conversionObj.to)
    let possibleMeasurements = convert().from(conversionObj.from).possibilities();
    for (let i = 0; i < possibleMeasurements.length - 1; i++) {
        if (possibleMeasurements[i] === conversionObj.to) {
            return true;
        }
    }
    debug(`check conversion from: ${conversionObj.from} & to: ${conversionObj.to}`)
    return false;
}

function getScaleFactor(portionSize, nutrients, unitType) {
    
    var standardValue;
    var goodConversion = isConversionPossible({from: portionSize.unit, to: nutrients[0].measures[0].label})
    debug('good conversion', goodConversion);
    if(unitType === 'error') {
        standardValue = 0;
    }
    if(unitType === 'g') {
        standardValue = portionSize.value;
    }
    if(unitType === 'mass') { // convert to gram
        standardValue = convert(portionSize.value)
                        .from(removeSpaces(portionSize.unit))
                        .to(removeSpaces(nutrients[0].unit))
    }
    if(unitType === 'volume') { // convert requested volume to responsded gram
        if(!goodConversion) {
            debug('bad conversion')
            standardValue = 0;
        } else {
            standardValue = convert(portionSize.value)
            .from(removeSpaces(portionSize.unit))
            .to(removeSpaces(nutrients[0].measures[0].label)) * nutrients[0].measures[0].eqv;
        }
        
    }
    // TODO QTY IF statement to convert servings or qtys to grams
    debug('standard value', portionSize.unit, nutrients[0].unit, standardValue)
    var coefficient = (standardValue / 100);

    return coefficient;
}

function applyScaleFactor (coeff, foodObj) {
    var food = foodObj;
    food.calories.total = Number((food.calories.total * coeff).toFixed(3));
    food.proteins.total = Number((food.proteins.total * coeff).toFixed(3));
    food.carbohydrates.total = Number((food.carbohydrates.total * coeff).toFixed(3));
    food.fats.total = Number((food.fats.total * coeff).toFixed(3));
    food.sugars.total = Number((food.sugars.total * coeff).toFixed(3));
    return food;
}

// create conversion object


apiHandler.transferNutrients = transferNutrients;

module.exports = apiHandler;