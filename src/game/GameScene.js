/**
 * Created by liuzq on 2019/4/13.
 */
var game = game || {};
//游戏模式
game.TYPE = {
	NONE : -1, //无游戏场景
	TIME : 0,	//时间
	NORMAL : 1, //普通
	INFINITE : 2 //无限
}
//当前游戏模式
game.currentType = -1;
game.GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var layer = new MatrixLayer(6, 6, 4, cc.size(600, 600));
        this.addChild(layer);
    }
});