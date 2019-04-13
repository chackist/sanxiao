/**
 * Created by liuzq on 2019/4/13.
 */

var main = main || {};
main.MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        this.mainLayer = ccs.load(res.mainLayer).node;
        this.addChild(this.mainLayer);

        this._listener = new cc.EventListener.create({

                event: cc.EventListener.TOUCH_ONE_BY_ONE,

                swallowTouches: false,

                onTouchBegan: function(touch, event)

                {
                    sceneMgr.switchToGame();
                }
            },this);
        cc.eventManager.addListener(this._listener, this);

        this._initUI();
    },

    _initUI : function () {
    	this.btn_time = this.mainLayer.getChildByName("btn_time");
        this.btn_time.addTouchEventListener(this._handClick.bind(this),this.btn_time);
    	this.btn_putong = this.mainLayer.getChildByName("btn_putong");
    	this.btn_wuxian = this.mainLayer.getChildByName("btn_wuxian");
    	this.btn_shop = this.mainLayer.getChildByName("btn_shop");
    	this.btn_setting = this.mainLayer.getChildByName("btn_setting");
    	
    	this.img_yuan = this.mainLayer.getChildByName("img_yuan");
    	this.img_xian = this.mainLayer.getChildByName("img_xian");
    },

    _handClick : function(btn) {
        switch (btn) {
            case this.btn_time :
                sceneMgr.switchToGame(); 
            break;
        }
    }
});