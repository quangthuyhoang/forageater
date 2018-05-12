// option object
// {
//     ds: "Standard Reference",
//     sort: "n",
//     max: 100,
//     offset: 0,
//     format:
// }

function searchOption(obj) {
    var self = this;
    self.sort = obj.sort || 'n';
    self.max = obj.max || 10;
    self.offset = obj.offset || 0;
    self.f = obj.format || 'f';
    self.ds = obj.ds || null;
}

searchOption.prototype.updateDataSource = function(obj) {
    this.ds = obj.ds;
}

searchOption.prototype.update = function(key, val) {
    this[key] = val;
}

searchOption.prototype.getParameters = function() {
    if(!this.ds) {
        return '&sort=' + this.sort + '&max=' + this.max + '&offset=' + this.offset;
    }
    return '&sort=' + this.sort + '&max=' + this.max + '&ds=' + this.ds + '&offset=' + this.offset;
}

module.exports = searchOption;