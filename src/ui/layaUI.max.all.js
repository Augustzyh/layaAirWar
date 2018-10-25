var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var GameInfoUI=(function(_super){
		function GameInfoUI(){
			
		    this.pauseBtn=null;
		    this.hpLabel=null;
		    this.scoreLabel=null;
		    this.levelLabel=null;
		    this.infoLabel=null;

			GameInfoUI.__super.call(this);
		}

		CLASS$(GameInfoUI,'ui.GameInfoUI',_super);
		var __proto__=GameInfoUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(GameInfoUI.uiView);

		}

		GameInfoUI.uiView={"type":"View","props":{"width":400,"height":852},"child":[{"type":"Button","props":{"y":43,"x":308,"var":"pauseBtn","stateNum":1,"skin":"war/btn_pause.png"}},{"type":"Label","props":{"y":38,"x":11,"width":83,"var":"hpLabel","text":"HP:10","height":30,"fontSize":24,"color":"#4fe221","align":"center"}},{"type":"Label","props":{"y":77,"x":6,"width":121,"var":"scoreLabel","text":"Score:50","height":31,"fontSize":26,"color":"#d7d029","align":"center"}},{"type":"Label","props":{"y":37,"x":116,"width":111,"var":"levelLabel","text":"Level:10","height":34,"fontSize":24,"color":"#f9f9f9","align":"center"}},{"type":"Label","props":{"y":415,"x":28,"wordWrap":true,"width":344,"var":"infoLabel","text":"战斗结束","height":147,"fontSize":24,"color":"#fdfdfd","align":"center"}}]};
		return GameInfoUI;
	})(View);