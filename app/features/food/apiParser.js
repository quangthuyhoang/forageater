'use strict'
const debug = require('debug')('apiParser');
const api = {};

// NUTRITION LIST API PARSER
// Main function: Input JSON object from API -> Outputs JSON object for client
function calcTotalNutritionalValue(dish) { // receive an array
    return {
        calories: {
            total: sumNutrientVal('calories', dish),
            unit: 'kcal'
        },
        protein: {
           total: sumNutrientVal('proteins', dish),
           unit: 'g'
        },
        carbohydrates: {
            total: sumNutrientVal('carbohydrates',dish),
            unit: 'g'
        },
        fats: {
            total: sumNutrientVal('fats',dish),
            unit: 'g'
        },
        sugar: {
            total: sumNutrientVal('sugars', dish),
            unit: 'g'
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
// sum calories
function sumNutrientVal (key, foodArray) {
    console.log(key, foodArray)
    let sumVal = foodArray
    .map( food =>  food[key].total)
    .reduce((prev, curr) => prev + curr);
    return Math.round(sumVal);
}

// Input nutrients array -> output sum of all values
// function sumNutrientValues(nutrientvalues) {
    
//   let sumVal = nutrientvalues
//   .map(nutrient => nutrient.value)
//   .reduce((prev, curr) => prev + curr);
//   return Math.round(sumVal);
// }

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
                total: Number(item.value),
                unit: item.unit
            }
        }
    }).filter((el) => !!el)
    if(typeof n[0] !== 'object') {
        return {
            total: 0,
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

api.sumNutrientVal = sumNutrientVal; // testing purposes
api.getCalorieList = getCalorieList; // testing purposes
api.getCalories = getCalories;
api.getProteins = getProtein;
api.getCarbohydrates = getCarbohydrates;
api.getFats = getFats;
api.getSugars = getSugar;
api.calcTotalNutritionalValue = calcTotalNutritionalValue;

module.exports = api;