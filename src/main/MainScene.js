/**
 * Created by liuzq on 2019/4/13.
 */

var main = main || {};
main.MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        this.mainLayer = ccs.load(res.mainLayer).node;
        this.addChild(this.mainLayer);

        this._initUI();

        Sound.playMusic("main");
    },

    _initUI : function () {
    	this.btn_time = this.mainLayer.getChildByName("btn_time");
        this.btn_time.addTouchEventListener(this._handClick.bind(this),this.btn_time);

    	this.btn_putong = this.mainLayer.getChildByName("btn_putong");
        this.btn_putong.addTouchEventListener(this._handClick.bind(this),this.btn_putong);

    	this.btn_wuxian = this.mainLayer.getChildByName("btn_wuxian");
        this.btn_wuxian.addTouchEventListener(this._handClick.bind(this),this.btn_wuxian);

    	this.btn_shop = this.mainLayer.getChildByName("btn_shop");
        this.btn_shop.addTouchEventListener(this._handClick.bind(this),this.btn_shop);

    	this.btn_setting = this.mainLayer.getChildByName("btn_setting");
        this.btn_setting.addTouchEventListener(this._handClick.bind(this),this.btn_setting);
    	
    	this.img_yuan = this.mainLayer.getChildByName("img_yuan");
        this.img_yuan.runAction(cc.repeatForever(cc.rotateBy(30, 360)));

    	this.img_xian = this.mainLayer.getChildByName("img_xian");
        var ac = cc.moveBy(2, 0, 15);
        var ac2 = cc.moveBy(2, 0, -15);
        this.img_xian.runAction(cc.repeatForever(cc.sequence(ac, ac2)));

    },

    _handClick : function(btn, et) {
        if(et == ccui.Widget.TOUCH_ENDED) {
            switch (btn) {
                case this.btn_time :
                    sceneMgr.switchToGame(game.TYPE.TIME); 
                break;
                case this.btn_putong :
                    sceneMgr.switchToGame(game.TYPE.NORMAL); 
                break;
                case this.btn_wuxian :
                    sceneMgr.switchToGame(game.TYPE.INFINITE); 
                break;
                case this.btn_shop :
                    var win = new ui.ShopWindow();
                    cc.director.getRunningScene().addChild(win);
                break;
                case this.btn_setting :
                    var win = new ui.SettingWindow();
                    cc.director.getRunningScene().addChild(win);
                break;
            }
        }
    }
});