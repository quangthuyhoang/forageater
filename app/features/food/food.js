const schemas = require('../common/foodSchema');
const _ = require('lodash');

function Food(args) {
  
  this.data = this.sanitize(args);

  this.ndbnoIsValid = function() {
    return this.data.ndbno && /^\d+$/.test(this.data.ndbno);
  }

  this.portionSizeIsValid = function() {
    return (
      this.data.portionSize.value && 
      this.data.portionSize.value > 0 &&
      this.data.portionSize.unit 
    )
  }

  this.nutritionIsValid = function() {
    return (
        this.data.calories.total > -1 && this.data.calories.unit &&
        this.data.proteins.total > -1 && this.data.proteins.unit &&
        this.data.carbohydrates.total > -1 && this.data.carbohydrates.unit &&
        this.data.fats.total > -1 && this.data.fats.unit &&
        this.data.sugars.total > -1 && this.data.sugars.unit
    )
  }

  this.validationMessage = function() {
    if (this.isValid()) {
      return 'Food is all good';
    } else if (!this.ndbnoIsValid()) {
      return 'invalid NDBNO';
    } else if (!this.portionSizeIsValid()) {
      return 'invalid portionSize';
    } else if (!this.nutritionIsValid()) {
      return 'invalid nutrition';
    }
  }

  this.isValid = function() {
    return (
      this.ndbnoIsValid() &&
      this.portionSizeIsValid() &&
      this.nutritionIsValid()
    )
  }
}

Food.prototype.sanitize = function (data) {
  let datas = data || {};
  let foodSchema = schemas.food;
  return _.pick(_.defaults(datas, foodSchema), _.keys(foodSchema));
}

Food.prototype.data = {};

Food.prototype.get = function (name) {
  return this.data[name];
}

Food.prototype.set = function (name, value) {
  this.data[name] = value;
}

Food.prototype.upc_check = function (name) {
  let index = name.toUpperCase().indexOf(', UPC:');
  let upc = (index > -1) ? name.substring(index + 7, name.length) : false;
  if(!upc) {
    return;
  }
  return upc;
}

module.exports = Food;