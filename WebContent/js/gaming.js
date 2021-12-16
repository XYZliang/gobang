let chessXY = [];
let myChess = 1;
let gamingId = 0;
let watch = 0;
let danTime = 0;
let totalTime = 0;
let rightU = true;
let u1;
let u2;
let lastx = -1
let lasty = -1
let huix = -1
let huiy = -1
let duiUsername = ""
let video = false
let beix = undefined

function showChessboard() {
    if (document.getElementsByClassName("container")[10].style.top !== "50%") {
        document.getElementsByClassName("container")[10].style.top = "50%"
        document.getElementById("leftBar").style.transform = "translate(-100%,-50%)"
        document.getElementsByClassName("container")[6].style.top = "150%"
        let b = document.getElementById("chessBott")
        let c = document.getElementById("chessBott2")
        document.getElementById("chessBottt").style.display = "none"
        b.style.display = "block"
        b.style.opacity = "1";
        b.style.visibility = "unset";
        c.style.display = "block"
        c.style.opacity = "1";
        c.style.visibility = "unset";
    } else {
        document.getElementsByClassName("container")[10].style.top = "-50%"
        document.getElementById("leftBar").style.transform = "translate(0%,-50%)"
        document.getElementsByClassName("container")[6].style.top = "50%"
        cleanChessboard()
    }
}

function makeChessboard(Black, user1, user2) {
    u1 = user1
    u2 = user2
    document.getElementById("noCHess").style.display = "block"
    document.getElementById("noCHess").style.backgroundColor = "rgba(255,255,255,0.3)"
    document.getElementById("noCHess").style.height = "610px"
    let startList = ["startsZer", "startsOne", "startsTwo", "startsThr", "startsFou", "startsFiv"]
    document.getElementById("leftBox").getElementsByClassName("gameNickname")[0].innerHTML = user1.nickname
    document.getElementById("leftBox").getElementsByClassName("gameStarts")[0].classList.add(startList[user1.level])
    document.getElementById("leftBox").getElementsByClassName("gameHeadImg")[0].src = "images/headIcons/" + user1.name + ".png"
    document.getElementById("leftBox").getElementsByClassName("gameHeadImg")[0].onerror = function () {
        let perImg = document.getElementById("leftBox").getElementsByClassName("gameHeadImg")[0]
        perImg.src = "images/system/defaultHead.png"
    }
    document.getElementById("rightBox").getElementsByClassName("gameNickname")[0].innerHTML = user2.nickname
    document.getElementById("rightBox").getElementsByClassName("gameStarts")[0].classList.add(startList[user2.level])
    document.getElementById("rightBox").getElementsByClassName("gameHeadImg")[0].src = "images/headIcons/" + user2.name + ".png"
    document.getElementById("rightBox").getElementsByClassName("gameHeadImg")[0].onerror = function () {
        let perImg = document.getElementById("rightBox").getElementsByClassName("gameHeadImg")[0]
        perImg.src = "images/system/defaultHead.png"
    }
    if (Black === undefined || Black === null) {
        Black = myChess
    }
    cleanChessboard()
    let ChessboardEnd = document.getElementById("ChessboardEnd")
    for (let i = 1; i <= 15; i++) {
        let newR = document.createElement("tr");
        for (let ii = 1; ii <= 15; ii++) {
            if (Black === 1)
                newR.innerHTML += "<th class=\"chessB\" onclick=\"makeQi(" + i + "," + ii + "," + Black + ")\"><img src=\"\"></th>"
            else
                newR.innerHTML += "<th class=\"chess\" onclick=\"makeQi(" + i + "," + ii + "," + Black + ")\"><img src=\"\"></th>"
        }
        ChessboardEnd.parentNode.insertBefore(newR, ChessboardEnd)
    }
    for (let i = 0; i <= 15; i++) {
        chessXY[i] = [];
        for (let j = 0; j <= 15; j++) {
            chessXY[i][j] = 0;
        }
    }
    if (watch !== 1) {
        if (Black === 1) {
            duiUsername = u2.name
        } else {
            duiUsername = u1.name
        }
//运行的模式 需要开始的秒数（默认10） 运行的计时器（默认第一个） 倍速（默认1） 总秒数（默认time）
        leftDanTime("start", danTime, "", null, null, true)
        leftDanTime("start", totalTime, "1", null, null, true)
        leftDanTime("start", danTime, "2", null, null, true)
        leftDanTime("start", totalTime, "3", null, null, true)
        stop("all")
        startChess()
    } else
        startChess()
}

