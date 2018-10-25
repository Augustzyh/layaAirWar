let Myplane = (function(_super) {
    function Myplane () {
        Myplane.super(this) 
    }
    Myplane.cached = false;
    Laya.class(Myplane, "Myplane", _super)
    let _proto = Myplane.prototype
    _proto.init = function (_type,_camp,_hp,_speed,_hitRadius,_heroType) {
        if(!_heroType)_heroType = 0
        this.type = _type //种类
        this.camp = _camp  //阵营
        this.hp = _hp
        this.speed = _speed
        this.hitRadius = _hitRadius //攻击半径
        //0普通 1子弹 2子弹道具 3补给品
        this.heroType = _heroType;
        //射击类型
        this.shootType = 0
        //射击间隔
        this.shootInterval = 500
        //下次射击时间  获取浏览器当前时间戳
        this.shootTime = Laya.Browser.now()+2000
        //当前动作
        this.action = ""
        //是否是子弹
        this.isBullet = false
        if(!Myplane.cached){
            Myplane.cached = true
            //我
            Laya.Animation.createFrames(aniUrls("hero_fly", 2), "hero_fly")
            Laya.Animation.createFrames(aniUrls("hero_down", 4), "hero_down")
            //敌军1
            Laya.Animation.createFrames(aniUrls("enemy1_fly", 1), "enemy1_fly")
            Laya.Animation.createFrames(aniUrls("enemy1_down", 4), "enemy1_down")
            //敌军2
            Laya.Animation.createFrames(aniUrls("enemy2_fly", 1), "enemy2_fly")
            Laya.Animation.createFrames(aniUrls("enemy2_down", 4), "enemy2_down")
            Laya.Animation.createFrames(aniUrls("enemy2_hit", 0), "enemy2_hit")
            //敌军3
            Laya.Animation.createFrames(aniUrls("enemy3_fly", 2), "enemy3_fly")
            Laya.Animation.createFrames(aniUrls("enemy3_down", 6), "enemy3_down")
            Laya.Animation.createFrames(aniUrls("enemy3_hit", 0), "enemy3_hit")
            //子弹
            Laya.Animation.createFrames(aniUrls("bullet",1), "bullet1_fly") 
            //强化包
            Laya.Animation.createFrames(aniUrls("ufo1",0), "ufo1_fly")
            //医疗包
            Laya.Animation.createFrames(aniUrls("ufo2",0), "ufo2_fly")
        }
        function aniUrls(aniName,length){
            var urls = [];
            if(length){
                for(var i = 1;i<=length;i++){
                    //动画资源路径要和动画图集打包前的资源命名对应起来
                    urls.push("war/"+aniName+i+".png");
                }
            }else{
                urls.push("war/"+aniName+".png")
            }
            return urls;
        }

        if(!this.body) {
            this.body = new Laya.Animation()
            this.addChild(this.body)
            // 播放完成
            this.body.on(Laya.Event.COMPLETE, this, this.onPlayComplete)
        }
        //类型播放
        this.playAction("fly") 
    }
    _proto.playAction = function(action) {
        this.action = action //记录当前播放类型
        // 帧 循环 动画名
        this.body.play(0, true, this.type + "_" + action)
        //获取动画大小区域
        this.bound = this.body.getBounds()
        this.body.pos(-this.bound.width/2, -this.bound.height/2)
    }
    _proto.onPlayComplete = function () {
        //若是击毁动画则隐藏对象
        if(this.action === 'down') {
            this.body.stop()
            this.visible = false
        } else if(this.action === 'hit') {
            this.playAction("fly")
        }
    }
    return Myplane
})(Laya.Sprite)