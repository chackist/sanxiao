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
        cc.director.runScene(new main.MainScene());
        this.currentType = sceneType.MAIN;
    },

    /**
     * 切换到游戏场景
     */
    switchToGame: function () {
        cc.director.runScene(new game.GameScene());
        this.currentType = sceneType.GAME;
    }

};