// makeChessboard(1)
function makeQi(x, y, Black, Re, goto) {
    let chess = document.getElementById("ChessboardTable")
    let hang = chess.getElementsByTagName("tr")
    for (let i = 0; i < 15; i++) {
        if (i + 1 === x) {
            let lie = hang[i].getElementsByTagName("th")
            for (let ii = 0; ii < 15; ii++) {
                if (ii + 1 === y) {
                    let img = lie[ii].getElementsByTagName("img")[0]
                    if (img.style.display !== "block") {
                        if (Re !== true) {
                            let username
                            let eleTimeSecEle
                            if (Black === 1) {
                                eleTimeSecEle = "timeSecond1"
                                username = u2.name
                            } else {
                                eleTimeSecEle = "timeSecond3"
                                username = u1.name
                            }
                            let eleTimeSec = document.getElementById(eleTimeSecEle).innerHTML;
                            let msg = {
                                'TO': username,
                                'type': 'makeQ',
                                'room': gamingId,
                                'x': x,
                                'y': y,
                                'Black': Black,
                                'Rtime': eleTimeSec,
                            }
                            tools.ajaxGet("http://127.0.0.1:8080/gobang/api/talk", msg, function (res) {
                                if (res.status !== 0) {
                                    showError("开始游戏失败：" + makeString(res.desc))
                                    return
                                }
                                if (Black === 1) {
                                    img.src = "images/system/chessB.png"
                                    chessXY[x][y] = 1
                                } else {
                                    img.src = "images/system/chessW.png"
                                    chessXY[x][y] = 2
                                }
                                lastx = x
                                lasty = y
                                img.style.display = "block"
                                img.parentNode.classList.add("chessNoHover")
                                if (Black === 1)
                                    change(true)
                                else
                                    change(false)
                                checkWin()
                                return
                            }, function (res) {
                                if (res.status === 20005) {
                                    showError("对方已离线，待上线后可继续游戏。")
                                    exit()
                                } else {
                                    showError("请求失败：" + makeString(res.desc))
                                }
                            })
                        } else {
                            if (Black === 1) {
                                img.src = "images/system/chessB.png"
                                chessXY[x][y] = 1
                            } else {
                                img.src = "images/system/chessW.png"
                                chessXY[x][y] = 2
                            }
                            img.style.display = "block"
                            img.parentNode.classList.add("chessNoHover")
                            if (!goto === true) {
                                if (Black === 1)
                                    change(true)
                                else
                                    change(false)
                                checkWin()
                            }
                            return
                        }
                    }
                }
            }
        }
    }
}

function cleanChessboard() {
    document.getElementById("ChessboardTable").innerHTML = "<tr id=\"ChessboardEnd\"></tr>"
}

let timeT = []
let timeT1 = []
let timeT2 = []
let timeT3 = []

