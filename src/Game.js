// let Game = (function () {
//     (function Game() {
        //子弹发射偏移位置
        this.bulletPos = [[0],[-15,15],[-30,0,30],[-45,-15,15,45]]
        //关卡等级
        this.level = 0
        //积分成绩
        this.score = 0
        //升级所需分数
        this.levelUpScore = 10
        //子弹级别
        this.bulletLevel = 0
        //创建敌人、  类型 血量 速度 半径
        this.hps = [1,2,2]
        this.speeds = [3,2,1]
        this.radius = [15,30,70] 

        Laya.init(400, 852, Laya.WebGL)  //看背景
        Laya.stage.scaleMode = "fixedauto_"
        Laya.stage.alignH = "center"
        Laya.stage.screenMode = "vertical"  //竖屏
        // (路径，一次对象，操控事件回掉，类型)
        Laya.loader.load("res/atlas/war.atlas", Laya.Handler.create(this, onLoaded), null, Laya.Loader.ATLAS)
    // })()
    function onLoaded () {
        this.bg = new Background()
        Laya.stage.addChild(this.bg)
        //实例化角色容器
        this.roleBox = new Laya.Sprite()
        Laya.stage.addChild(this.roleBox)
        //创建UI界面
        this.gameInfo = new GameInfo()
        Laya.stage.addChild(this.gameInfo)

        this.myplane = new Myplane()
        this.roleBox.addChild(this.myplane)

        
        //开始游戏
        restart();
    }
    
    
    function onMouseMove() {
        this.myplane.pos(Laya.stage.mouseX, Laya.stage.mouseY)
    }
    function createEnemy(type,num,speed,hp) {
            for(let i=0; i < num; i++){
                //随机出现敌人
                // let r = Math.random()
                // //根据随机数随机敌人
                // let type = r<0.7?0:r<0.95?1:2;
                //创建敌人 在对象池中
                let enemy = Laya.Pool.getItemByClass("Myplane", Myplane)
                //初始化属性
                enemy.init("enemy"+(type+1),1,hp,speed,this.radius[type])
                //随机位置
                enemy.pos(Math.random()*400, Math.random()*200-100)
                //添加舞台
                this.roleBox.addChild(enemy)
            }
    }
    function onLoop() { 
        //遍历所有飞机 更改飞机状态  子对象数量
        for(let i = this.roleBox.numChildren-1; i>-1; i--){
            let role = this.roleBox.getChildAt(i)
            if(role && role.speed){
                role.y += role.speed
                if(role.y>1000 || !role.visible || (role.isBullet && role.y < -20)){
                    //移除
                    role.removeSelf()
                    // 回收前重置其属性
                    role.isBullet = false
                    role.visible = true
                    //回收到对象池
                    Laya.Pool.recover("Myplane", role)
                }
            }
             //处理发射子弹的逻辑
            if(role.shootType > 0) {
                let time = Laya.Browser.now()
                if(time>role.shootTime) {
                    role.shootTime = time+role.shootInterval
                    //根据不同子弹类型，设置不同数量及位置
                    this.pos = this.bulletPos[role.shootType - 1]
                    for(let idx=0;idx < pos.length; idx++){
                        //对象池创建子弹
                        let bullet = Laya.Pool.getItemByClass("Myplane", Myplane)
                        //初始化子弹信息
                        bullet.init("bullet1",role.camp,1,-4-role.shootType-Math.floor(this.level/15),1,1)
                        //设置角色类型为子弹类型
                        //bullet.isBullet = true
                        //设置子弹发射初始位置
                        bullet.pos(role.x+pos[idx],role.y-role.hitRadius-10)
                        //添加到舞台
                        this.roleBox.addChild(bullet)
                    }
                    //添加音效
                    Laya.SoundManager.playSound("res/sound/bullet.mp3")
                }
            }
        }
        //碰撞检测
        for(let i=this.roleBox.numChildren-1;i>-1;i--){
            //获取角色
            let role = this.roleBox.getChildAt(i)
            //血量判断 死亡则忽略
            if(role.hp < 1)continue
            for(let j=i-1;j>-1;j--){
                //忽略死亡
                if(!role.visible)continue
                //角色2
                let role2 = this.roleBox.getChildAt(j)
                //角色未死亡阵营不同才碰撞
                if(role2.hp > 0 && role.camp !== role2.camp){
                    //碰撞区域 = 角色1的半径 + 角色2的半径
                    //console.log(1)
                    let hitRadius = role.hitRadius + role2.hitRadius
                    if(Math.abs(role.x-role2.x)<hitRadius && Math.abs(role.y-role2.y)<hitRadius) {
                        //掉血
                        if((role.heroType === 2 || role.heroType === 3 || role2.heroType === 2 || role2.heroType === 3) ){
                            lostHp(role,0)
                            lostHp(role2,0)
                        }else {
                            lostHp(role,1)
                            lostHp(role2,1)

                            //每掉1滴血 积分+1
                            this.score++;
                            this.gameInfo.score(this.score)
                            //积分大于升级积分 升级关卡
                            if(this.score > this.levelUpScore){
                                //升级关卡
                                this.level++
                                this.gameInfo.level(this.level)
                                this.levelUpScore += this.level*5
                            }
                        }
                    }
                }
            }
        }
        //死亡，停止循环
        if(this.myplane.hp <= 0){
            Laya.timer.clear(this, onLoop)
            //死亡音效
            Laya.SoundManager.playSound("res/sound/game_over.mp3")
            this.gameInfo.infoLabel.text = "GameOver,您的分数: " + this.score + "\n点击这里重新开始"
            this.gameInfo.infoLabel.once(Laya.Event.CLICK,this,restart)
        }
        //每隔60帧创建新的敌机
        // if(Laya.timer.currFrame % 60 === 0){
        //     createEnemy(2)
        // }

        //关卡越高  敌机生成时间- 速度+ 血量+ 数量+
        let cutTime = this.level < 30 ? this.level * 2 : 60
        let speedUp = Math.floor(this.level / 6)
        let hpUp = Math.floor(this.level / 8)
        let numUp = Math.floor(this.level / 10)
        let timer = Laya.timer.currFrame
        //生成小飞机
        if(timer % (80 - cutTime) === 0){
            createEnemy(0,2+numUp,3+speedUp,1)
        }
        //中
        if(timer % (150 - cutTime * 4) === 0){
            createEnemy(1,1+numUp,2+speedUp,2+hpUp*2)
        }
        //大
        if(timer % (900 - cutTime * 4) === 0){
            createEnemy(2,1,1+speedUp,10+hpUp*6)
            //BOSS出场音效
            Laya.SoundManager.playSound("res/sound/enemy3_out.mp3")
        }
    }
    function lostHp (role, lost) {
        //判断死亡
        role.hp -= lost 
        if(role.heroType === 2){
            //吃升级道具
            this.bulletLevel++
            //每升1级，子弹数加一， max为4
            this.myplane.shootType = Math.min(Math.floor(this.bulletLevel / 2)+1,4)
            //子弹级别越高，发射频率越快
            this.myplane.shootInterval = 500 - 20 * (this.bulletLevel > 20 ? 20 : this.bulletLevel)
            //添加道具声音
            Laya.SoundManager.playSound("res/sound/achievement.mp3")
            //影藏道具
            role.visible = false
        }else if(role.heroType === 3) {
            //吃血瓶
            this.myplane.hp++
            this.gameInfo.hp(this.myplane.hp)
            //设置最大血量不超过10
            if(this.myplane.hp > 10)this.myplane.hp = 10
            //添加道具声音
            Laya.SoundManager.playSound("res/sound/achievement.mp3")
            role.visible = false
        }
        if(role.hp>0 && role.heroType === 0 && role.type !== 'hero'){  //没死播放爆炸
            role.playAction("hit")
        } else {
            if(role.heroType === 1) {
                //如果是子弹 直接影藏
                role.visible = false
            }else {
                if(role.heroType === 0 && lost !== 0 && role.hp<=0){
                    if(role.type != "hero"){
                        Laya.SoundManager.playSound("res/sound/"+role.type+"_down.mp3")
                    }
                    role.playAction("down")
                }
                
                //BOSS掉落
                if(role.type === "enemy3"){
                    //随机道具
                    let type = Math.random() < 0.7 ? 2 : 3
                    let item = Laya.Pool.getItemByClass("Myplane", Myplane)
                    item.init("ufo"+(type -1), role.camp, 1, 1, 15, type)
                    item.pos(role.x, role.y)
                    this.roleBox.addChild(item)
                }
            }
        }
        //设置主角血量值
        if(role === this.myplane){
            this.gameInfo.hp(role.hp)
        }
    }
    //
    function restart() {
        //重置数据
        this.score = 0
        this.level = 0
        this.levelUpScore = 10
        this.bulletLevel = 0
        this.gameInfo.reset()
        
        this.myplane.pos(200, 500)
        this.myplane.init("hero",0 , 5, 0, 30)
        //射击类型
        this.myplane.shootType = 1

        this.myplane.shootInterval = 500
        this.myplane.visible = true
        for(let i = this.roleBox.numChildren-1;i>-1;i--){
            let role = this.roleBox.getChildAt(i)
            if(role != this.myplane){
                role.removeSelf()
                //重置信息回收到对象池
                role.visible = true
                Laya.Pool.recover("Myplane", role)
            }
        }
        //恢复游戏
        resume()
    }
    //暂停
    function pause() {
        Laya.timer.clear(this, onLoop)
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this,onMouseMove)
    }
    //开始恢复
    function resume() {
        //创建敌人
        Laya.timer.frameLoop(1, this, onLoop)
        //跟随移动  off关闭 even 派发事件
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, onMouseMove)
    }
// })()