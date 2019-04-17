var MatrixLogic = function(){
};
MatrixLogic.prototype.init = function(rowCount, columnCount, typeCount, data){
    this.rowCount = rowCount;
    this.columnCount = columnCount;
    this.typeCount= typeCount;
    this.select = [];
    this.itemValueRange = [1, 3];
};

MatrixLogic.prototype.initMatrix = function(data){
    this.data = data;
    if (!this.data) {
        this.data = [];
        for (var i = 0; i < this.rowCount; i++) {
            this.data.push([]);
            for (var j = 0; j < this.columnCount; j++) {
                this.data[i].push(this.newItem() );
            }
        }
    }
}

MatrixLogic.prototype.getData = function(){
    return this.data;
};


MatrixLogic.prototype.getSelect = function(){
    return this.select;
};

MatrixLogic.prototype.setData = function(data){
    this.data = data;
};


MatrixLogic.prototype.setSelect = function(select){
    this.select = select;
};


MatrixLogic.prototype.newItem = function(){
    var value = this.itemValueRange[0] +Math.floor( Math.random()*(this.itemValueRange[1] - this.itemValueRange[0] + 1));
    var type = Math.floor(Math.random() * this.typeCount);
    return {score:value, type:type};
}

MatrixLogic.prototype.addSelect = function(selectItem){
    //在旧的选中中存在
    var idxInSelect = -1;
    for (var i = 0; i < this.select.length; i++) {
        if (this.select[i].idx == selectItem.idx) {
            idxInSelect = i;
            break;
        }
    }

    if (idxInSelect >= 0 && idxInSelect == this.select.length - 2) {
        this.select.pop();
    }else{
        this.select.push(selectItem);
    }
}

MatrixLogic.prototype.getSelectDataByIdx = function(idx){
    if (idx < 0) {
        idx = this.select.length + idx;
    }
    if (idx >= 0 && idx < this.select.length) {
        var sel = this.select[idx];
        var data = this.data[sel.row][sel.column];
        return {score:data.score,type:data.type,row:sel.row,column:sel.column};
    }
}

MatrixLogic.prototype.getSelectScore = function(){
    var lianJiNum = 0;
    var score = 0;
    var type = 0;
    var isLastLianJi = false;//最后一个数字是否属于连击
    for (var i = 0; i < this.select.length; i++) {
        var selectI = this.select[i];
        var scoreI = this.data[selectI.row][selectI.column].score;
        type = this.data[selectI.row][selectI.column].type;
        var j = i + 1; 
        for (; j < this.select.length; j++) {
            var selectJ = this.select[j];
            if (scoreI != this.data[selectJ.row][selectJ.column].score) {
                break;
            }
        }

        if (j - i >= 3) {
            score += 10 * scoreI  * (j - i);
            i = j - 1;
            lianJiNum++;
            if (j == this.select.length) {
                isLastLianJi = true;
            }
        }else{
            score += scoreI;
        }
    }
    return {score:score,lianJiNum:lianJiNum, type:type, isLastLianJi:isLastLianJi};
}

MatrixLogic.prototype.canAddSelect = function(selectItem){
    //选中
    if (this.select.length == 0) {
        //this.select.push(selectItem);
        return true;
    }else{
        var idxInSelect = -1;
        for (var i = 0; i < this.select.length; i++) {
            if (this.select[i].idx == selectItem.idx) {
                idxInSelect = i;
                break;
            }
        }

        //在旧的选中中存在
        if (idxInSelect >= 0) {
            //抵消
            if (idxInSelect == this.select.length - 2) {
                //this.select.pop();
                return true;
            }
            return false;
        }

        var lastSelect = this.select[this.select.length - 1];

        if (Math.abs(lastSelect.row - selectItem.row) <= 1 &&
            Math.abs(lastSelect.column - selectItem.column) <= 1 &&
            this.data[lastSelect.row][lastSelect.column].type == this.data[selectItem.row][selectItem.column].type) {
            //this.select.push(selectItem);
            return true;
        }
    }
    return false;
};