//运行的模式 需要开始的秒数（默认10） 运行的计时器（默认第一个） 倍速（默认1） 总秒数（默认time）
function leftDanTime(fun, time, no, bei, total, ready, cont, watch) {
    if (no === null || no === undefined)
        no = ""
    let eleCirclesEle = "#timeCountX" + no + " circle"
    let eleTimeSecEle = "timeSecond" + no
    let eleCircles = document.querySelectorAll(eleCirclesEle);
    let eleTimeSec = document.getElementById(eleTimeSecEle);
    if (cont === true) {
        if (no == "" || no == "2")
            total = danTime
        else
            total = totalTime
        time = parseInt(eleTimeSec.innerHTML)
    }
    let perimeter = Math.PI * 2 * 170;
    let circleInit = function () {
        if (eleCircles[1]) {
            eleCircles[1].setAttribute("stroke-dasharray", "1069 1069")
        }
        if (eleCircles[2]) {
            eleCircles[2].setAttribute("stroke-dasharray", perimeter / 2 + " 1069")
        }
        eleTimeSec.innerHTML = ""
    };
    let timerTimeCount = null;
    let fnTimeCount = function (b) {
        if (timerTimeCount) {
            return
        }
        if (!b <= 0)
            b = b || 10
        total = total || b;
        let a = function () {
            let c = b / total;
            if (eleCircles[1]) {
                eleCircles[1].setAttribute("stroke-dasharray", perimeter * c + " 1069")
            }
            if (eleCircles[2] && b <= total / 2) {
                eleCircles[2].setAttribute("stroke-dasharray", perimeter * c + " 1069")
            }
            if (eleTimeSec) {
                eleTimeSec.style.color = "black";
                if (b > 999)
                    eleTimeSec.style.fontSize = "20px"
                else if (b > 99)
                    eleTimeSec.style.fontSize = "30px"
                else if (b > 9)
                    eleTimeSec.style.fontSize = "40px"
                else if (b <= 9) {
                    eleTimeSec.style.fontSize = "50px"
                    if (b <= 3)
                        eleTimeSec.style.color = "red"
                }
                eleTimeSec.innerHTML = b
            }
            if (ready)
                return
            b--;
            if (b < 0) {
                if (time == 0) {
                    clearInterval(timerTimeCount);
                    timerTimeCount = null;
                    return;
                }
                // if(watch!==true) {
                if (no == "2")
                    change(false, true)
                else if (no == "1" || no == "3") {
                    stop("all")
                    checkWin(no)
                } else
                    change(true, true)
                // }
                clearInterval(timerTimeCount);
                timerTimeCount = null;
            }
        };
        a();
        stop(no)
        if (beix === undefined)
            bei = 1
        else
            bei = beix
        timerTimeCount = setInterval(a, 1000 / bei)
        if (no === "") {
            timeT.push(timerTimeCount)
        } else if (no == "1") {
            timeT1.push(timerTimeCount)
        } else if (no == "2") {
            timeT2.push(timerTimeCount)
        } else if (no == "3") {
            timeT3.push(timerTimeCount)
        }
    };
    if (fun === "init") {
        circleInit()
    }
    if (fun === "start") {
        circleInit()
        fnTimeCount(time)
    }
}

function stop(no) {
    // if (no == "1" || no == "3") {
    //     let eleTimeSecEle1 = "timeSecond" + no
    //     let eleTimeSec1 = document.getElementById(eleTimeSecEle1)
    //     eleTimeSec1.innerHTML = (parseInt(eleTimeSec1.innerHTML) - 1).toString()
    // }

    function clearInt(T) {
        for (let i = T.length; i - 1 >= 0; i--) {
            try {
                clearInterval(T[i - 1])
                T.pop()
            } catch (e) {

            }
        }
    }

    if (no === "" || no === "all") {
        clearInt(timeT)
    }
    if (no == "1" || no === "all") {
        clearInt(timeT1)
    }
    if (no == "2" || no === "all") {
        clearInt(timeT2)
    }
    if (no == "3" || no === "all") {
        clearInt(timeT3)
    }
}

