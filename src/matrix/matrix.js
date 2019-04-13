var MatrixLogic = function(){
   
};
MatrixLogic.Config = {
    Items: [{
        Bg: "res/sanxiao/M.png",
        Frame: "res/sanxiao/m1.png",
        LineColor: cc.color(229, 0, 79)
    }, {
        Bg: "res/sanxiao/L.png",
        Frame: "res/sanxiao/m2.png",
        LineColor: cc.color(0, 160, 233)
    }, {
        Bg: "res/sanxiao/H.png",
        Frame: "res/sanxiao/m3.png",
        LineColor: cc.color(254, 152, 0)
    }, {
        Bg: "res/sanxiao/N.png",
        Frame: "res/sanxiao/m4.png",
        LineColor: cc.color(0, 179, 65)
    }]
};

MatrixLogic.prototype.init = function(rowCount, columnCount, typeCount){
    this.rowCount = rowCount;
    this.columnCount = columnCount;
    this.typeCount= typeCount;
    this.data = [];
    this.select = [];

    this.itemValueRange = [1, 3];
    for (var i = 0; i < this.rowCount; i++) {
        this.data.push([]);
        for (var j = 0; j < this.columnCount; j++) {
            this.data[i].push(this.newItem() );
        }
    }
    cc.log(this.data);
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
    if (this.select.length >= 3) {
        var score = 0;
        for (var i = 0; i < this.select.length; i++) {
            var selectI = this.select[i];
            var scoreI = this.data[selectI.row][selectI.column].score;
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
            }else{
                score += scoreI;
            }
        }
        return score;
    }
    return 0;
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
}



