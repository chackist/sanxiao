/**
 * Created by liuzq on 2019/4/13.
 */
var game = game || {};
game.GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var layer = new MatrixLayer(6, 6, 4, cc.size(600, 600));
        this.addChild(layer);
    }
});