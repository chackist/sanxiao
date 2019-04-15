var GameLogicType0 = function(){
};

GameLogicType0.prototype.init = function (scene, data) {
	data = data || {};
	this.guanQia = data.guanQia || 1;
	this.matrix = data.matrix;
	this.useTime = data.useTime || 0;
	this.guanQiaWinScore = data.guanQiaWinScore || 0;
	this.allWinScore = data.allWinScore || 0;
	this.cfg  = config.Logic.type0;
	this.scene = scene;
	this.fullData();
};

GameLogicType0.prototype.fullData = function () {
	this.guanQiaNeedScore = this.cfg.BaseGuanQiaNeedScore + (this.guanQia - 1) * this.cfg.PreGuanQiaAddScore;
	this.allTime = this.cfg.GuanQiaTime;
};

GameLogicType0.prototype.addScore = function (score) {
	this.guanQiaWinScore += score.score;
	this.allWinScore += score.score;
	if (this.judgeWin()) {
		var winCoin = this.cfg.WinCoinBase + Math.floor(this.guanQiaWinScore / 20);
		this.nextGuanQia();
		//事件处理
		//事件处理
	}
	//保存数据
	userDefault.setStringForKey(config.Key.GamePlay, this.getData());
};

GameLogicType0.prototype.matrixChange = function (matrix) {
	this.matrix = matrix;
	//保存数据
	userDefault.setStringForKey(config.Key.GamePlay, this.getData());
};

GameLogicType0.prototype.judgeWin = function () {
	if (this.guanQiaWinScore >= this.guanQiaNeedScore) {
		return true;
	}
	return false;
};

GameLogicType0.prototype.nextGuanQia = function () {
	this.guanQia++;
	this.guanQiaWinScore = 0;
	this.fullData();
};

GameLogicType0.prototype.timeOut = function () {
	var winCoin = this.cfg.WinCoinBase + Math.floor(this.guanQiaWinScore / 20);
	//事件处理
	userDefault.setStringForKey(config.Key.GamePlay, "");
};

GameLogicType0.prototype.getData = function () {
	var fields = [];
	var data = {"guanQia", "useTime", "guanQiaWinScore", "allWinScore", "matrix"};
	for (var i = 0; i <= fields.length; i++) {
		data[fields[i]] = this.[fields[i]];
	}
	data.type = 0;
	return data;
};

GameLogicType1.init = function (scene, data) {
	data = data || {};
	this.useStep = data.useStep || 0;
	this.guanQia = data.guanQia || 1;
	this.matrix = data.matrix;
	this.guanQiaWinScore = data.guanQiaWinScore || 0;
	this.guanQiaWinScoreArr = data.guanQiaWinScoreArr || [0,0,0,0];
	this.allWinScore = data.allWinScore || 0;
	this.cfg  = config.Logic.type0;
	this.scene = scene;
	this.fullData();
};

GameLogicType1.prototype.fullData = function () {
	this.allStep = 20;
	this.guanQiaNeedScore = this.cfg.BaseGuanQiaNeedScore.slice();
	var guanQia = this.guanQia;
	var addIdx = 0;
	while(guanQia > 0){
		this.guanQiaNeedScore[addIdx % 3] += this.cfg.PreGuanQiaAddScore;
		guanQia--;
		addIdx++;
	}
};

GameLogicType1.prototype.addScore = function (score) {
	this.guanQiaWinScore += score.score;
	this.allWinScore += score.score;
	this.guanQiaWinScoreArr[score.type] += score.score;

	if (this.judgeWin()) {
		var winCoin = this.cfg.WinCoinBase + Math.floor(this.guanQiaWinScore / 20);
		//事件处理
		this.nextGuanQia();
	}else{
		if (this.useStep >= this.allStep) {
			var winCoin = this.cfg.WinCoinBase + Math.floor(this.guanQiaWinScore / 20);

			userDefault.setStringForKey(config.Key.GamePlay, "");
			return;
		}
	}
	userDefault.setStringForKey(config.Key.GamePlay, this.getData());
};

GameLogicType0.prototype.matrixChange = function (matrix) {
	this.matrix = matrix;
	//保存数据
	userDefault.setStringForKey(config.Key.GamePlay, this.getData());
};

GameLogicType1.prototype.judgeWin = function () {
	var isWin = true;
	for (var i = 0; i < this.guanQiaNeedScore.length; i++) {
		if (this.guanQiaNeedScore[i] - this.guanQiaWinScoreArr[i] < 0) {
			isWin = false;
			break;
		}
	}
	return isWin;
};

GameLogicType1.prototype.nextGuanQia = function () {
	this.guanQia++;
	this.guanQiaWinScore = 0;
	this.guanQiaWinScoreArr = [0,0,0,0];
	this.fullData();
};

GameLogicType1.prototype.getData = function () {
	var fields = [];
	var data = {"guanQia", "useStep", "guanQiaWinScore", "allWinScore", "guanQiaWinScoreArr", "matrix"};
	for (var i = 0; i <= fields.length; i++) {
		data[fields[i]] = this.[fields[i]];
	}
	data.type = 1;
	return data;
};