var game = game || {};
game.PassWindow = ccui.Widget.extend({
    ctor: function(data) {
        this._super();

        this.layer = ccs.load(res.passLayer).node;
        this.layer.x = (cc.winSize.width - this.layer.width) * 0.5;
        this.layer.y = (cc.winSize.height - this.layer.height) * 0.5;
        this.addChild(this.layer);
        this._initUI(data);
    },
    _initUI: function(data) {
        this.txt_guaqia = this.layer.getChildByName("txt_guaqia");
        this.txt_guaqia.setString(data.guanQia);
        this.txt_fenshu = this.layer.getChildByName("txt_fenshu");
        this.txt_fenshu.setString(data.guanQiaWinScore);

        var dt = cc.delayTime(1);
        var ac = cc.moveTo(0.3, this.x, cc.winSize.height);
        var cb = cc.callFunc(function() {
            this.removeFromParent(true);
        }.bind(this));
        this.runAction(cc.sequence(dt, ac, cb));

        var itemEffect = new cc.ParticleSystem(res.scoreEffect);
        itemEffect.setPosition(cc.p(this.layer.x + this.layer.width * 0.5, this.layer.y + this.layer.height * 0.5));
        this.addChild(itemEffect, 3);
        itemEffect.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function(){
            itemEffect.removeFromParent();
        })));
    }
});