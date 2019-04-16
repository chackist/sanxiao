/**
 * Created by liuzq on 2019/4/13.
 */

 var ui = ui || {};

 ui.SettingWindow = ccui.Widget.extend({

 	ctor : function(){
 		this._super();
 		this.setTouchEnabled(true);
 		this.setSwallowTouches(true);

 		this.layer = ccs.load(res.settingLayer).node;
        this.addChild(this.layer);
        this._initUI();
 	},

 	_initUI : function(){
 		this.btn_menu = this.layer.getChildByName("btn_menu");
        this.btn_menu.addTouchEventListener(this._handClick.bind(this),this.btn_menu);

    	this.btn_restart = this.layer.getChildByName("btn_restart");
        this.btn_restart.addTouchEventListener(this._handClick.bind(this),this.btn_restart);

    	this.btn_continue = this.layer.getChildByName("btn_continue");
        this.btn_continue.addTouchEventListener(this._handClick.bind(this),this.btn_continue);

    	this.btn_close = this.layer.getChildByName("btn_close");
        this.btn_close.addTouchEventListener(this._handClick.bind(this),this.btn_close);

        this.bar_yx = this.layer.getChildByName("bar_yx");
        this.bar_yx.addEventListener(this._handSlider.bind(this),this.bar_yx);

        this.bar_yy = this.layer.getChildByName("bar_yy");
        this.bar_yy.addEventListener(this._handSlider.bind(this),this.bar_yy);

        if(game.currentType == game.TYPE.NONE) {
        	this.btn_menu.visible = false;
        	this.btn_restart.visible = false;
        	this.btn_continue.visible = false;
        }
 	},

 	_handSlider : function(slider) {
        Sound.playEffect("dianji");
 		if(slider == this.bar_yx) {
 			var val = slider.getPercent();
 			Sound.setGameEffectVolume(Math.round(val));
 		}else if(slider == this.bar_yy) {
 			var val = slider.getPercent();
 			Sound.setGameMusicVolume(Math.round(val));
 		}
 	},

 	_handClick : function(btn, et) {
        if(et == ccui.Widget.TOUCH_ENDED) {
            Sound.playEffect("dianji");
            switch (btn) {
                case this.btn_close :
                    this.removeFromParent(true);
                break;
                case this.btn_menu :
                    sceneMgr.switchToMain(); 
                break;
                case this.btn_restart :
                    sceneMgr.switchToGame(game.currentType); 
                break;
                case this.btn_continue :
                    this.removeFromParent(true);
                break;
            }
        }
    }
 });