function checkWin(no) {
    if (no === null || no === undefined) {
        function isChess(a) {
            if (a == 1)
                return 1
            else if (a == 2)
                return 2
            else
                return 0
        }

        function check(i, j) {
            if (isChess(chessXY[i][j]) === 0)
                return false

            function checkShang(P) {
                if (i - P < 0)
                    return P - 1
                if (chessXY[i - P][j] === chessXY[i][j])
                    return checkShang(P + 1)
                else
                    return P
            }

            if (checkShang(1) >= 5)
                return true

            function checkXia(P) {
                if (i + P > 15)
                    return P - 1
                if (chessXY[i + P][j] === chessXY[i][j])
                    return checkXia(P + 1)
                else
                    return P
            }

            if (checkXia(1) >= 5)
                return true

            function checkZuo(P) {
                if (j - P < 0)
                    return P - 1
                if (chessXY[i][j - P] === chessXY[i][j])
                    return checkZuo(P + 1)
                else
                    return P
            }

            if (checkZuo(1) >= 5)
                return true

            function checkYou(P) {
                if (j + P > 15)
                    return P - 1
                if (chessXY[i][j + P] === chessXY[i][j])
                    return checkYou(P + 1)
                else
                    return P
            }

            if (checkYou(1) >= 5)
                return true

            function checkYS(P) {
                if (j + P > 15 || i - P < 0)
                    return P - 1
                if (chessXY[i - P][j + P] === chessXY[i][j])
                    return checkYS(P + 1)
                else
                    return P
            }

            if (checkYS(1) >= 5)
                return true

            function checkZS(P) {
                if (j - P < 0 || i - P < 0)
                    return P - 1
                if (chessXY[i - P][j - P] === chessXY[i][j])
                    return checkZS(P + 1)
                else
                    return P
            }

            if (checkZS(1) >= 5)
                return true

            function checkYX(P) {
                if (j + P > 15 || i + P > 15)
                    return P - 1
                if (chessXY[i + P][j + P] === chessXY[i][j])
                    return checkYX(P + 1)
                else
                    return P
            }

            if (checkYX(1) >= 5)
                return true

            function checkZX(P) {
                if (j - P < 0 || i + P > 15)
                    return P - 1
                if (chessXY[i + P][j - P] === chessXY[i][j])
                    return checkZX(P + 1)
                else
                    return P
            }

            if (checkZX(1) >= 5)
                return true

            return false
        }

        for (let i = 0; i <= 15; i++) {
            for (let j = 0; j <= 15; j++) {
                if (check(i, j)) {
                    stop("all")
                    let isWin = 0
                    if (isChess(chessXY[i][j]) === 1) {
                        showError("玩家" + document.getElementsByClassName("gamingInfo")[0].getElementsByClassName("gameNickname")[0].innerHTML + "获胜！", "ok")
                    }
                    if (isChess(chessXY[i][j]) === 2) {
                        showError("玩家" + document.getElementsByClassName("gamingInfo")[1].getElementsByClassName("gameNickname")[0].innerHTML + "获胜！", "ok")
                    }
                    if (myChess == chessXY[i][j] && isWin === 0) {
                        let msg = {
                            'type': 'Win',
                            'room': gamingId,
                            'Black': myChess,
                        }
                        tools.ajaxGet("http://127.0.0.1:8080/gobang/api/talk", msg, null, function (res) {
                            if (res.status === 20005) {
                                showError("对方已离线，待上线后可继续游戏。")
                                exit()
                            } else {
                                stop("all")
                                exit()
                            }
                        })
                    }
                    exit()
                }
            }
        }
    } else {
        stop("all")
        showNo(true)
        exit()
        let msg = {
            'type': 'outT',
            'room': gamingId,
            'Rtime': 0,
        }
        if (no == "1")
            showError("玩家" + findUserById(getRoom(gamingId).user2ID).nickname + "获胜！", "ok")
        else
            showError("玩家" + findUserById(getRoom(gamingId).userid).nickname + "获胜！", "ok")

        if (no == "1" && myChess === 1 || no == "3" && myChess === 2) {
            tools.ajaxGet("http://127.0.0.1:8080/gobang/api/talk", msg, function (res) {
                if (res.status !== 0) {
                    showError("服务器失败：" + makeString(res.desc))
                    return
                }
                exit()
            }, function (res) {
                if (res.status === 20005) {
                    showError("对方已离线，待上线后可继续游戏。")
                    exit()
                } else {
                    showError("请求失败：" + makeString(res.desc))
                }
            })
        }
    }
}

function havaData(data) {
    if (data === null)
        return false
    if (data === undefined)
        return false
    if (data == "null")
        return false
    return true
}

function makeQis(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].type === "makeQ") {
            makeQi(parseInt(data[i].x), parseInt(data[i].y), parseInt(data[i].Black), true, true)
        }
        if (data[i].type === "hui") {
            removeQi(parseInt(data[i].x), parseInt(data[i].y))
        }
    }
}

function makeTime(data) {
    let leftT = -1
    let rightT = -1
    let last = -1
    for (let i = data.length - 1; i >= 0; i--) {
        if (parseInt(data[i].Black) === 1 && leftT === -1) {
            leftT = parseInt(data[i].Rtime)
            if (last === -1)
                last = parseInt(data[i].Black)
        }
        if (parseInt(data[i].Black) === 2 && rightT === -1) {
            rightT = parseInt(data[i].Rtime)
            if (last === -1)
                last = parseInt(data[i].Black)
        }
        if (leftT !== -1 && rightT !== -1) {
            break
        }
    }
    if (leftT === -1)
        leftT = totalTime
    if (rightT === -1)
        rightT = totalTime
    //运行的模式 需要开始的秒数（默认10） 运行的计时器（默认第一个） 倍速（默认1） 总秒数（默认time）
    leftDanTime("start", leftT, "1", null, totalTime)
    leftDanTime("start", rightT, "3", null, totalTime)
    stop("all")
    return last
}

