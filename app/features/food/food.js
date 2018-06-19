// food model: foodID/ndbno, group, manu, name, upc, offset, portionsize, ds

// Food Class
// {
//   ndbno,
//   group,
//   manu,
//   name,
//   portionSize,
//   *optional:
//   upc,
//   offset,
//   ds
// }

const schemas = require('../common/foodSchema');
const _ = require('lodash');

function Food(foodObj) {
  this.data = this.sanitize(foodObj);
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