/**
 * Created by liuzq on 2019/4/13.
 */

 var ui = ui || {};

 ui.ShopWindow = ccui.Widget.extend({

 	ctor : function(){
 		this._super();
 		this.setTouchEnabled(true);
 		this.setSwallowTouches(true);

 		this.layer = ccs.load(res.shopLayer).node;
        this.addChild(this.layer);
        this._initUI();
 	},

 	_initUI : function(){
    	this.btn_close = this.layer.getChildByName("btn_close");
        this.btn_close.addTouchEventListener(this._handClick.bind(this),this.btn_close);
        this.itemList = [];
        for(var i = 0; i < 4; i++) {
        	var item = this.layer.getChildByName("item_" + i);
        	item.index = i;
        	item.addTouchEventListener(this._handClick.bind(this),item);
        	this.itemList.push(item);
        }
 	},

 	_handSlider : function(slider) {
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
        	if(btn == this.btn_close) {
        		this.removeFromParent(true);
        	} else {
        		cc.log(btn.index);
        	}
        }
    }
 });