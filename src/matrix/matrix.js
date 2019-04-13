var MatrixLogic = function(){
};
MatrixLogic.prototype.init = function(rowCount, columnCount, typeCount){
    this.rowCount = rowCount;
    this.columnCount = columnCount;
    this.typeCount= typeCount;
    this.data = [];
    this.itemValueRange = [1, 10];
    for (var i = 0; i < this.rowCount; i++) {
        this.data.push([]);
        for (var j = 0; j < this.columnCount; j++) {
            this.data[i].push(this.newItem());
        }
    }
    cc.log(this.data);
};

MatrixLogic.prototype.newItem = function(){
    var value = this.itemValueRange[0] + Math.floor(Math.random()*(this.itemValueRange[1] - this.itemValueRange[0]));
    var type = Math.floor(Math.random() * this.typeCount);
    return value * 100 + type;
}

var MatrixLayer = cc.Layer.extend({
    sprite:null,
    ctor:function (rowCount, columnCount, typeCount) {
        this._super();
        this.marixLogic = new MatrixLogic();
        this.marixLogic.init(rowCount, columnCount, typeCount);

        return true;
    }
});
