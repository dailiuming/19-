var Local = function (socket) {
    // 游戏对象
    var game
    // 下落速度
    var INTERVAL = 200  //毫秒
    // 定时器
    var timer = null
    // 时间计时器
    var timeCount = 0
    // 时间
    var time = 0
    // 绑定键盘事件
    var bindKeyEvent = function () {
        document.onkeydown = function (e) {
            if (e.keyCode == 38) {    //up  旋转
                game.rotate()
                socket.emit('rotate')
            } else if (e.keyCode == 39) {    //right
                game.right()
                socket.emit('right')
            } else if (e.keyCode == 40) {    //down
                game.down()
                socket.emit('down')
            } else if (e.keyCode == 37) {    //left
                game.left()
                socket.emit('left')
            } else if (e.keyCode == 32) {    //spacd
                game.fall()
                socket.emit('fall')
            }
        }
    }
    // 移动
    var move = function () {
        timeFunc()
        if (!game.down()) {
            //判断到底部变色
            game.fixed()
            socket.emit('fixed')
            // 消除
            var line = game.checkClear()
            if (line) {
                game.addScore(line)
                socket.emit('line', line)
                if (line > 1) {
                    var bottomLines = generataBottomLine(line)
                    socket.emit('bottomLines', bottomLines)
                }
            }
            // 游戏结束条件
            var gameover = game.checkGameOver()
            if (gameover) {
                game.gameover(false)
                document.getElementById('remote_gameover').innerHTML = '你赢了'
                socket.emit('lose')
                stop()
            } else {
                // 重新再生成一个
                var t = generateType()
                var d = generateDir()
                game.performNext(t, d)
                socket.emit('next', { type: t, dir: d })
            }

        } else {
            socket.emit('down')
        }
    }

    // 随机生成干扰行
    var generataBottomLine = function (lineNum) {
        var lines = []
        for (var i = 0; i < lineNum; i++) {
            var line = []
            for (var j = 0; j < 10; j++) {
                line.push(Math.ceil(Math.random() * 2) - 1)
            }
            lines.push(line)
        }
        return lines
    }

    // 随机生产一个方块
    var generateType = function () {
        return Math.ceil(Math.random() * 7) - 1
    }
    // 随机生产一个方块
    var generateDir = function () {
        return Math.ceil(Math.random() * 4) - 1
    }
    // 停止游戏
    var stop = function () {
        if (timer) {
            clearInterval(timer)
            timer = null
        }
        document.onkeydown = null
    }
    // 计数函数
    var timeFunc = function () {
        timeCount = timeCount + 1
        if (timeCount == 5) {
            timeCount = 0
            time = time + 1
            game.setTime(time)
            socket.emit('time', time)
        }
    }
    var start = function () {
        var doms = {
            gameDiv: document.getElementById('local_game'),
            nextDiv: document.getElementById('local_next'),
            timeDiv: document.getElementById('local_time'),
            scoreDiv: document.getElementById('local_score'),
            resultDiv: document.getElementById('local_gameover')
        }
        game = new Game()
        var type = generateType()
        var dir = generateDir()
        game.init(doms, type, dir)
        socket.emit('init', { type: type, dir: dir })
        bindKeyEvent()
        var t = generateType()
        var d = generateDir()
        game.performNext(t, d)
        socket.emit('next', { type: t, dir: d })
        timer = setInterval(move, INTERVAL)
    }

    socket.on('lose', function () {
        game.gameover(true)
        stop()
    })

    socket.on('start', function () {
        document.getElementById('waiting').innerHTML = ''
        start()
    })

    socket.on('leave', function () {
        document.getElementById('local_gameover').innerHTML = '对方掉线'
        document.getElementById('remote_gameover').innerHTML = '已掉线'
        start()
    })

    socket.on('bottomLines', function (data) {
        game.addTailLines(data)
        socket.emit('addTailLines', data)
    })
}