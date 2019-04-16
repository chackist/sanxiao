
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

        var url = '';
        switch (type) {
            case 'game':
                url = 'res/sound/game.mp3';
                break;
            case 'main':
                url = 'res/sound/main.mp3';
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
     * @param type
     * @param [loop] {Boolean}
     */
    playEffect: function (type, loop) {
        if (!this._effectSwitch) {
            return;
        }

        var url = '';
        switch (type) {
            case "dianji" :
                url = 'res/sound/dianji.mp3'; 
                break;
            case "lianji" :
                url = 'res/sound/lianji.mp3';
                break;
            case "bomb" :
                url = 'res/sound/effect_bomb.mp3';
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