function startChess() {
    let roomInfo = getRoom(gamingId)
    totalTime = parseInt(roomInfo.totaltime)
    danTime = parseInt(roomInfo.onetime)
    let left
    if (havaData(roomInfo.data) && video === false) {
        makeQis(roomInfo.data)
        left = makeTime(roomInfo.data)
    }
    if (left === 1)
        left = 2
    else if (left === 2)
        left = 1
    if (watch === 1)
        return
    let t = 5
    let a = setInterval(function () {
        if (a === null || a === undefined)
            return
        if (t < 0) {
            //运行的模式 需要开始的秒数（默认10） 运行的计时器（默认第一个） 倍速（默认1） 总秒数（默认time）

            if (!havaData(roomInfo.data)) {
                leftDanTime("start", danTime, "")
                leftDanTime("start", totalTime, "1")
            }
            if (myChess === 1) {
                showNo()
            }
            clearInterval(a)
            a = null
            document.getElementById("noCHess").innerHTML = ""
            let b = document.getElementById("chessBott")
            if (video !== true) {
                document.getElementById("chessBottt").display = "block"
                b.style.display = "none"
                b.style.opacity = "1";
                b.style.visibility = "unset";
                b.style.display = "block";
            }
            window.onbeforeunload = function (event) {
                event.returnValue = "对局还在进行中，真的要退出吗？重新上线后可继续游戏。";
            };
            if (left === 1) {
                if (u1.name === getUserName())
                    change(false, undefined, false)
                else
                    change(false, undefined, true)
            } else if (left === 2) {
                if (u2.name === getUserName())
                    change(true, undefined, false)
                else
                    change(true, undefined, true)
            }
            return
        }
        document.getElementById("noCHess").innerHTML = t
        t--
    }, 1000)
}

function showNo(no) {
    let a = document.getElementById("noCHess")
    if (video || watch === 1) {
        a.style.display = "block"
        a.style.backgroundColor = "rgba(255,255,255,0)"
        a.style.height = "540px";
        return
    }
    if (a.style.display !== "block" || no === true || watch === 1) {
        a.style.display = "block"
        if (no === true) {
            setTimeout(function () {
                a.style.backgroundColor = "rgba(255,255,255,0)"
                a.style.height = "540px";
            }, 10)
        } else {
            setTimeout(function () {
                a.style.backgroundColor = "rgba(255,255,255,0.3)"
                a.style.height = "610px";
            }, 10)
        }
    } else {
        a.style.backgroundColor = "rgba(255,255,255,0)"
        setTimeout(function () {
            a.style.display = "none"
        }, 300)
    }
}

function showNo2(no) {
    let a = document.getElementById("noCHess")
    if (video || watch === 1) {
        a.style.display = "block"
        a.style.backgroundColor = "rgba(255,255,255,0)"
        a.style.height = "540px";
        return
    }
    if (no === true || watch === 1) {
        a.style.display = "block"
        setTimeout(function () {
            a.style.backgroundColor = "rgba(255,255,255,0.3)"
            a.style.height = "610px";
        }, 10)

    } else if (no === false) {
        a.style.backgroundColor = "rgba(255,255,255,0)"
        setTimeout(function () {
            a.style.display = "none"
        }, 300)
    }
}

function change(ToR, OutTime, open, guan) {
    // if (no == "1" || no == "3") {
    //     let eleTimeSecEle1 = "timeSecond" + no
    //     let eleTimeSec1 = document.getElementById(eleTimeSecEle1)
    //     eleTimeSec1.innerHTML = (parseInt(eleTimeSec1.innerHTML) - 1).toString()
    // }
    if (ToR && guan !== 1) {
        if (OutTime) {
            let eleTimeSecEle1 = "timeSecond" + "1"
            let eleTimeSec1 = document.getElementById(eleTimeSecEle1)
            eleTimeSec1.innerHTML = (parseInt(eleTimeSec1.innerHTML) - 1).toString()
            // leftDanTime("start",danTime,"",null,null,0,false)
        }

        stop("")
        stop("1")
        if (guan !== true) {
            leftDanTime("start", danTime, "2", null, null, false, false)
            leftDanTime("start", null, "3", null, null, false, true)
            if (open === undefined)
                showNo()
            else
                showNo2(open)
        }
    } else {
        if (OutTime) {
            let eleTimeSecEle1 = "timeSecond" + "3"
            let eleTimeSec1 = document.getElementById(eleTimeSecEle1)
            eleTimeSec1.innerHTML = (parseInt(eleTimeSec1.innerHTML) - 1).toString()
            // leftDanTime("start",danTime,"2",null,null,0,false)
        }

        stop("2")
        stop("3")
        if (guan !== true) {
            leftDanTime("start", danTime, "", null, null, false, false)
            leftDanTime("start", null, "1", null, null, false, true)
            if (open === undefined)
                showNo()
            else
                showNo2(open)
        }
    }
}

