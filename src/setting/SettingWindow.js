/**
 * Created by liuzq on 2019/4/13.
 */

 var ui = ui || {};

 ui.SettingWindow = cc.Layer.extend({

 	ctor : function(){
 		this.super();

 		this.layer = ccs.load(res.settingLayer).node;
        this.addChild(this.layer);
        this._initUI();
 	},

 	_initUI : function(){

 	}
 });