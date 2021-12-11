let chessXY = [];
let myChess = 1;
let gamingId = 0;
let watch = 0;
let danTime = 0;
let totalTime = 0;
let rightU = true;

function showChessboard() {
    if (document.getElementsByClassName("container")[10].style.top !== "50%") {
        document.getElementsByClassName("container")[10].style.top = "50%"
        document.getElementById("leftBar").style.transform = "translate(-100%,-50%)"
        document.getElementsByClassName("container")[6].style.top = "150%"
    } else {
        document.getElementsByClassName("container")[10].style.top = "-50%"
        document.getElementById("leftBar").style.transform = "translateY(-50%)"
        document.getElementsByClassName("container")[6].style.top = "50%"
        cleanChessboard()
    }
}

function makeChessboard(Black, user1, user2) {
    document.getElementById("noCHess").style.display = "block"
    document.getElementById("noCHess").style.backgroundColor = "rgba(255,255,255,0.3)"
    let startList = ["startsZer", "startsOne", "startsTwo", "startsThr", "startsFou", "startsFiv"]
    document.getElementById("leftBox").getElementsByClassName("gameNickname")[0].innerHTML = user1.nickname
    document.getElementById("leftBox").getElementsByClassName("gameStarts")[0].classList.add(startList[user1.level])
    document.getElementById("leftBox").getElementsByClassName("gameHeadImg")[0].src="images/headIcons/" + user1.name + ".png"
    document.getElementById("leftBox").getElementsByClassName("gameHeadImg")[0].onerror=function () {
        let perImg = document.getElementById("leftBox").getElementsByClassName("gameHeadImg")[0]
        perImg.src = "images/system/defaultHead.png"
    }
    document.getElementById("rightBox").getElementsByClassName("gameNickname")[0].innerHTML = user2.nickname
    document.getElementById("rightBox").getElementsByClassName("gameStarts")[0].classList.add(startList[user2.level])
    document.getElementById("rightBox").getElementsByClassName("gameHeadImg")[0].src="images/headIcons/" + user2.name + ".png"
    document.getElementById("rightBox").getElementsByClassName("gameHeadImg")[0].onerror=function () {
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
//运行的模式 需要开始的秒数（默认10） 运行的计时器（默认第一个） 倍速（默认1） 总秒数（默认time）
    leftDanTime("start", danTime, "", null, null, true)
    leftDanTime("start", totalTime, "1", null, null, true)
    leftDanTime("start", danTime, "2", null, null, true)
    leftDanTime("start", totalTime, "3", null, null, true)
    stop("all")
    startChess()
}

// makeChessboard(1)
function makeQi(x, y, Black) {
    let chess = document.getElementById("ChessboardTable")
    let hang = chess.getElementsByTagName("tr")
    for (let i = 0; i < 15; i++) {
        if (i + 1 === x) {
            let lie = hang[i].getElementsByTagName("th")
            for (let ii = 0; ii < 15; ii++) {
                if (ii + 1 === y) {
                    let img = lie[ii].getElementsByTagName("img")[0]
                    if (img.style.display !== "block") {
                        if (Black === 1) {
                            img.src = "images/system/chessB.png"
                            chessXY[x][y] = 1
                        } else {
                            img.src = "images/system/chessW.png"
                            chessXY[x][y] = 1
                        }
                        img.style.display = "block"
                        img.parentNode.classList.add("chessNoHover")
                    }
                    if (Black === 1)
                        change(true)
                    else
                        change(false)
                    checkWin()
                    return
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
function leftDanTime(fun, time, no, bei, total, ready, cont) {
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
                if (no == "2")
                    change(false,true)
                else
                    change(true,true)
                clearInterval(timerTimeCount);
                timerTimeCount = null;
            }
        };
        a();
        stop(no)
        bei = bei || 1
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

function checkWin() {
    function isChess(a) {
        if (a != 0)
            return 1
        else
            return 0
    }

    for (let i = 0; i <= 15; i++) {
        for (let j = 0; j <= 15; j++) {
            if (i + 4 > 15 || j + 4 > 15)
                continue
            if (isChess(chessXY[i][j]) * isChess(chessXY[i][j + 1]) * isChess(chessXY[i][j + 2]) * isChess(chessXY[i][j + 3]) * isChess(chessXY[i][j + 4]) === 1 || isChess(chessXY[i][j]) * isChess(chessXY[i + 1][j + 1]) * isChess(chessXY[i + 2][j + 2]) * isChess(chessXY[i + 3][j + 3]) * isChess(chessXY[i + 4][j + 4]) === 1) {
                stop("all")
                if (chessXY[i][j] === 2) {
                    showError("玩家" + findUserById(getRoom(gamingId).user2ID).nickname + "获胜！", "ok")
                } else {
                    showError("玩家" + findUserById(getRoom(gamingId).userid).nickname + "获胜！", "ok")
                }
                showNo(true)
            }
        }
    }
}

function startChess() {
    let t = 5
    let a = setInterval(function () {
        if (a === null || a === undefined)
            return
        if (t < 0) {
            //运行的模式 需要开始的秒数（默认10） 运行的计时器（默认第一个） 倍速（默认1） 总秒数（默认time）
            leftDanTime("start", danTime, "")
            leftDanTime("start", totalTime, "1")
            if (myChess === 1) {
                showNo()
            }
            clearInterval(a)
            a = null
            document.getElementById("noCHess").innerHTML = ""
            return;
        }
        document.getElementById("noCHess").innerHTML = t
        t--
    }, 1000)
}

function showNo(no) {
    let a = document.getElementById("noCHess")
    if (a.style.display !== "block" || no === true) {
        a.style.display = "block"
        if (no === true) {
            setTimeout(function () {
                a.style.backgroundColor = "rgba(255,255,255,0)"
            }, 10)
        } else {
            setTimeout(function () {
                a.style.backgroundColor = "rgba(255,255,255,0.3)"
            }, 10)
        }
    } else {
        a.style.backgroundColor = "rgba(255,255,255,0)"
        setTimeout(function () {
            a.style.display = "none"
        }, 300)
    }
}

function change(ToR,OutTime) {
    // if (no == "1" || no == "3") {
    //     let eleTimeSecEle1 = "timeSecond" + no
    //     let eleTimeSec1 = document.getElementById(eleTimeSecEle1)
    //     eleTimeSec1.innerHTML = (parseInt(eleTimeSec1.innerHTML) - 1).toString()
    // }
    if (ToR) {
        if(OutTime) {
            let eleTimeSecEle1 = "timeSecond" + "1"
            let eleTimeSec1 = document.getElementById(eleTimeSecEle1)
            eleTimeSec1.innerHTML = (parseInt(eleTimeSec1.innerHTML) - 1).toString()
            // leftDanTime("start",danTime,"",null,null,0,false)
        }
        stop("")
        stop("1")
        leftDanTime("start", danTime, "2", null, null, false, false)
        leftDanTime("start", null, "3", null, null, false, true)
        showNo()
    } else {
        if(OutTime) {
            let eleTimeSecEle1 = "timeSecond" + "3"
            let eleTimeSec1 = document.getElementById(eleTimeSecEle1)
            eleTimeSec1.innerHTML = (parseInt(eleTimeSec1.innerHTML) - 1).toString()
            // leftDanTime("start",danTime,"2",null,null,0,false)
        }
        stop("2")
        stop("3")
        leftDanTime("start", danTime, "", null, null, false, false)
        leftDanTime("start", null, "1", null, null, false, true)
        showNo()
    }
}