var MatrixLayer = cc.Layer.extend({
    ctor:function (rowCount, columnCount, typeCount, size) {
        this._super();
        this.matrixItems = [];
        this.lines = [];
        this.marixLogic = new MatrixLogic();
        this.marixLogic.init(rowCount, columnCount, typeCount);

        this.setContentSize(size.width, size.height);
        this.itemSize = cc.size(size.width / columnCount, size.height / rowCount); 
        this.initTouchLayer();
        this.resetMatix();
        return true;
    },

    initTouchLayer:function(){
        this.touchLayer = new ccui.Layout();
        // this.touchLayer.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        // this.touchLayer.setBackGroundColor(cc.color(0,0,255));
        // this.touchLayer.setBackGroundColorOpacity(255);

        this.addChild(this.touchLayer);
        this.touchLayer.setContentSize(this.width, this.height);
        this.touchLayer.setTouchEnabled(true);

        var self =this;
        this.touchLayer.addTouchEventListener(function(touchLayer, eventType) {
            if (eventType == ccui.Widget.TOUCH_BEGAN) {
                self.doTouchMove(touchLayer.getTouchBeganPosition());
            }else if (eventType == ccui.Widget.TOUCH_MOVED) {
                self.doTouchMove(touchLayer.getTouchMovePosition());
            }else if (eventType == ccui.Widget.TOUCH_ENDED || eventType == ccui.Widget.TOUCH_CANCELED) {
                self.doTouchEnd(touchLayer.getTouchEndPosition());
            }
        });

        var csdNode = ccs.load("res/sanxiao/matrixItemNode.json").node;
        cc.log(csdNode);

        this.cloneItemNode = csdNode.getChildByName("item");
        this.cloneItemNode.visible = false;
        this.cloneItemNode.removeFromParent();
        this.addChild(this.cloneItemNode);

        this.cloneLineNode = csdNode.getChildByName("line");
        this.cloneLineNode.visible = false;
        this.cloneLineNode.removeFromParent();
        this.addChild(this.cloneLineNode);
    },

    doTouchMove:function(touchPos){
        var touchItem = this.getTouchItem(touchPos);
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
        this.doTouchMove(touchPos);
        //todo 算分 动画 
        var score = this.marixLogic.getSelectScore();
        if (score > 0) {
            //选出选中的
            //生成新的补进
            var rowCount = this.marixLogic.rowCount;
            var columnCount = this.marixLogic.columnCount;

            var selectItems = [];
            var newItems = [];
            var moveItems = [];

            //选中的节点
            for (var i = 0; i < this.marixLogic.select.length; i++) {
                var sel = this.marixLogic.select[i];
                var selNode = this.matrixItems[sel.row][sel.column];
                selectItems.push({row:sel.row,column:column,node:selNode});
                this.marixLogic.data[sel.row][sel.column] = null;
                this.matrixItems[sel.row][sel.column] = null;
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
                            cc.log(nullCount, row, column);
                            this.marixLogic.data[row + nullCount][column] = this.marixLogic.data[row][column];
                            this.matrixItems[row + nullCount][column] = moveNode;
                            this.marixLogic.data[row][column] = null;
                            this.matrixItems[row][column] = null;
                            moveItems.push({row:row + nullCount,column:column,node:moveNode});
                        }
                    }
                }

                while (nullCount > 0) {
                    //补充的节点
                    this.marixLogic.data[nullCount - 1][column] = this.marixLogic.newItem();
                    var item = this.marixLogic.data[nullCount - 1][column];
                    var itemNode = this.cloneItemNode.clone();
                    itemNode.visible = true;
                    itemNode.getChildByName("bg_iv").loadTexture(MatrixLogic.Config.Items[item.type].Bg);
                    itemNode.getChildByName("score_tv").setString(item.score + "");
                    this.addChild(itemNode, 2);
                    itemNode.x = this.width / rowCount * (column + 0.5);
                    itemNode.y = this.height / columnCount * (columnCount - nullCount - 1 - 0.5) + 1000;

                    this.matrixItems[nullCount - 1][column] = itemNode;
                    newItems.push({row:nullCount - 1,column:column,node:itemNode});
                    nullCount--;
                }
            }
            
            this.resetSlectItemScore(true);
            this.marixLogic.select = [];
            this.resetLine();

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
                cc.log(item,x,y);
                item.node.runAction(cc.moveTo(0.3, cc.p(x, y)));
            }

            //Boom
            var itemEffect = new cc.ParticleSystem("res/sanxiao/itemEffect.plist");
            var lastSelNode = selectItems[selectItems.length - 1].node;
            itemEffect.setPosition(cc.p(lastSelNode.x, lastSelNode.y));
            this.addChild(itemEffect, 3);
            itemEffect.runAction(cc.sequence(cc.delayTime(0.3),cc.scaleTo(0.3, 0.3), cc.callFunc(function(){
                itemEffect.removeFromParent();
            })));
            for (var i = 0; i < selectItems.length; i++) {
                var selNode = selectItems[i];
                selNode.node.removeFromParent();
            }

        }else{
            this.resetSlectItemScore(true);
            this.marixLogic.select = [];
            this.resetLine();
        }
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
        var data = this.marixLogic.data;
        for (var i = 0; i < this.marixLogic.select.length; i++) {
            var selectI = this.marixLogic.select[i];
            var scoreI = data[selectI.row][selectI.column].score;
            if (isSetInitScore) {
                var node = this.matrixItems[selectI.row][selectI.column];
                node.getChildByName("score_tv").setString(scoreI + "");
                node.scale = 1;
            }else{
                var j = i + 1;
                for (; j < this.marixLogic.select.length; j++) {
                    var selectJ = this.marixLogic.select[j];
                    if (scoreI != data[selectJ.row][selectJ.column].score) {
                        break;
                    }
                }

                if (j - i >= 3) {
                    for (var k = i; k < j; k++) {
                        var selectK = this.marixLogic.select[k];
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

        for (var i = 0; i < this.marixLogic.select.length; i++) {
            var beginNode = this.marixLogic.select[i];
            var posB = this.matrixItems[beginNode.row][beginNode.column];
            if (i == this.marixLogic.select.length - 1) {
                var posE = touchPos;
            }else{
                var endNode = this.marixLogic.select[i + 1];
                var posE = this.matrixItems[endNode.row][endNode.column];
            }
            this.drawOneLine(posB, posE);
        }
    },

    moveLastLine:function(touchPos){
        if (this.lines.length > 0 && this.marixLogic.select.length > 0) {
            var line = this.lines[this.lines.length - 1];
            var lastNode = this.marixLogic.select[this.marixLogic.select.length - 1];
            var posB = this.matrixItems[lastNode.row][lastNode.column];
            var posE = touchPos;
            var width = Math.sqrt(Math.pow(posE.x - posB.x, 2) + Math.pow(posE.y - posB.y, 2));
            line.width = width;
            line.setRotation(Math.atan2((posB.y-posE.y), (posE.x-posB.x)) * (180/Math.PI));
        }
    },

    drawOneLine:function(posB, posE){
        var width = Math.sqrt(Math.pow(posE.x - posB.x, 2) + Math.pow(posE.y - posB.y, 2));
        var line = this.cloneLineNode.clone();
        line.visible = true;
        var color = cc.color(255,255,255);

        var firstSel = this.marixLogic.getSelectDataByIdx(0);
        if (firstSel) {
            color = MatrixLogic.Config.Items[this.marixLogic.data[firstSel.row][firstSel.column].type].LineColor;
        } 
        line.setColor(color)
        this.addChild(line);
        line.width = width;
        line.setRotation(Math.atan2((posB.y-posE.y), (posE.x-posB.x)) * (180/Math.PI));
        line.x = posB.x;
        line.y = posB.y;
        this.lines.push(line);
    },

    resetMatix:function(){
        for (var i = 0; i < this.matrixItems.length; i++) {
            for (var j = 0; j < this.matrixItems[i].length; j++) {
                this.matrixItems[i][j].removeFromParent();
            }
        }

        this.matrixItems = [];
        
        for (var i = 0; i < this.marixLogic.data.length; i++) {
            var row = this.marixLogic.data[i];
            var rowNodes = [];
            for (var j = 0; j < row.length; j++) {
                var item = row[j];
                var itemNode = this.cloneItemNode.clone();
                itemNode.visible = true;
                itemNode.getChildByName("bg_iv").loadTexture(MatrixLogic.Config.Items[item.type].Bg);
                itemNode.getChildByName("score_tv").setString(item.score + "");
                this.addChild(itemNode, 2);
                itemNode.x = this.width / this.marixLogic.rowCount * (j + 0.5);
                itemNode.y = this.height / this.marixLogic.columnCount * (this.marixLogic.columnCount - i - 0.5);
                rowNodes.push(itemNode);
            }
            this.matrixItems.push(rowNodes);
        }
    },
});
