var GameLogic = function(){
};

GameLogic.prototype.init = function (scene, layer, type, data) {
	data = data || {};
	this.guanQia = data.guanQia || 1;
	this.useTime = data.useTime || 0;
	this.useStep = data.useStep || 0;
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
	ui.scoreTv = this.modelLayer.getChildByName("score_info").getChildByName("tv");
	ui.guanQiaTv = this.modelLayer.getChildByName("guanqia_info").getChildByName("tv");

	if (this.type == 0) {
		ui.guanQiaScoreTv = this.modelLayer.getChildByName("guanqia_score").getChildByName("tv");
		ui.guanQiaTimeTv = this.modelLayer.getChildByName("guanqia_time").getChildByName("tv");
		ui.guanQiaTimePro = this.modelLayer.getChildByName("guanqia_time").getChildByName("pro");
	}else if (this.type == 1) {
		ui.addStepBtn = this.modelLayer.getChildByName("add_step_btn");
		ui.scoreInfoArr = [];
		for (var i = 1; i <= 4; i++) {
			var node = this.modelLayer.getChildByName("score_color_info").getChildByName("c" + i);
			var pro = new cc.ProgressTimer(new cc.Sprite(config.Items[i - 1].Frame));
			node.addChild(pro);
			pro.width = node.width;
			pro.height = node.height;
			pro.type = cc.ProgressTimer.TYPE_RADIAL;
			pro.setPercentage(100);
        	pro.setReverseDirection(true);
			pro.setPosition(node.width / 2, node.height / 2);
			var tv = node.getChildByName("tv");
			ui.scoreInfoArr.push({pro:pro,tv:tv});
		}
		ui.stepTv = this.modelLayer.getChildByName("step_info").getChildByName("tv");
	}else if (this.type == 2) {
		ui.guanQiaScoreTv = this.modelLayer.getChildByName("guanqia_score").getChildByName("tv");
	}

	this.fullData();
	this.updateUI();
};

GameLogic.prototype.updateUI = function () {
	var ui = this.ui;
	ui.scoreTv.setString(this.allWinScore + "");
	ui.guanQiaTv.setString(this.guanQia + "");
	if (this.type == 0) {
		ui.guanQiaScoreTv.setString(this.guanQiaWinScore + "");
		ui.guanQiaTimeTv.setString((this.allTime - this.useTime) + "");
		ui.guanQiaTimePro.setPercent((this.allTime - this.useTime) / this.allTime * 100);
	}else if (this.type == 1) {
		ui.stepTv.setString((this.allStep - this.useStep) + "");
		for (var i = 0; i < 4; i++) {
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
		this.allStep = 20;
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

GameLogic.prototype.addScore = function (score) {

	this.guanQiaWinScore += score.score;
	this.allWinScore += score.score;
	if (this.type == 2) {
		this.guanQiaWinScoreArr[score.type] += score.score;
	}
	
	if (this.judgeWin()) {
		var winCoin = this.cfg.WinCoinBase + Math.floor(this.guanQiaWinScore / 20);
		//事件处理
		this.nextGuanQia();
	}else{
		if (this.type == 2) {
			if (this.useStep >= this.allStep) {
				var winCoin = this.cfg.WinCoinBase + Math.floor(this.guanQiaWinScore / 20);

				userDefault.setStringForKey(config.Key.GamePlay, "");
				return;
			}
		}
	}
	scene.setGamePlayData(this.getData());
};

GameLogic.prototype.matrixChange = function (matrix) {
	this.matrix = matrix;
	scene.setGamePlayData(this.getData());
};

GameLogic.prototype.judgeWin = function () {
	if (this.type == 0 || this.type == 2) {
		if (this.guanQiaWinScore >= this.guanQiaNeedScore) {
			return true;
		}
	}else if (this.type == 1){
		var isWin = true;
		for (var i = 0; i < this.guanQiaNeedScore.length; i++) {
			if (this.guanQiaNeedScore[i] - this.guanQiaWinScoreArr[i] < 0) {
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
	}
	this.fullData();
};

GameLogic.prototype.timeOut = function () {
	var winCoin = this.cfg.WinCoinBase + Math.floor(this.guanQiaWinScore / 20);
	//事件处理
	scene.setGamePlayData(this.getData());
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
