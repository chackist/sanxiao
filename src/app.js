

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MatrixLayer(6, 6, 4, cc.size(700, 700));
        this.addChild(layer);
    }
});

