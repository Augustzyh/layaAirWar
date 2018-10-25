let Background = (function (_super) {
    function Background () {
        Background.super(this)
        this.bg1 = new Laya.Sprite()
        this.bg1.loadImage("war/background.png")
        this.addChild(this.bg1)
        this.bg2 = new Laya.Sprite()
        this.bg2.loadImage("war/background.png")
        this.bg2.pos(0, -852)
        this.addChild(this.bg2)

        //添加帧循环 定时重复执行
        Laya.timer.frameLoop(1, this, this.onLoop)
    }
    //注册类
    Laya.class(Background, "Background", _super)
    let _proto = Background.prototype
    _proto.onLoop = function () {
        this.y += 1
        //console.log(this.y,this.bg1.y,this.bg2.y)
        this.y += 1
        // if(this.y + this.bg1.y >= 852) {
        //     this.bg1.y -= 852*2
        // }
        // if(this.y + this.bg2.y >= 852){
        //     this.bg2.y -= 852*2
        // }
        if(this.y >= 852){
            this.bg1.y = -852*2
        }
        if(this.y >= 852*2) {
            this.bg2.y = -852
            this.y = 0
            this.bg1.y= 0
        }
    }
    return Background
})(Laya.Sprite)