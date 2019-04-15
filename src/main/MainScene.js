/**
 * Created by liuzq on 2019/4/13.
 */

var main = main || {};
main.MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        this.mainLayer = ccs.load(res.mainLayer).node;
        this.addChild(this.mainLayer);

        // this._listener = new cc.EventListener.create({

        //         event: cc.EventListener.TOUCH_ONE_BY_ONE,

        //         swallowTouches: false,

        //         onTouchBegan: function(touch, event)

        //         {
        //             sceneMgr.switchToGame();
        //         }
        //     },this);
        // cc.eventManager.addListener(this._listener, this);

        this._initUI();
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
    	this.img_xian = this.mainLayer.getChildByName("img_xian");
    },

    _handClick : function(btn) {
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
                
            break;
            case this.btn_setting :
                
            break;
        }
    }
});