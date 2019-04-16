var GameLogic = function(){
};

GameLogic.prototype.init = function (scene, layer, type, data) {
	data = data || {};
	this.guanQia = data.guanQia || 1;
	this.useTime = data.useTime || 0;
	this.useStep = data.useStep || 0;
	this.allStep = data.allStep;
	this.matrix = data.matrix;
	this.guanQiaWinScore = data.guanQiaWinScore || 0;
	this.guanQiaWinScoreArr = data.guanQiaWinScoreArr || [0,0,0,0];
	this.allWinScore = data.allWinScore || 0;
	this.type = type;

	this.cfg  = config.Logic["Type" + type];
	this.scene = scene;
	this.layer = layer;

    this.modelLayer = layer.getChildByName("model_" + this.type + "_layer");
    this.modelLayer.visible = true;

	var ui = this.ui = {};

	ui.coinTv = layer.getChildByName("bottom_menu_layer").getChildByName("coin_info").getChildByName("tv");
	ui.oneStepScoreLayer = layer.getChildByName("top_menu_layer").getChildByName("one_step_score_info");
	ui.oneStepTv = ui.oneStepScoreLayer.getChildByName("tv");
	ui.oneStepTv.visible = false;

	ui.scoreTv = this.modelLayer.getChildByName("score_info").getChildByName("tv");
	ui.guanQiaTv = this.modelLayer.getChildByName("guanqia_info").getChildByName("tv");

	if (this.type == 0) {
		ui.guanQiaScoreTv = this.modelLayer.getChildByName("guanqia_score").getChildByName("tv");
		ui.guanQiaScorePro = this.modelLayer.getChildByName("guanqia_score").getChildByName("pro");
		ui.guanQiaTimeTv = this.modelLayer.getChildByName("guanqia_time").getChildByName("tv");
		ui.guanQiaTimePro = this.modelLayer.getChildByName("guanqia_time").getChildByName("pro");
	}else if (this.type == 1) {
		ui.addStepBtn = this.modelLayer.getChildByName("add_step_btn");
		ui.scoreInfoArr = [];
		for (var i = 0; i < 4; i++) {
			var node = this.modelLayer.getChildByName("score_color_info").getChildByName("c" + (i + 1));
			var pro = new cc.ProgressTimer(new cc.Sprite(config.Items[i].Frame));
			node.addChild(pro);
			pro.width = node.width;
			pro.height = node.height;
			pro.type = cc.ProgressTimer.TYPE_RADIAL;
			pro.setPercentage(100);
        	pro.setReverseDirection(true);
			pro.setPosition(node.width / 2, node.height / 2);
			var tv = node.getChildByName("tv");
			tv.setTextColor(config.Items[i].LineColor);
			ui.scoreInfoArr.push({pro:pro,tv:tv});
		}
		ui.stepTv = this.modelLayer.getChildByName("step_info").getChildByName("tv");
	}else if (this.type == 2) {
		ui.guanQiaScoreTv = this.modelLayer.getChildByName("guanqia_score").getChildByName("tv");
		ui.guanQiaScorePro = this.modelLayer.getChildByName("guanqia_score").getChildByName("pro");
	}

	this.fullData();
	this.updateUI();
	if (this.type == 0) {
		this.startCountdown();
	}
};

GameLogic.prototype.updateUI = function () {
	var ui = this.ui;
	ui.scoreTv.setString(this.allWinScore + "");
	ui.guanQiaTv.setString(this.guanQia + "");
	if (this.type == 0) {
		var need = this.guanQiaNeedScore - this.guanQiaWinScore;
		need = need < 0 ? 0 : need;
		ui.guanQiaScoreTv.setString(need + "");
		ui.guanQiaScorePro.setPercent(need / this.guanQiaNeedScore * 100);

		var time = this.allTime - this.useTime;
		time = time < 0 ? 0 : time;
		ui.guanQiaTimeTv.setString(time + "");
		ui.guanQiaTimePro.setPercent(time / this.allTime * 100);
	}else if (this.type == 1) {
		ui.stepTv.setString((this.allStep - this.useStep) + "");
		for (var i = 0; i < ui.scoreInfoArr.length; i++) {
			var max = this.guanQiaNeedScore[i];
			var cur = this.guanQiaNeedScore[i] - this.guanQiaWinScoreArr[i];
			cur = cur < 0 ? 0 : cur;
			ui.scoreInfoArr[i].pro.setPercentage(cur / max * 100);
			ui.scoreInfoArr[i].tv.setString(cur + "");
		}
	}else if (this.type == 2) {
		ui.guanQiaScoreTv.setString(this.guanQiaWinScore + "");
	}
}

GameLogic.prototype.fullData = function () {
	if (this.type == 0) {
		this.guanQiaNeedScore = this.cfg.BaseGuanQiaNeedScore + (this.guanQia - 1) * this.cfg.PreGuanQiaAddScore;
		this.allTime = this.cfg.GuanQiaTime;
	}else if (this.type == 1) {
		this.allStep = this.allStep || 20;
		this.guanQiaNeedScore = this.cfg.BaseGuanQiaNeedScore.slice();
		var guanQia = this.guanQia - 1;
		var addIdx = 0;
		while(guanQia > 0){
			this.guanQiaNeedScore[addIdx % 3] += this.cfg.PreGuanQiaAddScore;
			guanQia--;
			addIdx++;
		}
	}else{
		this.guanQiaNeedScore = this.cfg.BaseGuanQiaNeedScore + (this.guanQia - 1) * this.cfg.PreGuanQiaAddScore;
	}
};

