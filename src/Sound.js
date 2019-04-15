
var Sound = {
    _musicSwitch: userDefault.getBoolForKey("music.switch", true),    // 音乐开关
    _musicVolume: 100,       // 音乐音量

    _effectSwitch: userDefault.getBoolForKey("effect.switch", true),    // 音效开关
    _effectVolume: 100,      // 音效音量

    // 设置音乐开关
    setGameMusicSwitch: function (enabled) {
        this._musicSwitch = (enabled != undefined) ? enabled : !this._musicSwitch;

        // 如果关闭音乐
        if (!this._musicSwitch && cc.audioEngine.isMusicPlaying()) {
            clearInterval(this._timer);
            cc.audioEngine.stopMusic(true);
        }

        // 如果打开音乐
        if (this._musicSwitch) {
            this.playMusic("map", true);
        }

        userDefault.setBoolForKey("music.switch", this._musicSwitch);
    },
    stopGameMusic : function(){
        // 如果关闭音乐
        if (this._musicSwitch && cc.audioEngine.isMusicPlaying()) {
            clearInterval(this._timer);
            cc.audioEngine.stopMusic(false);
        }
    },
    getMusic : function(){
      return this._musicSwitch;
    },
    getSound : function(){
        return this._effectSwitch;
    },

    // 设置音乐音量
    setGameMusicVolume: function (volume) {
        this._musicVolume = volume != undefined ? volume : 100;
        cc.audioEngine.setMusicVolume(this._musicVolume);
    },

    // 设置音效开关
    setGameEffectSwitch: function (enabled) {
        this._effectSwitch = (enabled != undefined) ? enabled : !this._effectSwitch;

        userDefault.setBoolForKey("effect.switch", this._effectSwitch);
    },

    // 设置音效音量
    setGameEffectVolume: function (volume) {
        this._effectVolume = volume != undefined ? volume : 100;
        cc.audioEngine.setEffectsVolume(this._effectVolume);
    },

    /**
     * 播放音乐
     * @param type {String} 类型
     * @param [loop] {Boolean} 是否循环
     */
    playMusic: function (type, loop) {
        if (!this._musicSwitch) {
            return;
        }
        if (loop === undefined) {
            loop = true;
        }

        // 延时一段时间后还原为大地图音乐
        var delayRevertMap = 0;

        var url = '';
        switch (type) {
            case 'game':
                url = 'res/music/battle.mp3';               // 战斗
                break;
            case 'map':
                url = 'res/music/worldMusic.mp3';           // 大地图
                break;
            case 'welcome':
                url = 'res/music/newLogin.mp3';             // 欢迎界面(登录界面)
                break;
            case 'march':
                url = 'res/music/music_march.mp3';          // 出征音乐
                delayRevertMap = 36 + 2;
                break;
            case 'city':
                url = 'res/music/music_city.mp3';           // 打开城堡时
                break;
            case 'enemy':
                url = 'res/music/music_enemy.mp3';          // 敌袭
                delayRevertMap = 36 + 2;
                break;
        }

        if (url === '') {
            return;
        }

        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url, loop);
    },

    /**
     * 播放音效
     * @param type {Number}
     * @param [loop] {Boolean}
     */
    playEffect: function (type, loop) {
        if (!this._effectSwitch) {
            return;
        }

        var url = '';
        switch (type) {
            case 1 :
                url = 'res/music/button.mp3';               // 按钮音效
                break;
            case 2 :
                url = 'res/music/interfacePop.mp3';         // 界面弹出
                break;
            case 3 :
                url = 'res/music/interfaceJump.mp3';        // 界面跳转
                break;
            case 4 :
                url = 'res/music/cardPutIn.mp3';            // 卡牌放入
                break;
            case 5 :
                url = 'res/music/gold.mp3';                 // 金币音效
                break;
            case 6 :
                url = 'res/music/recruit.mp3';              // 普通抽卡
                break;
            case 7 :
                url = 'res/music/recruit1.mp3';             // 高级抽卡
                break;
            case 8 :
                url = 'res/music/advanced.mp3';             // 卡牌进阶
                break;
            case 9 :
                url = 'res/music/awakening.mp3';            // 卡牌觉醒
                break;
            case 10 :
                url = 'res/music/equipStrengthen.mp3';      // 装备强化
                break;
            case 11 :
                url = 'res/music/equipUnload.mp3';          // 装备卸载
                break;
            case 12 :
                url = 'res/music/skillDecompose.mp3';       // 技能拆解
                break;
            case 13 :
                url = 'res/music/skillResearch.mp3';        // 技能研究
                break;
            case 14 :
                url = 'res/music/skillStudy.mp3';           // 技能学习
                break;
            case 15 :
                url = 'res/music/skillUpgrade.mp3';         // 技能升级
                break;
            case 16 :
                url = 'res/music/skillForget.mp3';          // 技能遗忘
                break;
            case 17 :
                url = 'res/music/armyConvert.mp3';          // 兵种转化
                break;
            case 18 :
                url = 'res/music/armyExchange.mp3';         // 兵种切换
                break;
            case 19 :
                url = 'res/music/dingDing.mp3';             // 叮叮音效
                break;
            case 20 :
                url = 'res/music/attrUpgrade.mp3';          // 属性提升
                break;
            case 21 :
                url = 'res/music/game/passivitySpell.mp3';  // 被动技能音效
                break;
            case 22 :
                url = 'res/music/game/infantryMove.mp3';    // 步兵(弓兵)移动音效
                break;
            case 23 :
                url = 'res/music/game/infantryAttack.mp3';  // 步兵攻击音效
                break;
            case 24 :
                url = 'res/music/game/continueHurt.mp3';    // 部队受到持续伤害状态和扣血音效
                break;
            case 25 :
                url = 'res/music/game/arrowTargetHurt.mp3'; // 弓兵部队目标受击音效
                break;
            case 26 :
                url = 'res/music/game/arrowShoot.mp3';      // 弓兵部队射箭音效
                break;
            case 27 :
                url = 'res/music/game/spell1.mp3';          // 技能表现音效1
                break;
            case 28 :
                url = 'res/music/game/spell2.mp3';          // 技能表现音效2
                break;
            case 29 :
                url = 'res/music/game/cavalryAttack.mp3';   // 骑兵攻击特效
                break;
            case 30 :
                url = 'res/music/game/cavalryMove.mp3';     // 骑兵移动音效
                break;
            case 31 :
                url = 'res/music/game/changeHero.mp3';      // 行动英雄切换音效
                break;
            case 32 :
                url = 'res/music/game/heroDead.mp3';        // 英雄死亡斩击音效
                break;
            case 33 :
                url = 'res/music/game/gameStart.mp3';       // 战斗开始音效
                break;
            case 34 :
                url = 'res/music/game/gameDraw.mp3';        // 战斗平局音效
                break;
            case 35 :
                url = 'res/music/game/gameFail.mp3';        // 战斗失败音效
                break;
            case 36 :
                url = 'res/music/game/gameWin.mp3';         // 战斗胜利音效
                break;
            case 37 :
                url = 'res/music/game/conductSpellEnemy.mp3';// 指挥技能音效（敌方目标）
                break;
            case 38 :
                url = 'res/music/game/conductSpellMy.mp3';   // 指挥技能音效（己方目标）
                break;
            case 39 :
                url = 'res/music/game/initiativeSpellEnemy.mp3';// 主动技能音效（敌方目标）
                break;
            case 40 :
                url = 'res/music/game/initiativeSpellMy.mp3';// 主动技能音效（己方目标）
                break;
            case 41 :
                url = 'res/music/game/followSpell.mp3';      // 追击技能音效
                break;
            case 42 :
                url = 'res/music/upgrade.mp3';              //产量提升音效
                break;
            case 43 :
                url = 'res/music/cardPutDown.mp3';          //卡牌下压音效
                break;
        }
        if (url === '') {
            cc.error('bad sound effect type=' + type);
            return;
        }
        loop = loop || false;
        cc.audioEngine.playEffect(url, loop);
    }

};