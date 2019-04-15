/**
 * Created by liuzq on 2019/4/13.
 */

 var game = game || {};

 game.EndWindow = ccui.Widget.extend({

 	ctor : function(){
 		this._super();

 		this.layer = ccs.load(res.endLayer).node;
        this.addChild(this.layer);
        this._initUI();
 	},

 	_initUI : function(){
 		this.btn_menu = this.layer.getChildByName("btn_menu");
        this.btn_menu.addTouchEventListener(this._handClick.bind(this),this.btn_menu);

    	this.btn_restart = this.layer.getChildByName("btn_restart");
        this.btn_restart.addTouchEventListener(this._handClick.bind(this),this.btn_restart);

    	this.btn_share = this.layer.getChildByName("btn_share");
        this.btn_share.addTouchEventListener(this._handClick.bind(this),this.btn_continue);

        this.txt_guaqia = this.layer.getChildByName("txt_guaqia");
        this.txt_fenshu = this.layer.getChildByName("txt_fenshu");
        this.txt_zuijia = this.layer.getChildByName("txt_zuijia");
        this.txt_jinbi = this.layer.getChildByName("txt_jinbi");
 	},

 	_handClick : function(btn, et) {
        if(et == ccui.Widget.TOUCH_ENDED) {
            switch (btn) {
                case this.btn_menu :
                    sceneMgr.switchToMain(); 
                break;
                case this.btn_restart :
                    sceneMgr.switchToGame(game.currentType); 
                break;
                case this.btn_share :
                    cc.log("分享");
                break;
            }
        }
    }
 });