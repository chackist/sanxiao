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
        
        this.logic = new GameLogic();
        this.logic.init(this, layer, game.currentType, data);
        this._initUI();

        Sound.playMusic("game");
    },

    _initUI : function() {
    	this.caidang_btn = this.topMenuLayer.getChildByName("caidang_btn");
    	this.caidang_btn.addTouchEventListener(this._handClick.bind(this), this.caidang_btn);
    	this.del_btn = this.bottomMenuLayer.getChildByName("del_btn");
    	this.del_btn.addTouchEventListener(this._handClick.bind(this), this.del_btn);
    	this.del_btn.getChildByName("tv").setString(config.PropPrice.Del + "");
    	this.help_btn = this.bottomMenuLayer.getChildByName("help_btn");
    	this.help_btn.addTouchEventListener(this._handClick.bind(this), this.help_btn);
    	this.help_btn.getChildByName("tv").setString(config.PropPrice.Help + "");
    	this.add_step_btn = this.layer.getChildByName("model_1_layer").getChildByName("add_step_btn");
    	this.add_step_btn.getChildByName("tv").setString(config.PropPrice.AddStep + "");
    	this.add_step_btn.addTouchEventListener(this._handClick.bind(this), this.add_step_btn);
    },

    _handClick : function(btn, et) {
        if(et == ccui.Widget.TOUCH_ENDED){
            switch (btn) {
                case this.caidang_btn :
                    var win = new ui.SettingWindow();
                    cc.director.getRunningScene().addChild(win);
                	break;
                case this.del_btn :
                	this.logic.doDelete();

                	break;
                case this.help_btn :
                	this.logic.doShowHelp();

                	break;
                case this.add_step_btn :
                	this.logic.doAddStep();
                	break;
            }
        }
    	
    },

    //{guanQiaWinScore:this.guanQiaWinScore, guanQia:this.guanQia, type:this.type}
    win:function(data){
    	//显示弹窗
    },

    //{winCoin:winCoin, allWinScore:this.allWinScore, guanQia:this.guanQia, type:this.type}
    lose:function(data){
    	var bestScore = userDefault.getIntegerForKey(config.Key.GameBestRecord + data.type, 0);
    	var isNewBest = data.allWinScore > bestScore;
    	userDefault.setIntegerForKey(config.Key.GameBestRecord + data.type, data.allWinScore);
    	//显示弹窗
    },
});



