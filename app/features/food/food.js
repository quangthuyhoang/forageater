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
  let data = data || {};
  let foodSchema = schemas.food;
  return _.pick(_.defaults(data, foodSchema), _.keys(foodSchema));
}

Food.prototype.data = {};

Food.prototype.get = function (name) {
  return this.data[name];
}

Food.prototype.set = function (name, value) {
  this.data[name] = value;
}