GameLogic.prototype.onAddScore = function (score) {
	var ui = this.ui;

	this.guanQiaWinScore += score.score;
	this.allWinScore += score.score;
	ui.scoreTv.setString(this.allWinScore + "");

	if (this.type == 1) {
		this.useStep++;
		this.guanQiaWinScoreArr[score.type] += score.score;

		ui.stepTv.setString((this.allStep - this.useStep) + "");
		var max = this.guanQiaNeedScore[score.type];
		var cur = this.guanQiaNeedScore[score.type] - this.guanQiaWinScoreArr[score.type];
		cur = cur < 0 ? 0 : cur;
		cc.log(score, cur, max, this.guanQiaNeedScore, this.guanQiaWinScoreArr);
		ui.scoreInfoArr[score.type].pro.setPercentage(cur / max * 100);
		ui.scoreInfoArr[score.type].tv.setString(cur + "");
	}else{
		var need = this.guanQiaNeedScore - this.guanQiaWinScore;
		need = need < 0 ? 0 : need;
		ui.guanQiaScoreTv.setString(need + "");
		ui.guanQiaScorePro.setPercent(need / this.guanQiaNeedScore * 100);
	}
	
	if (this.judgeWin()) {
		var winCoin = this.cfg.WinCoinBase + Math.floor(this.guanQiaWinScore / 20);
		//赢事件处理
		this.nextGuanQia();
	}else{
		if (this.type == 1) {
			if (this.useStep >= this.allStep) {
				var winCoin = this.cfg.WinCoinBase + Math.floor(this.guanQiaWinScore / 20);
				userDefault.setStringForKey(config.Key.GamePlay, "");
				//失败事件处理
				return;
			}
		}
	}
	this.scene.setGamePlayData(this.type, this.getData());
};

GameLogic.prototype.onMatrixChange = function (matrix) {
	this.matrix = matrix;
	this.scene.setGamePlayData(this.type, this.getData());
};

GameLogic.prototype.onSelectScore = function (score) {
	var ui = this.ui;
	ui.oneStepTv.stopAllActions();
	if (score) {
		var color = config.Items[score.type].LineColor;
		ui.oneStepTv.setTextColor(color);
		ui.oneStepTv.opacity = 255;
		ui.oneStepTv.visible = true;
		ui.oneStepTv.setString((score.isLianJi ? "连击  " : "") +  score.score);
		ui.oneStepTv.scale = score.isLianJi ? 1.2 : 1;
	}else{
		ui.oneStepTv.runAction(cc.sequence(cc.delayTime(0.8),cc.spawn(cc.fadeTo(0.5, 0)), cc.callFunc(function(){
            ui.oneStepTv.visible = false;
        })));
	}
};

GameLogic.prototype.judgeWin = function () {
	if (this.type == 0 || this.type == 2) {
		if (this.guanQiaWinScore >= this.guanQiaNeedScore) {
			return true;
		}
	}else if (this.type == 1){
		var isWin = true;
		for (var i = 0; i < this.guanQiaNeedScore.length; i++) {
			if (this.guanQiaNeedScore[i] - this.guanQiaWinScoreArr[i] > 0) {
				isWin = false;
				break;
			}
		}
		return isWin;
	}
	return false;
};

GameLogic.prototype.nextGuanQia = function () {
	this.guanQia++;
	this.guanQiaWinScore = 0;
	if (this.type == 0) {
		this.useTime = 0;
	}else if (this.type == 1) {
		this.guanQiaWinScoreArr = [0,0,0,0];
		this.useStep = 0;
	}
	this.fullData();
	this.updateUI();

	if (this.type == 0) {
		this.stopCountdown();
		this.scene.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function(){
            this.startCountdown();
        }.bind(this))));
	}
};

GameLogic.prototype.startCountdown = function () {
	this.stopCountdown();
	this.countdownCb = this.countdownCb || function(){
		this.useTime++;

		var time = this.allTime - this.useTime;
		time = time < 0 ? 0 : time;
		this.ui.guanQiaTimeTv.setString(time + "");
		this.ui.guanQiaTimePro.setPercent(time / this.allTime * 100);

		if (time <= 0) {
			this.stopCountdown();
			var winCoin = this.cfg.WinCoinBase + Math.floor(this.guanQiaWinScore / 20);
			this.scene.setGamePlayData(this.type, this.getData());
			//失败事件处理
		}
	}.bind(this);
	this.scene.schedule(this.countdownCb, 1);
};

GameLogic.prototype.stopCountdown = function () {
	if (this.countdownCb) {
		this.scene.unschedule(this.countdownCb);
	}
};

GameLogic.prototype.getData = function () {
	var fields = ["guanQia", "useTime", "useStep", "guanQiaWinScore", "allWinScore", "matrix",  "guanQiaWinScoreArr"];
	var data = {};
	for (var i = 0; i <= fields.length; i++) {
		data[fields[i]] = this[fields[i]];
	}
	data.type = 0;
	return data;
};


GameLogic.prototype.addStep = function (step) {
	var ui = this.ui;
	if (this.type == 1) {
		this.allStep += step;
		ui.stepTv.setString((this.allStep - this.useStep) + "");
	}
}