var MatrixLogic = function(){
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

MatrixLogic.Config = {
    Items:[{Bg:"res/sanxiao/M.png",Frame:"res/sanxiao/m1.png"},
            {Bg:"res/sanxiao/L.png",Frame:"res/sanxiao/m2.png"},
            {Bg:"res/sanxiao/H.png",Frame:"res/sanxiao/m3.png"},
            {Bg:"res/sanxiao/N.png",Frame:"res/sanxiao/m4.png"}],
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
                self.doTouchMove(touchLayer.getTouchEndPosition());
                //todo 算分 动画 
                self.marixLogic.select = [];
                self.resetLine();
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
                this.resetSlectItemScore();
                this.resetLine(touchPos);
            }else{
                this.moveLastLine(touchPos);
            }
        }else{
            this.moveLastLine(touchPos);
        }
    },

    getTouchItem:function(touchPos){
        var columnIdx = Math.floor((touchPos.x / this.width) * this.marixLogic.rowCount);
        var rowIdx = Math.floor((this.height - touchPos.y) / this.height * this.marixLogic.columnCount);
       
        if (rowIdx >= 0 && columnIdx >= 0 && rowIdx < this.marixLogic.rowCount && columnIdx < this.marixLogic.columnCount) {
            var idx = rowIdx * this.marixLogic.columnCount + columnIdx;
            if (idx < this.matrixItems.length) {
                var touchNode = this.matrixItems[idx];
                if (cc.rectContainsPoint(cc.rect(touchNode.x - touchNode.width * 0.5,touchNode.y - touchNode.height * 0.5,touchNode.width,touchNode.height),touchPos)) {
                    return {idx:idx,column:columnIdx,row:rowIdx};
                }
            }
        }
        return null;
    },

    resetSlectItemScore:function(isSetInitScore){
        var data = this.marixLogic.data;
        var sameScoreIdxBegin = 0;
        var sameScoreIdxEnd = 0;
        var sameScore = 0;
        for (var i = 0; i < this.marixLogic.select.length; i++) {
            var select = this.marixLogic.select[i];
            if (isSetInitScore) {
                cc.log(data, select)
                this.matrixItem[select.idx].getChildByName("score_tv").setString(data[select.row][select.column]["score"] + "");
            }else{
                if (i == 0) {
                    sameScoreIdxBegin = i;
                    sameScoreIdxEnd = i;
                }else{
                    if (data[select.row][select.column].score != sameScore) {
                        sameScoreIdxEnd = i - 1;
                    }else if (i == this.marixLogic.select.length - 1) {
                        sameScoreIdxEnd = i;
                    }else{
                        sameScoreIdxBegin = i;
                        sameScoreIdxEnd = i;
                    }

                    cc.log(sameScoreIdxEnd, sameScoreIdxBegin);

                    if (sameScoreIdxEnd - sameScoreIdxBegin > 2) {
                        for (var j = sameScoreIdxBegin; j <= sameScoreIdxEnd; j++) {
                            var select = this.marixLogic.select[j];
                            this.matrixItem[select.idx].getChildByName("score_tv").setString(sameScore * 10 + "");
                        }
                        sameScoreIdxBegin = i;
                    }
                }
                sameScore = data[select.row][select.column]["score"];
            }
        }
    },

    resetLine:function(touchPos){
        for (var i = 0; i < this.lines.length; i++) {
            this.lines[i].removeFromParent();
        }

        for (var i = 0; i < this.marixLogic.select.length; i++) {
            var posB = this.matrixItems[this.marixLogic.select[i].idx];
            if (i == this.marixLogic.select.length - 1) {
                var posE = touchPos;
            }else{
                var posE = this.matrixItems[this.marixLogic.select[i + 1].idx];
            }
            this.drawOneLine(posB, posE);
        }
    },

    moveLastLine:function(touchPos){
        if (this.lines.length > 0 && this.marixLogic.select.length > 0) {
            var line = this.lines[this.lines.length - 1];
            var posB = this.matrixItems[this.marixLogic.select[this.marixLogic.select.length - 1].idx];
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
        this.addChild(line);
        line.width = width;
        line.setRotation(Math.atan2((posB.y-posE.y), (posE.x-posB.x)) * (180/Math.PI));
        line.x = posB.x;
        line.y = posB.y;
        this.lines.push(line);
    },

    resetMatix:function(){
        for (var i = 0; i < this.matrixItems.length; i++) {
            this.matrixItems[i].removeFromParent();
        }
        this.matrixItems = [];
        
        for (var i = 0; i < this.marixLogic.data.length; i++) {
            var row = this.marixLogic.data[i];
            for (var j = 0; j < row.length; j++) {
                var item = row[j];
                var itemNode = this.cloneItemNode.clone();
                itemNode.visible = true;
                itemNode.getChildByName("bg_iv").loadTexture(MatrixLogic.Config.Items[item.type].Bg);
                itemNode.getChildByName("score_tv").setString(item.score + "");
                this.addChild(itemNode);
                itemNode.x = this.width / this.marixLogic.rowCount * (j + 0.5);
                itemNode.y = this.height / this.marixLogic.columnCount * (this.marixLogic.columnCount - i - 0.5);
                this.matrixItems.push(itemNode);
            }
        }
    },


});