function ping(arg) {
    if (arg === true) {
        showError("对方同意平局", "ok")
        stop("all")
        showNo(true)
        document.getElementById("leftBar").style.transform = 'translate(0%, -50%)'
        exit()
        setTimeout(function () {
            document.getElementById("chessBott").style.display = "none";
        }, 300)
    } else if (arg === false) {
        showError("对方不同意平局")
    } else {
        let msg = {
            'TO': duiUsername,
            'type': 'ping',
            'room': gamingId,
        }
        tools.ajaxGet("http://127.0.0.1:8080/gobang/api/talk", msg, function (res) {
            showError("发起平局中，等待对方应答", "ok")
        }, function (res) {
            if (res.status === 20005) {
                showError("对方已离线，待上线后可继续游戏。")
                exit()
            } else {
                showError("请求失败：" + makeString(res.desc))
            }
        })
    }
}

function shu(arg) {
    if (arg === true) {
        showError("对方已认输，您已获胜", "ok")
        exit()
    } else {
        let eleTimeSecEle
        if (myChess === 1) {
            eleTimeSecEle = "timeSecond1"
        } else {
            eleTimeSecEle = "timeSecond3"
        }
        let eleTimeSec = document.getElementById(eleTimeSecEle).innerHTML;
        let msg = {
            'TO': duiUsername,
            'type': 'shu',
            'room': gamingId,
            'Rtime': eleTimeSec,
        }
        tools.ajaxGet("http://127.0.0.1:8080/gobang/api/talk", msg, function (res) {
            showError("您已认输，下次再接再厉！")
            exit()
        }, function (res) {
            if (res.status === 20005) {
                showError("对方已离线，待上线后可继续游戏。")
                exit()
            } else {
                showError("请求失败：" + makeString(res.desc))
            }
        })
    }
}

function hui(arg) {
    if (arg === true) {
        showError("对方同意您悔棋", "ok")
        removeQi(lastx, lasty)
        lastx = -2
        lasty = -2
    } else if (arg === false) {
        showError("对方不同意您悔棋")
    } else {
        if (lasty === -1 || lastx === -1) {
            showError("悔棋失败，您还没有落子过哦")
            return
        }
        if (lasty === -2 || lastx === -2) {
            showError("悔棋失败，您刚刚悔过了哦")
            return
        }
        let msg = {
            'TO': duiUsername,
            'type': 'hui',
            'room': gamingId,
            'x': lastx,
            'y': lasty,
            'Black': myChess,
        }
        tools.ajaxGet("http://127.0.0.1:8080/gobang/api/talk", msg, null, function (res) {
            if (res.status === 20005) {
                showError("对方已离线，待上线后可继续游戏。")
                exit()
            } else {
                showError("请求失败：" + makeString(res.desc))
            }
        })
    }
}

function removeQi(x, y) {
    let chess = document.getElementById("ChessboardTable")
    let hang = chess.getElementsByTagName("tr")
    for (let i = 0; i < 15; i++) {
        if (i + 1 === x) {
            let lie = hang[i].getElementsByTagName("th")
            for (let ii = 0; ii < 15; ii++) {
                if (ii + 1 === y) {
                    let img = lie[ii].getElementsByTagName("img")[0]
                    img.style.display = "none"
                    chessXY[x][y] = 0
                    img.parentNode.classList.remove("chessNoHover")
                }
            }
        }
    }
}

function want(type, x, y) {
    if (type === "ping") {
        document.getElementById("wantTxt").innerHTML = "对方请求平局，是否同意？"
    } else if (type === "hui") {
        document.getElementById("wantTxt").innerHTML = "对方请求悔棋，是否同意？"
        huix = x
        huiy = y
    } else if (type === "shu") {
        shu(true)
        return
    }
    document.getElementsByClassName("container")[11].style.top = "50%"
}

