/**
 * Created by liuzq on 2019/4/13.
 */
var game = game || {};
//游戏模式
game.TYPE = {
	TIME : 0,	//时间
	NORMAL : 1, //普通
	INFINITE : 2 //无限
}
//当前游戏模式
game.currentType = 0;
game.GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var layer = ccs.load("res/sanxiao/gameLayer.json").node;
        this.addChild(layer);
        layer = layer.getChildByName("bg");

        this.topMenuLayer = layer.getChildByName("top_menu_layer");
        this.bottomMenuLayer = layer.getChildByName("bottom_menu_layer");
        this.marixBgLayer = layer.getChildByName("marix_bg_layer");

        this.modelLayer = layer.getChildByName("model_" + game.currentType + "_layer");
        this.modelLayer.visible = true;


        var layer = new MatrixLayer(6, 6, 4, cc.size(this.marixBgLayer.width, this.marixBgLayer.height));
        this.marixBgLayer.addChild(layer);
    }
});