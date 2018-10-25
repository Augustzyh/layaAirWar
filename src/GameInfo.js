//游戏UI文件
let GameInfo = (function(_super){
    function GameInfo() {
        GameInfo.super(this)
        //点击事件，点击暂停
        this.pauseBtn.on(Laya.Event.CLICK, this, this.onPauseBtnClick)
        //初始化UI
        this.reset()
    }
    Laya.class(GameInfo, "GameInfo", _super)
    let _proto = GameInfo.prototype
    _proto.reset = function() {
        this.infoLabel.text = ""
        this.hp(5);
        this.level(0)
        this.score(0)
    }
    _proto.onPauseBtnClick = function(e) {
        e.stopPropagation()
        this.infoLabel.text = "游戏已暂停，点击任意位置恢复游戏"
        pause()
        Laya.stage.once(Laya.Event.CLICK, this, this.onStageClick)
    }
    _proto.onStageClick = function() {
        this.infoLabel.text = ""
        resume()
    }
    //显示当前血量
    _proto.hp = function(value){
        this.hpLabel.text = "HP:"+value
    }
    //关卡级别
    _proto.level = function(value){
        this.levelLabel.text = "Level:"+value
    }
    //积分
    _proto.score = function(value){
        this.scoreLabel.text = "Score:"+value
    }
    return GameInfo
})(ui.GameInfoUI);