function wantBo(ok) {
    let eleTimeSecEle
    if (myChess === 1) {
        eleTimeSecEle = "timeSecond3"
    } else {
        eleTimeSecEle = "timeSecond1"
    }
    let eleTimeSec = document.getElementById(eleTimeSecEle).innerHTML;
    let msg = {
        'TO': duiUsername,
        'type': '',
        'room': gamingId,
        'x': lastx,
        'y': lasty,
        'Black': myChess,
        'Rtime': eleTimeSec,
    }
    if (document.getElementById("wantTxt").innerHTML.indexOf("平") >= 0) {
        if (ok)
            msg.type = "pingok"
        else
            msg.type = "pingdis"
    } else if (document.getElementById("wantTxt").innerHTML.indexOf("悔") >= 0) {
        if (ok)
            msg.type = "huiok"
        else
            msg.type = "huidis"
    } else {
        document.getElementsByClassName("container")[11].style.top = "50%"
        return
    }
    tools.ajaxGet("http://127.0.0.1:8080/gobang/api/talk", msg, function (res) {
        if (msg.type === "huiok")
            removeQi(huix, huiy)
        else if (msg.type === "pingok") {
            showError("对方同意平局", "ok")
            exit()
        }
        document.getElementsByClassName("container")[11].style.top = "-50%"
    })
}

function exitGaming() {
    document.getElementsByClassName("container")[10].style.top = "-50%"
}

function exit() {
    stop("all")
    showNo(true)
    document.getElementById("leftBar").style.transform = 'translate(0%, -50%)'
    let b = document.getElementById("chessBott")
    document.getElementById("chessBottt").style.display = "block"
    b.style.display = "none"
    b.style.opacity = "0";
    b.style.visibility = "hidden";
    let c = document.getElementById("chessBott2")
    c.style.display = "none"
    c.style.opacity = "0";
    c.style.visibility = "hidden";
    setTimeout(function () {
        document.getElementById("chessBott").style.display = "none";
    }, 300)
    window.onbeforeunload = null
    myChess = 1;
    gamingId = 0;
    watch = 0;
    danTime = 0;
    totalTime = 0;
    rightU = true;
    u1 = undefined;
    u2 = undefined;
    lastx = -1
    lasty = -1
    huix = -1
    huiy = -1
    duiUsername = ""
    video = false
    beix = undefined
}

function watchG(Re, data) {
    if (!Re) {
        let chess = 1
        if (timeT.length >= 0)
            chess = 1
        else
            chess = 2
        let msg = {
            'TO': data.from,
            'type': 'rewatch',
            'room': data.room,
            't1': document.getElementById("timeSecond").innerHTML,
            't2': document.getElementById("timeSecond1").innerHTML,
            't3': document.getElementById("timeSecond2").innerHTML,
            't4': document.getElementById("timeSecond3").innerHTML,
            'chess': chess,
        }
        tools.ajaxGet("http://127.0.0.1:8080/gobang/api/watch", msg)
    } else {
        watch = 1
        stop("all")
        let chess = parseInt(data.chess)
        if (chess === 1) {
            leftDanTime("start", parseInt(data.t1) - 1, "", null, danTime, undefined, undefined, true)
            leftDanTime("start", parseInt(data.t2) - 1, "1", null, totalTime, undefined, undefined, true)
            leftDanTime("start", parseInt(data.t3), "2", null, danTime, undefined, undefined, true)
            leftDanTime("start", parseInt(data.t4), "3", null, totalTime, undefined, undefined, true)
        } else {
            leftDanTime("start", parseInt(data.t1), "", null, danTime, undefined, undefined, true)
            leftDanTime("start", parseInt(data.t2), "1", null, totalTime, undefined, undefined, true)
            leftDanTime("start", parseInt(data.t3) - 1, "2", null, danTime, undefined, undefined, true)
            leftDanTime("start", parseInt(data.t4) - 1, "3", null, totalTime, undefined, undefined, true)
        }
        document.getElementById("noCHess").innerHTML = ""
        if (chess === 1)
            change(false, undefined, false, true)
        else
            change(true, undefined, false, true)
    }
}

let u1Data = []
let u2Data = []

function makeData(data) {
    for (let i = 0; i <= totalTime; i++) {
        u1Data[i] = [];
        for (let j = 0; j <= 2; j++) {
            u1Data[i][j] = -1;
        }
    }
    for (let i = 0; i <= totalTime; i++) {
        u2Data[i] = [];
        for (let j = 0; j <= 2; j++) {
            u2Data[i][j] = -1;
        }
    }
    for (let i = 0; i < data.length; i++) {
        if (data[i].type === "makeQ") {
            if (data[i].Black === "1") {
                u1Data[parseInt(data[i].Rtime)][0] = 1
                u1Data[parseInt(data[i].Rtime)][1] = parseInt(data[i].x)
                u1Data[parseInt(data[i].Rtime)][2] = parseInt(data[i].y)
            } else {
                u2Data[parseInt(data[i].Rtime)][0] = 2
                u2Data[parseInt(data[i].Rtime)][1] = parseInt(data[i].x)
                u2Data[parseInt(data[i].Rtime)][2] = parseInt(data[i].y)
            }
        } else if (data[i].type === "shu") {
            if (data[i].Black === "1")
                u1Data[parseInt(data[i].Rtime)][0] = 3
            else
                u2Data[parseInt(data[i].Rtime)][0] = 3
        } else if (data[i].type === "ping") {
            if (data[i].Black === "1")
                u1Data[parseInt(data[i].Rtime)][0] = 4
            else
                u2Data[parseInt(data[i].Rtime)][0] = 4
        }
    }
}

