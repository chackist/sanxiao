var MatrixLogic = function(){
};
MatrixLogic.prototype.init = function(rowCount, columnCount, typeCount){
    this.rowCount = rowCount;
    this.columnCount = columnCount;
    this.typeCount= typeCount;
    this.data = [];
    this.itemValueRange = [1, 3];
    for (var i = 0; i < this.rowCount; i++) {
        this.data.push([]);
        for (var j = 0; j < this.columnCount; j++) {
            this.data[i].push(this.newItem() );
        }
    }
};

MatrixLogic.prototype.newItem = function(){
    var value = this.itemValueRange[0] +Math.floor( Math.random()*(this.itemValueRange[1] - this.itemValueRange[0] + 1));
    var type = Math.floor(Math.random() * this.typeCount);
    return value * 100 + type;
}

MatrixLogic.Config = {
    Color:[cc.color(125,0,0),cc.color(0,125,0),cc.color(0,0,0),cc.color(255,255,255),cc.color(125,254,0)]
}

var MatrixLayer = cc.Layer.extend({
    sprite:null,
    ctor:function (rowCount, columnCount, typeCount, size) {
        this._super();
        this.matrixItems = [];
        this.marixLogic = new MatrixLogic();
        this.marixLogic.init(rowCount, columnCount, typeCount);

        this.setContentSize(size.width, size.height);
        this.itemSize = cc.size(size.width / columnCount, size.height / rowCount); 
        this.initTouchLayer();
        this.resetMatix();
        return true;
    },

    initTouchLayer:function(){
        this.touchLayer = new ccui.Layout();
        this.touchLayer.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.touchLayer.setBackGroundColor(cc.color(0,0,255));
        this.touchLayer.setBackGroundColorOpacity(255);

        this.addChild(this.touchLayer);
        this.touchLayer.setContentSize(this.width, this.height);
        this.touchLayer.isTouching = false;
        this.touchLayer.setTouchEnabled(true);

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

        var cloneItemNode = new ccui.ImageView();
        this.cloneItemNode = ccs.load("res/sanxiao/matrixItemNode.json").node;
        this.cloneItemNode.visible = false;
        this.addChild(this.cloneItemNode);
    },

    resetMatix:function(){
        for (var i = 0; i < this.matrixItems.length; i++) {
            this.matrixItems[i].removeFromParent();
        }
        this.matrixItems = [];
        
        for (var i = 0; i < this.marixLogic.data.length; i++) {
            var row = this.marixLogic.data[i];
            for (var j = 0; j < row.length; j++) {
                var value = row[j];
                var itemNode = this.cloneItemNode.clone();
                itemNode.visible = true;
                itemNode.getChildByName("bg_iv").loadTexture("res/white.png");
                itemNode.getChildByName("score_tv").setString(Math.floor(value / 100) + "");
                this.addChild(itemNode);
                itemNode.x = this.width / this.marixLogic.rowCount * (j + 0.5);
                itemNode.y = this.height / this.marixLogic.columnCount * (i + 0.5);
            }
        }
    }
});