//帮助提示
MatrixLogic.prototype.getHelp = function(){
    var bestHelp = [];
    var isItemInItems = function(items, item){
        for (var i = items.length - 1; i >= 0; i--) {
            if (item.row == items[i].row && item.column == items[i].column) {
                return true;
            }
        }
        return false;
    };

    var addOneItem = function(items){
        var lastItem = items[items.length - 1];
        var canLink = false;
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                var row = lastItem.row + i;
                var column = lastItem.column + j;
                if (row >= 0 && column >= 0 && row < this.rowCount && column < this.columnCount) {
                    var item = this.data[row][column];
                    item = {row:row,column:column,type:item.type,score:item.score};
                    if (lastItem.type == item.type && !isItemInItems(items, item)) {
                        var newItems = items.slice();
                        newItems.push(item);
                        addOneItem(newItems);
                        canLink = true;
                    }
                }
            }   
        }

        if (!canLink && items.length > bestHelp.length) {
            bestHelp = items;
        }
    }.bind(this);

    for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.columnCount; j++) {
            var item = this.data[i][j];
            var items = [{row:i,column:j,type:item.type,score:item.score}];
            addOneItem(items);
        }
    }
    return bestHelp;
}

var MatrixLayer = cc.Layer.extend({
    ctor:function (rowCount, columnCount, typeCount, size, gameLogic) {
        this._super();
        this.matrixItems = [];
        this.lines = [];
        this.helpLines = [];
        this.gameLogic = gameLogic;
        this.marixLogic = new MatrixLogic();
        this.marixLogic.init(rowCount, columnCount, typeCount);

        this.setContentSize(size.width, size.height);
        this.itemSize = cc.size(size.width / columnCount, size.height / rowCount); 
        this.initTouchLayer();
        this.lastTouchTime = new Date().getTime();
        this.isDeleteSelecting = false; //删除选择中

        this.initMatix(gameLogic.matrix);
        return true;
    },

    initTouchLayer:function(){
        this.touchLayer = new ccui.Layout();

        this.addChild(this.touchLayer);
        this.touchLayer.setContentSize(this.width, this.height);
        this.touchLayer.setTouchEnabled(true);

        var self =this;
        this.touchLayer.addTouchEventListener(function(touchLayer, eventType) {
            if (eventType == ccui.Widget.TOUCH_BEGAN) {
                self.doTouchMove(touchLayer.convertToNodeSpace(touchLayer.getTouchBeganPosition()));
            }else if (eventType == ccui.Widget.TOUCH_MOVED) {
                self.doTouchMove(touchLayer.convertToNodeSpace(touchLayer.getTouchMovePosition()));
            }else if (eventType == ccui.Widget.TOUCH_ENDED || eventType == ccui.Widget.TOUCH_CANCELED) {
                self.doTouchEnd(touchLayer.convertToNodeSpace(touchLayer.getTouchEndPosition()));
            }
        });

        var csdNode = ccs.load("res/sanxiao/matrixItemNode.json").node;
        this.cloneItemNode = csdNode.getChildByName("item");
        this.cloneItemNode.visible = false;
        this.cloneItemNode.removeFromParent();
        this.addChild(this.cloneItemNode);

        this.cloneLineNode = csdNode.getChildByName("line");
        this.cloneLineNode.visible = false;
        this.cloneLineNode.removeFromParent();
        this.addChild(this.cloneLineNode);

        this.fingerNode = csdNode.getChildByName("finger");
        this.fingerNode.visible = false;
        this.fingerNode.removeFromParent();
        this.addChild(this.fingerNode, 4);

        this.showHelp2();
    },

    //检测矩阵有至少一个可连线 没有则重置矩阵
    checkCanSelect:function(){
        var help = this.marixLogic.getHelp();
        if (help.length > 2) {
        }else{
            //没有可以操作的  需要重置矩阵
            this.initMatix();
        }
    },

    doTouchMove:function(touchPos){
        this.lastTouchTime = new Date().getTime();
        var touchItem = this.getTouchItem(touchPos);

        if (this.isDeleteSelecting) {
            if (touchItem && (this.deleteSelectItem == null || !(this.deleteSelectItem.row == touchItem.row && this.deleteSelectItem.column == touchItem.column))) {
                this.deleteSelectItem = touchItem;
                var copy = this.matrixItems[touchItem.row][touchItem.column].clone();
                copy.getChildByName("score_tv").setString("");
                this.addChild(copy, 1);
                copy.getChildByName("bg_iv").runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 2), cc.fadeTo(0.2, 0)), cc.callFunc(function(){
                    copy.removeFromParent();
                })));
                Sound.playEffect("dianji");
            }
            return;
        }

        if (touchItem) {
            if (this.marixLogic.canAddSelect(touchItem)) {
                this.resetSlectItemScore(true);
                this.marixLogic.addSelect(touchItem);

                //最后一个选中的有效果
                var lastSel = this.marixLogic.getSelectDataByIdx(-1);
                if (lastSel) {
                    var copy = this.matrixItems[lastSel.row][lastSel.column].clone();
                    //copy.removeFromParent();
                    copy.getChildByName("score_tv").setString("");
                    this.addChild(copy, 1);
                    copy.getChildByName("bg_iv").runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 2), cc.fadeTo(0.2, 0)), cc.callFunc(function(){
                        copy.removeFromParent();
                    })));
                    var score = this.marixLogic.getSelectScore();
                    Sound.playEffect(score.isLastLianJi ? "lianji" : "dianji"); // or lianji
                    this.gameLogic.onSelectScore(score);
                }

                this.resetSlectItemScore();
                this.resetLine(touchPos);
            }else{
                this.moveLastLine(touchPos);
            }
        }else{
            this.moveLastLine(touchPos);
        }
    },

    doTouchEnd:function(touchPos){
        this.clearHelpLine();
        this.doTouchMove(touchPos, true);
        if (this.isDeleteSelecting) {
            if (this.deleteSelectItem) {
                this.isDeleteSelecting = false;
                var itemData = this.marixLogic.getData()[this.deleteSelectItem.row][this.deleteSelectItem.column];
                var deleteItems = this.deleteItems([this.deleteSelectItem]);
                this.deleteSelectItem = null;
                this.checkCanSelect();
                this.gameLogic.doDeleteDone();

                //Boom
                var itemEffect = new cc.ParticleSystem("res/sanxiao/itemEffect.plist");
                var lastSelNode = deleteItems[deleteItems.length - 1].node;
                itemEffect.setPosition(cc.p(lastSelNode.x, lastSelNode.y));
                this.addChild(itemEffect, 3);
                itemEffect.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function(){
                    itemEffect.removeFromParent();
                })));

                var score = {score:itemData.score, lianJiNum:0, type:itemData.type};
                this.gameLogic.onAddScore(score, this.convertToWorldSpace(cc.p(lastSelNode.x, lastSelNode.y)));
                Sound.playEffect("bomb");
            }
            return;
        }

        //todo 算分 动画 
        var score = this.marixLogic.getSelectScore();
        if (score && this.marixLogic.getSelect().length > 2) {
            //选出选中的
            //生成新的补进

            var selectItems = this.deleteItems(this.marixLogic.getSelect());

            this.resetSlectItemScore(true);
            this.marixLogic.setSelect([]);
            this.resetLine();

            //Boom
            var itemEffect = new cc.ParticleSystem("res/sanxiao/itemEffect.plist");
            var lastSelNode = selectItems[selectItems.length - 1].node;
            itemEffect.setPosition(cc.p(lastSelNode.x, lastSelNode.y));
            this.addChild(itemEffect, 3);
            itemEffect.duration = 0.5;
            itemEffect.runAction(cc.sequence(cc.delayTime(0.6), cc.callFunc(function(){
                itemEffect.removeFromParent();
            })));

            this.gameLogic.onAddScore(score, this.convertToWorldSpace(cc.p(lastSelNode.x, lastSelNode.y)));
            Sound.playEffect("bomb");
        }else{
            this.resetSlectItemScore(true);
            this.marixLogic.setSelect([]);
            this.resetLine();
        }
        this.gameLogic.onSelectScore(null);
    },

    getTouchItem:function(touchPos){
        var columnIdx = Math.floor((touchPos.x / this.width) * this.marixLogic.rowCount);
        var rowIdx = Math.floor((this.height - touchPos.y) / this.height * this.marixLogic.columnCount);
       
        if (rowIdx >= 0 && columnIdx >= 0 && rowIdx < this.marixLogic.rowCount && columnIdx < this.marixLogic.columnCount) {
            var idx = rowIdx * this.marixLogic.columnCount + columnIdx;
            var touchNode = this.matrixItems[rowIdx][columnIdx];
            if (touchNode) {
                if (cc.rectContainsPoint(cc.rect(touchNode.x - touchNode.width * 0.5,touchNode.y - touchNode.height * 0.5,touchNode.width,touchNode.height),touchPos)) {
                    return {idx:idx,column:columnIdx,row:rowIdx};
                }
            }
        }
        return null;
    },

    resetSlectItemScore:function(isSetInitScore){
        var data = this.marixLogic.getData();
        for (var i = 0; i < this.marixLogic.getSelect().length; i++) {
            var selectI = this.marixLogic.getSelect()[i];
            var scoreI = data[selectI.row][selectI.column].score;
            if (isSetInitScore) {
                var node = this.matrixItems[selectI.row][selectI.column];
                node.getChildByName("score_tv").setString(scoreI + "");
                node.scale = 1;
            }else{
                var j = i + 1;
                for (; j < this.marixLogic.getSelect().length; j++) {
                    var selectJ = this.marixLogic.getSelect()[j];
                    if (scoreI != data[selectJ.row][selectJ.column].score) {
                        break;
                    }
                }

                if (j - i >= 3) {
                    for (var k = i; k < j; k++) {
                        var selectK = this.marixLogic.getSelect()[k];
                        var node = this.matrixItems[selectK.row][selectK.column];
                        node.getChildByName("score_tv").setString(scoreI * 10 + "");
                        node.scale = 1.1;
                    }
                    i = j - 1;
                }else{
                    var node = this.matrixItems[selectI.row][selectI.column];
                    node.getChildByName("score_tv").setString(scoreI + "");
                    node.scale = 1;
                }
            }
        }
    },

    resetLine:function(touchPos){
        for (var i = 0; i < this.lines.length; i++) {
            this.lines[i].removeFromParent();
        }

        var color = cc.color(255,255,255);

        var firstSel = this.marixLogic.getSelectDataByIdx(0);
        if (firstSel) {
            color = config.Items[this.marixLogic.getData()[firstSel.row][firstSel.column].type].LineColor;
        } 

        for (var i = 0; i < this.marixLogic.getSelect().length; i++) {
            var beginNode = this.marixLogic.getSelect()[i];
            var posB = cc.p(this.width / this.marixLogic.rowCount * (beginNode.column + 0.5), this.height / this.marixLogic.columnCount * (this.marixLogic.columnCount - beginNode.row - 0.5));
            if (i == this.marixLogic.getSelect().length - 1) {
                var posE = touchPos;
            }else{
                var endNode = this.marixLogic.getSelect()[i + 1];
                var posE = cc.p(this.width / this.marixLogic.rowCount * (endNode.column + 0.5), this.height / this.marixLogic.columnCount * (this.marixLogic.columnCount - endNode.row - 0.5));
            }

            this.lines.push(this.drawOneLine(posB, posE, color));
        }
    },

    moveLastLine:function(touchPos){
        if (this.lines.length > 0 && this.marixLogic.getSelect().length > 0) {
            var line = this.lines[this.lines.length - 1];
            var lastNode = this.marixLogic.getSelect()[this.marixLogic.getSelect().length - 1];
            var posB = this.matrixItems[lastNode.row][lastNode.column];
            var posE = touchPos;
            var width = Math.sqrt(Math.pow(posE.x - posB.x, 2) + Math.pow(posE.y - posB.y, 2));
            line.width = width;
            line.setRotation(Math.atan2((posB.y-posE.y), (posE.x-posB.x)) * (180/Math.PI));
        }
    },

    drawOneLine:function(posB, posE, color){
        var width = Math.sqrt(Math.pow(posE.x - posB.x, 2) + Math.pow(posE.y - posB.y, 2));
        var line = this.cloneLineNode.clone();
        line.visible = true;
        line.setColor(color)
        this.addChild(line);
        line.width = width;
        line.setRotation(Math.atan2((posB.y-posE.y), (posE.x-posB.x)) * (180/Math.PI));
        line.x = posB.x;
        line.y = posB.y;
        return line;
    },

    clearHelpLine:function(touchPos){
        this.fingerNode.visible = false;
        for (var i = 0; i < this.helpLines.length; i++) {
            this.helpLines[i].removeFromParent();
        }
        this.helpLines = [];
    },

    isHelpShowing:function(){
        return this.helpLines.length > 0;
    },

    showHelp:function(){
        this.clearHelpLine();
        
        var help = this.marixLogic.getHelp();
        var color = cc.color(255,255,255);

        var fingerActionArr = [];

        for (var i = 0; i < help.length - 1; i++) {
            var beginNode = help[i];
            var posB = cc.p(this.width / this.marixLogic.rowCount * (beginNode.column + 0.5), this.height / this.marixLogic.columnCount * (this.marixLogic.columnCount - beginNode.row - 0.5));
            var endNode = help[i + 1];
            var posE = cc.p(this.width / this.marixLogic.rowCount * (endNode.column + 0.5), this.height / this.marixLogic.columnCount * (this.marixLogic.columnCount - endNode.row - 0.5));
            var line = this.drawOneLine(posB, posE, color);
            line.visible = false;

            if (fingerActionArr.length == 0) {
                this.fingerNode.x = posB.x;
                this.fingerNode.y = posB.y;
            }

            fingerActionArr.push(cc.moveTo(0.1, posE));

            (function(line){
                line.runAction(cc.sequence(cc.delayTime(0.1 * (i + 1)), cc.callFunc(function(){
                    line.visible = true;
                })));
            })(line);
            this.helpLines.push(line);
        }

        this.fingerNode.visible = true;
        var fingerAction = cc.sequence(fingerActionArr);
        this.fingerNode.runAction(fingerAction);
    },

    //长时间未操作的提示
    showHelp2:function(){
        //5秒钟没动 则作提示
        this.showHelpCb = this.showHelpCb || function(){
            var cur = new Date().getTime();
            //如果是新手
            if (this.gameLogic.isNewUser() && !this.isHelpShowing()) {
                this.showHelp();
            }

            if (cur - this.lastTouchTime > 5 * 1000) {
                var help = this.marixLogic.getHelp();
                var itemNode = this.matrixItems[help[0].row][help[0].column];
                var copy = itemNode.clone();
                //copy.removeFromParent();
                copy.getChildByName("score_tv").setString("");
                this.addChild(copy, 1);
                copy.getChildByName("bg_iv").runAction(cc.sequence(cc.spawn(cc.scaleTo(0.3, 1.5), cc.fadeTo(0.3, 0)), cc.callFunc(function(){
                    copy.removeFromParent();
                })));
            }
        }.bind(this);
        this.schedule(this.showHelpCb, 0.6);
    },

    initMatix:function(matrix){
        this.marixLogic.initMatrix(matrix);

        for (var i = 0; i < this.matrixItems.length; i++) {
            for (var j = 0; j < this.matrixItems[i].length; j++) {
                this.matrixItems[i][j].removeFromParent();
            }
        }

        this.matrixItems = [];
        for (var i = 0; i < this.marixLogic.getData().length; i++) {
            var row = this.marixLogic.getData()[i];
            var rowNodes = [];
            for (var j = 0; j < row.length; j++) {
                var item = row[j];
                var itemNode = this.cloneItemNode.clone();
                itemNode.visible = true;
                itemNode.getChildByName("bg_iv").loadTexture(config.Items[item.type].Bg);
                itemNode.getChildByName("score_tv").setString(item.score + "");
                this.addChild(itemNode, 2);
                itemNode.x = this.width / this.marixLogic.rowCount * (j + 0.5);
                itemNode.y = this.height / this.marixLogic.columnCount * (this.marixLogic.columnCount - i - 0.5) + 1000;
                itemNode.runAction(cc.moveTo(0.3, cc.p(itemNode.x, itemNode.y - 1000)));
                rowNodes.push(itemNode);
            }
            this.matrixItems.push(rowNodes);
        }
        this.gameLogic.onMatrixChange(this.marixLogic.getData());
        this.checkCanSelect();
    },

    //删除
    deleteItems:function(dels){
        //选出删除的
        //生成新的补进
        var rowCount = this.marixLogic.rowCount;
        var columnCount = this.marixLogic.columnCount;

        var delItems = [];
        var newItems = [];
        var moveItems = [];

        //选中的节点
        for (var i = 0; i < dels.length; i++) {
            var del = dels[i];
            var delNode = this.matrixItems[del.row][del.column];
            delItems.push({row:del.row,column:del.column,node:delNode});
            this.marixLogic.getData()[del.row][del.column] = null;
            this.matrixItems[del.row][del.column] = null;
        }
        
        for (var column = columnCount - 1; column >= 0; column--) {
            var nullCount = 0;
            for (var row = rowCount - 1; row >= 0; row--) {
                var moveNode = this.matrixItems[row][column];
                if (moveNode == null) {
                    nullCount++;
                }else{
                    //下降的节点
                    if (nullCount > 0) {
                        this.marixLogic.getData()[row + nullCount][column] = this.marixLogic.getData()[row][column];
                        this.matrixItems[row + nullCount][column] = moveNode;
                        this.marixLogic.getData()[row][column] = null;
                        this.matrixItems[row][column] = null;
                        moveItems.push({row:row + nullCount,column:column,node:moveNode});
                    }
                }
            }

            while (nullCount > 0) {
                //补充的节点
                this.marixLogic.getData()[nullCount - 1][column] = this.marixLogic.newItem();
                var item = this.marixLogic.getData()[nullCount - 1][column];
                var itemNode = this.cloneItemNode.clone();
                itemNode.visible = true;
                itemNode.getChildByName("bg_iv").loadTexture(config.Items[item.type].Bg);
                itemNode.getChildByName("score_tv").setString(item.score + "");
                this.addChild(itemNode, 2);
                itemNode.x = this.width / rowCount * (column + 0.5);
                itemNode.y = this.height / columnCount * (columnCount - nullCount - 1 - 0.5) + 1000;

                this.matrixItems[nullCount - 1][column] = itemNode;
                newItems.push({row:nullCount - 1,column:column,node:itemNode});
                nullCount--;
            }
        }

        //动画
        for (var i = 0; i < newItems.length; i++) {
            var item = newItems[i];
            var x =  this.width / rowCount * (item.column + 0.5);
            var y =  this.height / columnCount * (columnCount - item.row - 0.5);
            item.node.runAction(cc.moveTo(0.3, cc.p(x, y)));
        }

        //动画
        for (var i = 0; i < moveItems.length; i++) {
            var item = moveItems[i];
            var x =  this.width / rowCount * (item.column + 0.5);
            var y =  this.height / columnCount * (columnCount - item.row - 0.5);
            item.node.runAction(cc.moveTo(0.3, cc.p(x, y)));
        }


        for (var i = 0; i < delItems.length; i++) {
            var selNode = delItems[i];
            selNode.node.removeFromParent();
        }
        this.gameLogic.onMatrixChange(this.marixLogic.getData());
        this.checkCanSelect();
        return delItems;
    },

    setDeleteSelecting:function(deleteSelecting){
        this.isDeleteSelecting = deleteSelecting;
    }
});
