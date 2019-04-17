var GameLogic = function(){
};


var setStringAction = function(tv, str, playAction){
	tv.stopAllActions();
	tv.setString(str + "");
	tv.scale = 1;

	if (playAction || playAction == undefined) {
		tv.runAction(cc.sequence(cc.scaleTo(0.1, 0.8), cc.scaleTo(0.1, 1.3), cc.scaleTo(0.1, 1)));
	}
};

var setProAction = function(pro, percent){
	pro.stopAllActions();
	pro.runAction(cc.progressTo(0.3, percent));
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

	
	ui.diskDeleteSelecting = layer.getChildByName("disk_delete_selecting");
	ui.dialogOkCannel = layer.getChildByName("dialog_cancel_ok");
	ui.toast = layer.getChildByName("toast");

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

	this.marixBgLayer = layer.getChildByName("marix_bg_layer");
    this.marixLayer = new MatrixLayer(6, 6, 4, cc.size(this.marixBgLayer.width, this.marixBgLayer.height) , this);
    this.marixBgLayer.addChild(this.marixLayer);

	this.updateUI();
	if (this.type == 0) {
		this.startCountdown();
	}
};

GameLogic.prototype.updateUI = function () {
	var ui = this.ui;
	setStringAction(ui.coinTv, this.getUserCoin(), false);
	setStringAction(ui.scoreTv, this.allWinScore, false);
	setStringAction(ui.guanQiaTv, this.guanQia, false);

	if (this.type == 0) {
		var need = this.guanQiaNeedScore - this.guanQiaWinScore;

		need = need < 0 ? 0 : need;
		setStringAction(ui.guanQiaScoreTv, need, false);
		ui.guanQiaScorePro.setPercent(need / this.guanQiaNeedScore * 100);

		var time = this.allTime - this.useTime;
		time = time < 0 ? 0 : time;
		setStringAction(ui.guanQiaTimeTv, time, false);
		ui.guanQiaTimePro.setPercent(time / this.allTime * 100);
	}else if (this.type == 1) {
		setStringAction(ui.stepTv, this.allStep - this.useStep, false);
		for (var i = 0; i < ui.scoreInfoArr.length; i++) {
			var max = this.guanQiaNeedScore[i];
			var cur = this.guanQiaNeedScore[i] - this.guanQiaWinScoreArr[i];
			cur = cur < 0 ? 0 : cur;
			setProAction(ui.scoreInfoArr[i].pro, cur / max * 100);
			setStringAction(ui.scoreInfoArr[i].tv, cur, false);
		}
	}else if (this.type == 2) {
		var need = this.guanQiaNeedScore - this.guanQiaWinScore;
		need = need < 0 ? 0 : need;
		setStringAction(ui.guanQiaScoreTv, need);
		ui.guanQiaScorePro.setPercent(need / this.guanQiaNeedScore * 100);
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
	//更新数据
	this.guanQiaWinScore += score.score;
	this.allWinScore += score.score;
	if (this.type == 1) {
		this.useStep++;
		this.guanQiaWinScoreArr[score.type] += score.score;
	}

	var isWin = this.judgeWin();
	var isLose = false;
	if (!isWin && this.type == 1) {
		isLose = this.useStep >= this.allStep;
	}

	if (isWin) {
		this.guanQiaWinScore += this.cfg.WinScoreGuanQia;
		this.allWinScore += this.cfg.WinScoreGuanQia;
	}

	//更新ui
	var ui = this.ui;
	setStringAction(ui.scoreTv, this.allWinScore);

	if (this.type == 1) {
		setStringAction(ui.stepTv, this.allStep - this.useStep);
		var max = this.guanQiaNeedScore[score.type];
		var cur = this.guanQiaNeedScore[score.type] - this.guanQiaWinScoreArr[score.type];
		cur = cur < 0 ? 0 : cur;
		setProAction(ui.scoreInfoArr[score.type].pro, cur / max * 100);
		setStringAction(ui.scoreInfoArr[score.type].tv, cur);
	}else{
		var need = this.guanQiaNeedScore - this.guanQiaWinScore;
		need = need < 0 ? 0 : need;
		setStringAction(ui.guanQiaScoreTv, need);
		ui.guanQiaScorePro.setPercent(need / this.guanQiaNeedScore * 100);
	}

	if(isWin){
		//失败事件处理
		this.scene.win({guanQiaWinScore:this.guanQiaWinScore, guanQia:this.guanQia, type:this.type});
		this.nextGuanQia();
	}else if (isLose) {
		var winCoin = Math.floor(this.guanQiaWinScore / 50); 
		this.updateUserCoin(winCoin);
		//失败事件处理
		this.scene.lose({winCoin:winCoin, allWinScore:this.allWinScore, guanQia:this.guanQia, type:this.type});
		return this.setGamePlayData(this.type, "");
	}

	this.setGamePlayData(this.type, this.getData());
};

GameLogic.prototype.onMatrixChange = function (matrix) {
	this.matrix = matrix;
	this.setGamePlayData(this.type, this.getData());
};

GameLogic.prototype.onSelectScore = function (score) {
	var ui = this.ui;
	ui.oneStepTv.stopAllActions();
	if (score) {
		var color = config.Items[score.type].LineColor;
		ui.oneStepTv.setTextColor(color);
		ui.oneStepTv.opacity = 255;
		ui.oneStepTv.visible = true;
		ui.oneStepTv.setString((score.lianJiNum >  0 ? ((score.lianJiNum > 1 ? ("" + score.lianJiNum) : "") + "连击  ") : "") +  score.score);
		ui.oneStepTv.scale = score.lianJiNum > 0 ? 1.2 : 1;
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
	this.marixLayer.initMatix();
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
		this.setGamePlayData(this.type, this.getData());

		var time = this.allTime - this.useTime;
		time = time < 0 ? 0 : time;
		setStringAction(this.ui.guanQiaTimeTv, time);
		this.ui.guanQiaTimePro.setPercent(time / this.allTime * 100);

		if (time <= 0) {
			this.stopCountdown();
			var winCoin = Math.floor(this.guanQiaWinScore / 50);
			this.updateUserCoin(winCoin);
			this.setGamePlayData(this.type, "");
			//失败事件处理
			this.scene.lose({winCoin:winCoin, allWinScore:this.allWinScore, guanQia:this.guanQia});
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
	var fields = ["guanQia", "useTime", "useStep", "guanQiaWinScore", "allWinScore", "matrix",  "guanQiaWinScoreArr", "type"];
	var data = {};
	for (var i = 0; i <= fields.length; i++) {
		data[fields[i]] = this[fields[i]];
	}
	// data.type = 0;
	return data;
};


GameLogic.prototype.doAddStep = function () {
	var spend = config.PropPrice.AddStep;
	if (this.getUserCoin() < spend) {
		this.showToast("金币不足");
		return;}
	if (this.type != 1) {return;}
	
	this.showDialogOkCancel(function(){
		this.updateUserCoin(-spend);
		this.allStep += 2;
		this.setGamePlayData(this.type, this.getData());
		setStringAction(this.ui.stepTv, this.allStep - this.useSte);
	}.bind(this));
}

GameLogic.prototype.doDelete = function () {
	var spend = config.PropPrice.Del;
	if (this.getUserCoin() < spend) {
		this.showToast("金币不足");
		return;}

	this.showDialogOkCancel(function(){
		this.ui.diskDeleteSelecting.visible = true;
		this.marixLayer.setDeleteSelecting(true);
	}.bind(this));
}

GameLogic.prototype.doDeleteDone = function () {
	this.ui.diskDeleteSelecting.visible = false;
	this.updateUserCoin(-config.PropPrice.Del);
}

GameLogic.prototype.doShowHelp = function (step) {
	var spend = config.PropPrice.Help;
	if (this.getUserCoin() < spend) {
		this.showToast("金币不足");
		return;}
	
	this.showDialogOkCancel(function(){
		this.updateUserCoin(-spend);
		this.marixLayer.drawHelpLine();
	}.bind(this));
}

GameLogic.prototype.showDialogOkCancel = function(okCb, cancleCb){
	var dialog = this.ui.dialogOkCannel;
	var okNode = dialog.getChildByName("ok");
	var cancleNode = dialog.getChildByName("cancel");

	dialog.visible = true;
	okNode.addTouchEventListener(function(btn, et){
		if (et == ccui.Widget.TOUCH_ENDED) {
			dialog.visible = false;
			okCb();
		}
	}, okNode);

	cancleNode.addTouchEventListener(function(btn, et){
		if (et == ccui.Widget.TOUCH_ENDED) {
			dialog.visible = false;
			if (cancelCb) {
				cancelCb();
			}
		}
	}, cancleNode);
};

GameLogic.prototype.showToast = function(msg){
	var node = this.ui.toast.clone();
	this.scene.addChild(node, 2);
	node.getChildByName("tv").setString(msg + "");
	node.visible = true;
	node.runAction(cc.sequence(cc.moveBy(0.5, cc.p(0, 300)), cc.spawn(cc.fadeOut(0.5), cc.moveBy(0.5, cc.p(0, 300))), cc.callFunc(function(){
		node.removeFromParent();
	})));
};

GameLogic.prototype.setGamePlayData = function(type, data){
	userDefault.setStringForKey(config.Key.GamePlay, JSON.stringify(data));
};

GameLogic.prototype.updateUserCoin = function(incValue){
	var coin = this.getUserCoin();
	coin += incValue;
	userDefault.setIntegerForKey(config.Key.Coin, coin);
	setStringAction(this.ui.coinTv, coin);
	return coin;
};

GameLogic.prototype.getUserCoin = function(){
	var coin = userDefault.getIntegerForKey(config.Key.Coin, 1000);
	return coin;
};

console.log(JSON.stringify(""))
