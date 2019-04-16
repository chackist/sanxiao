var sceneType = {
    MAIN : 0, //大厅
    GAME : 1,   //游戏场景
};

/**
 * 场景切换管理器
 */
var sceneMgr = {
    currentType : -1,

    /**
     * 切换到主场景
     */
    switchToMain: function () {
        game.currentType = -1;
        cc.director.runScene(new main.MainScene());
        this.currentType = sceneType.MAIN;
    },

    /**
     * 切换到游戏场景
     */
    switchToGame: function (type, data) {
        game.currentType = type;
        cc.director.runScene(new game.GameScene(data));
        this.currentType = sceneType.GAME;
    }

};