'use strict'
const debug = require('debug')('apiParser');
const api = {};

// NUTRITION LIST API PARSER
// Main function: Input JSON object from API -> Outputs JSON object for client
function calcTotalNutritionalValue(dish) { // receive an array
    // Need each nutrient list
    let calorieLists = getCalorieList(dish);
    let proteinLists = getProteinList(dish);
    let fatLists = getFatList(dish);
    let carbohydrateLists = getCarbohydrateList(dish);
    let sugarLists = getSugarList(dish);
    debug("calories", calorieLists)
    debug("proteins", proteinLists)
    debug("fatlist", fatLists)
    debug("carbohydrates", carbohydrateLists)
    debug("sugarlist", sugarLists)
    return {
        calories: {
            total: sumNutrientValues(calorieLists),
            unit: calorieLists[0].unit
        },
        protein: {
           total: sumNutrientValues(proteinLists),
           unit: proteinLists[0].unit
        },
        carbohydrates: {
            total: sumNutrientValues(fatLists),
            unit: carbohydrateLists[0].unit
        },
        fats: {
            total: sumNutrientValues(carbohydrateLists),
            unit: fatLists[0].unit
        },
        sugar: {
            total: sumNutrientValues(sugarLists),
            unit: sugarLists[0].unit
        }
    }
}

// *** BREAK DOWN OF MAIN FUNCTION INTO BASE FUNCTIONS ***

// Component Functions:

// Get Nutrient List for each food item
function getNutrientList(dish) {
    return dish.map( item => item.nutrients)
}
// option to look for certain nutrients
// { nutrient_id: [], name: []}
// ["208", "209", "210"]

// Input nutrients array -> output sum of all values
function sumNutrientValues(nutrientvalues) {
    
  let sumVal = nutrientvalues
  .map(nutrient => nutrient.value)
  .reduce((prev, curr) => prev + curr);
  return Math.round(sumVal);
}

// Base nutrition function
// Input Array of Nutrition List from API, specific nutrient_id e.g. "208"
// Output Array of value and unit of nutrient_id
function getNutrients(nutrientlist, nutrient_id) {
    let n = nutrientlist.map( (item) => {
        // match nutrient_id types
        let nID = item.nutrient_id;
        if(typeof nID === 'string') {
            nID = Number(item.nutrient_id)
        } 

        if(nID === nutrient_id) {
            return {
                value: Number(item.value),
                unit: item.unit
            }
        }
    }).filter((el) => !!el)
    if(typeof n[0] !== 'object') {
        return {
            value: 0,
            unit: 'g'
        };
    }
    return n[0];
}

function getCalories(nutrientlist) {
    let calorieList = getNutrients(nutrientlist, 208)
    return calorieList;
}

function getProtein(nutrientlist) {
    return getNutrients(nutrientlist, 203)
}

function getFats(nutrientlist) {
    return getNutrients(nutrientlist, 204)
}

function getCarbohydrates(nutrientlist) {
    return getNutrients(nutrientlist, 205)
}

function getSugar(nutrientlist) {
    return getNutrients(nutrientlist, 269)
}

function getCalorieList(fullDishList) {
    let calorieList = fullDishList.map(food => {
        return getCalories(food.nutrients)
    });
    return calorieList;
}

function getProteinList(fullDishList) {
    return fullDishList.map(food => {
        return getProtein(food.nutrients)
    });
}

function getFatList(fullDishList) {
    return fullDishList.map(food => {
        return getFats(food.nutrients)
    });
}

function getCarbohydrateList(fullDishList) {
    return fullDishList.map(food => {
        return getCarbohydrates(food.nutrients)
    });
}

function getSugarList(fullDishList) {
    return fullDishList.map(food => {
        return getSugar(food.nutrients)
    });
}

api.sumNutrientValues = sumNutrientValues; // testing purposes
api.getCalorieList = getCalorieList; // testing purposes
api.getCalories = getCalories; // testing purposes
api.calcTotalNutritionalValue = calcTotalNutritionalValue;

module.exports = api;