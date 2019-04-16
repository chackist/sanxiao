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
    ctor:function (data) {
        this._super();
        var layer = ccs.load("res/sanxiao/gameLayer.json").node;
        this.addChild(layer);
        layer = layer.getChildByName("bg");
        this.layer = layer;

        this.topMenuLayer = layer.getChildByName("top_menu_layer");
        this.bottomMenuLayer = layer.getChildByName("bottom_menu_layer");
        this.marixBgLayer = layer.getChildByName("marix_bg_layer");

        this.logic = new GameLogic();
        var data = userDefault.getStringForKey(config.Key.GamePlay + game.currentType, "");
        if (data.length > 0) {
        	data = JSON.parse(data);
        }else{
        	data = {};
        }
        this.logic.init(this, layer, game.currentType, data);

        this.marixLayer = new MatrixLayer(6, 6, 4, cc.size(this.marixBgLayer.width, this.marixBgLayer.height) , this.logic);
        this.marixBgLayer.addChild(this.marixLayer);

        this._initUI();

        Sound.playMusic("game");
    },

    _initUI : function() {
    	this.caidang_btn = this.topMenuLayer.getChildByName("caidang_btn");
    	this.caidang_btn.addTouchEventListener(this._handClick.bind(this), this.caidang_btn);
    	this.del_btn = this.bottomMenuLayer.getChildByName("del_btn");
    	this.del_btn.addTouchEventListener(this._handClick.bind(this), this.caidang_btn);
    	this.help_btn = this.bottomMenuLayer.getChildByName("help_btn");
    	this.help_btn.addTouchEventListener(this._handClick.bind(this), this.caidang_btn);
    	this.add_step_btn = this.layer.getChildByName("model_1_layer").getChildByName("add_step_btn");
    	this.add_step_btn.addTouchEventListener(this._handClick.bind(this), this.caidang_btn);
    },

    _handClick : function(btn, et) {
        if(et == ccui.Widget.TOUCH_ENDED){
            switch (btn) {
                case this.caidang_btn :
                    var win = new ui.SettingWindow();
                    cc.director.getRunningScene().addChild(win);
                	break;
                case this.del_btn :
                	//扣除金币
                	this.marixLayer.setDeleteSelecting(true);
                	break;
                case this.help_btn :
                	//扣除金币
                	this.marixLayer.drawHelpLine();
                	break;
                case this.add_step_btn :
                	//扣除金币
                	this.logic.addStep(2);
                	break;
            }
        }
    	
    },

    setGamePlayData(type, data){
    	userDefault.setStringForKey(config.Key.GamePlay + type, JSON.stringify(data));
    },

});



