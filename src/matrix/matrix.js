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
            this.data[i].push(this.newItem() );
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
    ctor:function (rowCount, columnCount, typeCount, size) {
        this._super();
        this.marixLogic = new MatrixLogic();
        this.marixLogic.init(rowCount, columnCount, typeCount);

        this.setContentSize(size.width, size.height);
        this.initTouchLayer();
        return true;
    },

    initTouchLayer:function(){
        this.touchLayer = new ccui.Widget();
        this.addChild(this.touchLayer);
        this.touchLayer.setContentSize(this.width, this.height);
        this.touchLayer.isTouching = false;
        this.touchLayer.addTouchEventListener(function(touchLayer, eventType) {
           
            if (eventType == ccui.Widget.TOUCH_BEGAN) {
                if (touchLayer.isTouching) {return;}
                touchLayer.isTouching =  true;
                 cc.log(touchLayer.getTouchBeganPosition());
            }else if (eventType == ccui.Widget.TOUCH_MOVED) {
                 cc.log(touchLayer.getTouchBeganPosition());
            }else if (eventType == ccui.Widget.TOUCH_ENDED || eventType == ccui.Widget.TOUCH_CANCELED) {
                 cc.log(touchLayer.getTouchEndPosition());
            }
        });
    }

});
