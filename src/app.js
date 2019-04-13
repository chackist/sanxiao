

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MatrixLayer(6, 6, 4, cc.size(731, 788));
        this.addChild(layer);
    }
});

