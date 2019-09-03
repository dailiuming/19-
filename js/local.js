var Local = function () {
    // 游戏对象
    var game
    // 下落速度
    var INTERVAL = 200  //毫秒
    // 定时器
    var timer = null
    // 绑定键盘事件
    var bindKeyEvent = function () {
        document.onkeydown = function (e) {
            if (e.keyCode == 38) {    //up  旋转
                game.rotate()
            } else if (e.keyCode == 39) {    //right
                game.right()
            } else if (e.keyCode == 40) {    //down
                game.down()
            } else if (e.keyCode == 37) {    //left
                game.left()
            } else if (e.keyCode == 32) {    //spacd
                game.fall()
            }
        }
    }
    // 移动
    var move = function () {
        if (!game.down()) {
            //判断到底部变色
            game.fixed()
            // 消除
            game.checkClear()
            // 游戏结束条件
            game.checkGameOver()
            // 重新再生成一个
            game.performNext(generateType(), generateDir())

        }
    }
    // 随机生产一个方块
    var generateType = function () {
        return Math.ceil(Math.random() * 7) - 1
    }
    // 随机生产一个方块
    var generateDir = function () {
        return Math.ceil(Math.random() * 4) - 1
    }
    var start = function () {
        var doms = {
            gameDiv: document.getElementById('game'),
            nextDiv: document.getElementById('next')
        }
        game = new Game()
        game.init(doms)
        bindKeyEvent()
        timer = setInterval(move, INTERVAL)
    }
    // 导出
    this.start = start
}