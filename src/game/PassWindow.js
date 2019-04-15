var game = game || {};

 game.PassWindow = ccui.Widget.extend({

 	ctor : function(){
 		this._super();

 		this.layer = ccs.load(res.passLayer).node;
 		this.layer.x = (cc.winSize.width - this.layer.width) * 0.5;
 		this.layer.y = (cc.winSize.height - this.layer.height) * 0.5;
        this.addChild(this.layer);
        this._initUI();
 	},
 	_initUI : function(){
 		this.txt_guaqia = this.layer.getChildByName("txt_guaqia");
        this.txt_fenshu = this.layer.getChildByName("txt_fenshu");

        var dt = cc.delayTime(2);
        var ac = cc.moveTo(1, this.x, cc.winSize.height);
        var cb = cc.callFunc(function(){
        	this.removeFromParent(true);
        }.bind(this));
        this.runAction(cc.sequence(dt, ac, cb));
 	}
 });