function runVideo(roomId) {
    video = true
    gamingId = roomId
    document.getElementById("noCHess").innerHTML = ""
    showChessboard()
    let b = document.getElementById("chessBott")
    document.getElementById("chessBottt").style.display = "block"
    b.style.display = "none"
    b.style.opacity = "0";
    b.style.visibility = "hidden";
    cleanChessboard()
    let roomInfo = getRoom(gamingId)
    totalTime = parseInt(roomInfo.totaltime)
    danTime = parseInt(roomInfo.onetime)
    makeData(roomInfo.data)
    u1 = findUserById(roomInfo.userid)
    u2 = findUserById(roomInfo.user2ID)
    makeChessboard(1, u1, u2)

    $("#timeSecond1").bind("DOMNodeInserted", function () {
        let t = parseInt(document.getElementById("timeSecond1").innerHTML)
        if (u1Data[t][0] === 1) {
            makeQi(u1Data[t][1], u1Data[t][2], 1, true)
        } else if (u1Data[t][0] === 3) {
            if (u1.name === getUserName())
                showError("您已认输，下次再接再厉！", "ok")
            else
                showError("对方已认输，您已获胜", "ok")
            exit()
        } else if (u1Data[t][0] === 4) {
            showError("双方同意和局", "ok")
            exit()
        }
    });
    $("#timeSecond3").bind("DOMNodeInserted", function () {
        let t = parseInt(document.getElementById("timeSecond3").innerHTML)
        if (u2Data[t][0] === 2) {
            makeQi(u2Data[t][1], u2Data[t][2], 2, true)
            // change(true,undefined,false,true)
        } else if (u2Data[t][0] === 3) {
            if (u1.name === getUserName())
                showError("您已认输，下次再接再厉！", "ok")
            else
                showError("对方已认输，您已获胜", "ok")
            exit()
        } else if (u2Data[t][0] === 4) {
            showError("双方同意和局", "ok")
            exit()
        }
    });
    setTimeout(function () {
        leftDanTime("start", danTime, "")
        leftDanTime("start", totalTime, "1")
    }, 7000)
}

function setBei(a) {
    beix = a
    let leftT = false
    if (timeT.length > 0)
        leftT = true
    stop("all")
    if (leftT) {
        leftDanTime("start", danTime, "", beix, null, false, true)
        leftDanTime("start", null, "1", beix, null, false, true)
    } else {
        leftDanTime("start", danTime, "2", beix, null, false, true)
        leftDanTime("start", null, "3", beix, null, false, true)
    }
}

let zanT = false

function zan(a) {
    let bot = document.getElementById("chessBott2").getElementsByClassName("chessBo")[0]
    if (a === "暂停") {
        if (timeT.length > 0)
            zanT = true
        else
            zanT = false
        bot.innerHTML = "开始"
        stop("all")
    }
    if (a === "开始") {
        if (zanT) {
            leftDanTime("start", danTime, "", beix, null, false, true)
            leftDanTime("start", null, "1", beix, null, false, true)
        } else {
            leftDanTime("start", danTime, "2", beix, null, false, true)
            leftDanTime("start", null, "3", beix, null, false, true)
        }
        bot.innerHTML = "暂停"
    }
}

function bei(a) {
    let bot = document.getElementById("chessBott2").getElementsByClassName("chessBo")[1]
    if (a === "1X") {
        setBei(2)
        bot.innerHTML = "2X"
    } else if (a === "2X") {
        setBei(4)
        bot.innerHTML = "4X"
    } else if (a === "4X") {
        setBei(8)
        bot.innerHTML = "8X"
    } else if (a === "8X") {
        setBei(0.5)
        bot.innerHTML = "0.5X"
    } else if (a === "0.5X") {
        setBei(1)
        bot.innerHTML = "1X"
    }
}