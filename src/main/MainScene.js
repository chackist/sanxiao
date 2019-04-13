/**
 * Created by liuzq on 2019/4/13.
 */

var main = main || {};
main.MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var bg = new cc.Sprite(res.mainBg);
        bg.x = cc.winSize.width * 0.5;
        bg.y = cc.winSize.height * 0.5;
        this.addChild(bg);

        this._listener = new cc.EventListener.create({

                event: cc.EventListener.TOUCH_ONE_BY_ONE,

                swallowTouches: false,

                onTouchBegan: function(touch, event)

                {
                    sceneMgr.switchToGame();
                }
            },this);
        cc.eventManager.addListener(this._listener, this);
    }
});