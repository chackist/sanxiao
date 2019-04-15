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
    ctor:function () {
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

        this._initUI();
    },

    _initUI : function() {
    	this.caidang_btn = this.topMenuLayer.getChildByName("caidang_btn");
    	this.caidang_btn.addTouchEventListener(this._handClick.bind(this), this.caidang_btn);
    },

    _handClick : function(btn, et) {
        if(et == ccui.Widget.TOUCH_ENDED){
            switch (btn) {
                case this.caidang_btn :
                    var win = new ui.SettingWindow();
                    cc.director.getRunningScene().addChild(win);
                break;
            }
        }
    	
    }
});


