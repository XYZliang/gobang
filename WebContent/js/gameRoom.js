let RoomType;
let RoomDiv=0
function openRoom(type,open) {
    if (!debug) {
        if (!checkLogin()) {
            showError("请先登录！")
            return;
        }
    }
    if(type!==undefined)
        RoomType=type
    else
        RoomType="normal"
    if(RoomDiv===0){
        document.getElementsByClassName("container")[6].style.top = "50%"
        RoomDiv=open
        getInfos(true)
        return;
    }
    else if(RoomDiv===open)
    {
        RoomDiv=0
        document.getElementsByClassName("container")[6].style.top = "-50%"
    }
    else{
        RoomDiv=open
        document.getElementsByClassName("container")[6].style.top = "-50%"
        setTimeout(function () {
            document.getElementsByClassName("container")[6].style.top = "50%"
            getInfos(true)

        },400)
    }
    //
    // else{
    //     document.getElementsByClassName("container")[6].style.top = "50%"
    // }
    // if (document.getElementsByClassName("container")[6].style.top !== "50%") {
    //     getInfos(true)
    //     document.getElementsByClassName("container")[6].style.top = "50%"
    // } else {
    //     document.getElementsByClassName("container")[6].style.top = "-50%"
    // }
}

function openRoom2(update) {

    let id = findUserByUsername(getUserName()).id
    let info = {
        "type": RoomType,
        "id": id,
    }
    tools.ajaxGet("http://127.0.0.1:8080/gobang/api/getMyGame", info, function (res) {
        if (res.status !== 0) {
            showError("请求失败：" + makeString(res.desc))
            return
        }
        localStorage.setItem(utf8_to_b64("房间数据"), utf8_to_b64(JSON.stringify(res.data)));
        if (update === true) {
            return;
        }
        else{
            document.getElementsByClassName("container")[6].style.top = "50%"
        }
        let roomDiv = document.getElementsByClassName("roomDiv")
        for (let i = roomDiv.length - 2; i >= 0; i--) {
            roomDiv[i].parentNode.removeChild(roomDiv[i])
        }
        let data = res.data
        for (let i = 0; i < data.length; i++) {
            if (data[i].user2ID === 0) {
                addNewRoom(getUserName(), data[i].onetime, data[i].totaltime, data[i].id, false, true)
            } else {
                // addNewRoom(getUserName(), data[i].onetime, data[i].totaltime, data[i].id)
                // newRoomAdd(data[i].user2ID, data[i].id)
                if (data[i].userid === findUserByUsername(getUserName()).id)
                    addNewRoom(findUserById(data[i].userid).name, data[i].onetime, data[i].totaltime, data[i].id, findUserById(data[i].user2ID).name, true)
                else if (data[i].user2ID === findUserByUsername(getUserName()).id)
                    addNewRoom(findUserById(data[i].userid).name, data[i].onetime, data[i].totaltime, data[i].id, findUserById(data[i].user2ID).name, false)
                else
                    addNewRoom(findUserById(data[i].userid).name, data[i].onetime, data[i].totaltime, data[i].id, findUserById(data[i].user2ID).name, "guankan")
            }
        }
    }, function (res) {
        showError("服务器异常" + res)
    })
}

function findUserByUsername(userName) {
    let UsersJsonString = localStorage.getItem(utf8_to_b64("所有用户"));
    let users = JSON.parse(b64_to_utf8(UsersJsonString));
    for (let i = 0; i < users.length; i++) {
        if (userName === users[i].name) {
            let user = {
                "id": users[i].id,
                "admin": users[i].isadmin,
                "level": users[i].level,
                "name": users[i].name,
                "nickname": users[i].nickname,
                "sex": users[i].sex,
                "times": users[i].times,
                "wintimes": users[i].wintimes
            }
            return user
        }
    }
    return null
}

function findUserById(id) {
    let UsersJsonString = localStorage.getItem(utf8_to_b64("所有用户"));
    let users = JSON.parse(b64_to_utf8(UsersJsonString));
    for (let i = 0; i < users.length; i++) {
        if (id === users[i].id) {
            let user = {
                "id": users[i].id,
                "admin": users[i].isadmin,
                "level": users[i].level,
                "name": users[i].name,
                "nickname": users[i].nickname,
                "sex": users[i].sex,
                "times": users[i].times,
                "wintimes": users[i].wintimes
            }
            return user
        }
    }
    return null
}

function addNewRoom(userName1, dan, total, id, userName2, fangzhu) {
    if (userName1 === null) {
        userName1 = getUserName()
    }
    let user2
    if (userName2 !== undefined) {
        user2 = findUserByUsername(userName2)
    }
    let user1 = findUserByUsername(userName1)
    let newRoomDiv = document.getElementById('newRoom')
    let newRoom = document.createElement("div");
    newRoom.setAttribute("class", "roomDiv");
    newRoom.innerHTML = "<div class=\"gameInfo\">\n" +
        "                <div class=\"gameID\" style=\"display: none\"></div>\n" +
        "                <div class=\"gameHead gameHeadLeft\">\n" +
        "                    <img src=\"images/headIcons/" + user1.name + ".png\" onerror=\"javascript:this.src='images/system/defaultHead.png';\">" +
        "                    <div class=\"gameInfoA\" title=\"性别\">\n" +
        "                        <img alt=\"男\" class=\"gameInfoAB\" src=\"images/system/boyIcon.png\"\n" +
        "                             style=\"display: block;width: 20px;height: 20px;\">\n" +
        "                        <img alt=\"女\" class=\"gameInfoAG\" src=\"images/system/girlIcon.png\"\n" +
        "                             style=\"display: none;width: 20px;height: 20px;\">\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "                <div class=\"gameInfoTime\">\n" +
        "                    <p class=\"danTime\">\n" + dan +
        "                    </p>\n" +
        "                    <p class=\"totalTime\">\n" + total +
        "                    </p>\n" +
        "                </div>\n" +
        "                <div class=\"gameHead gameHeadRight\">\n" +
        "                    <img class=\"gameHeadImg\" src=\"images/system/noUserHead.png\" onerror=\"javascript:this.src='images/system/defaultHead.png';\">\n" +
        "                    <div class=\"gameInfoA gameInfoARight\" title=\"性别\" style=\"display: none;\">\n" +
        "                        <img alt=\"男\" class=\"gameInfoAB\" src=\"images/system/boyIcon.png\"\n" +
        "                             style=\"display: none;\">\n" +
        "                        <img alt=\"女\" class=\"gameInfoAG\" src=\"images/system/girlIcon.png\"\n" +
        "                             style=\"display: none;\">\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "            <div class=\"gameInfo2\">\n" +
        "                <div class=\"UserInfo\">\n" +
        "                    <div class=\"gameStarts\" title=\"等级\"></div>\n" +
        "                    <p class=\"gameNickname\" title=\"昵称\">" + user1.nickname + "</p>\n" +
        "                </div>\n" +
        "                <div class=\"gameButton\">\n" +
        "                    <div class=\"gameButton1\" onclick='yaoqing(this.parentNode.parentNode.parentNode.getElementsByClassName(\"gameID\")[0].innerHTML,this.innerHTML)'>\n" +
        "                        邀\n" +
        "                    </div>\n" +
        "                    <div class=\"gameButton2\" onclick='runGame(this.parentNode.parentNode.parentNode.getElementsByClassName(\"gameID\")[0].innerHTML,0)'>\n" +
        "                        开\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "                <div class=\"UserInfo UserInfoRight\">\n" +
        "                    <div class=\"gameStarts\" title=\"等级\" style=\"display: none\"></div>\n" +
        "                    <p class=\"gameNickname\" title=\"昵称\"></p>\n" +
        "                </div>\n" +
        "            </div>"
    if(RoomType==="normal"){
        document.getElementById("newRoom").style.display="none"
    }
    else
        document.getElementById("newRoom").style.display="block"
    let roomDivNum = newRoomDiv.parentElement.children.length
    newRoomDiv.parentNode.insertBefore(newRoom, newRoomDiv)
    let nowRoomDiv = newRoomDiv.parentElement.children[roomDivNum - 1]
    let b = nowRoomDiv.getElementsByClassName('gameButton2')[0]
    b.style.opacity = "0";
    b.style.visibility = "hidden";
    b.style.width = "0px";
    nowRoomDiv.getElementsByClassName('gameID')[0].innerHTML = id
    let Linfo = nowRoomDiv.getElementsByClassName("gameInfo2")[0]
    Linfo = Linfo.getElementsByClassName("UserInfo")[0]
    let start = Linfo.getElementsByClassName("gameStarts")[0]
    start.style.display = ""
    let startList = ["startsZer", "startsOne", "startsTwo", "startsThr", "startsFou", "startsFiv"]
    start.classList.add(startList[user1.level])
    // let img=newRoomDiv.get
    // ElementsByTagName("img")
    // for(let i=0;i<img.length;i++)
    // {
    //     img[i].addEventListener("error",function () {
    //         this.src='images/system/defaultHead.png'
    //     })
    // }
    if (user2 !== undefined && user2 !== null) {
        newRoomAdd(user2.id, id, null, fangzhu)
    }
}

function makeNewRoom() {
    let game = {
        'Dan': noTuiGe(Dan.value),
        'Total': noTuiGe(Total.value)
    }
    tools.ajaxGet("http://127.0.0.1:8080/gobang/api/makeNewGame", game, function (res) {
        if (res.status === 0) {
            addNewRoom(getUserName(), noTuiGe(Dan.value), noTuiGe(Total.value), res.data.id)
            document.getElementsByClassName('container')[7].style.top = '-50%'
            showError("创建成功！", "ok")
        } else {
            showError("创建失败" + makeString(res.desc) + makeString(res.data))
        }
    }, function (res) {
        showError("系统异常！" + makeString(res.desc) + makeString(res.data))
        adminDo = false
    })
}

function newRoomAdd(userId, roomId, Be, fangzhu) {
    let newUser = findUserById(userId)
    let room = document.getElementsByClassName("roomDiv")
    let roomNum = room.length
    let roomDiv = null
    if (roomId === null || roomId === undefined)
        roomDiv = room[roomNum - 2]
    else {
        for (let i = 0; i < room.length - 1; i++) {
            if (room[i].getElementsByClassName("gameID")[0].innerHTML == roomId) {
                roomDiv = room[i]
                break
            }
        }
    }
    if (roomDiv === null) {
        showError("系统错误！游戏房间不存在!")
    }
    let head = roomDiv.getElementsByClassName("gameHeadImg")[0]
    // head.onerror=function () {
    //     let perImg = document.getElementById("perImg")
    //     perImg.src = "images/system/defaultHead.png"
    // }
    head.src = "images/headIcons/" + newUser.name + ".png"
    let sex = roomDiv.getElementsByClassName("gameInfoARight")[0]
    sex.style.display = ""
    if (newUser.sex === 1) {
        sex.getElementsByClassName("gameInfoAB")[0].style.display = ""
    } else {
        sex.getElementsByClassName("gameInfoAG")[0].style.display = ""
    }
    let Rinfo = roomDiv.getElementsByClassName("gameInfo2")[0]
    Rinfo = Rinfo.getElementsByClassName("UserInfoRight")[0]
    let start = Rinfo.getElementsByClassName("gameStarts")[0]
    start.style.display = ""
    let startList = ["startsZer", "startsOne", "startsTwo", "startsThr", "startsFou", "startsFiv"]
    start.classList.add(startList[newUser.level])
    let nick = Rinfo.getElementsByClassName("gameNickname")[0]
    nick.innerHTML = newUser.nickname
    let gameButton2 = roomDiv.getElementsByClassName("gameButton2")[0]
    if(RoomType==="guan" || RoomType==="lu"){
        let gameButton1 = roomDiv.getElementsByClassName("gameButton1")[0]
        gameButton1.style.display = "block"
        if(RoomType==="guan")
            gameButton1.innerHTML = "观"
        else
            gameButton1.innerHTML = "看"
        return
    }
    if (fangzhu === null || fangzhu === undefined) {
        if (newUser.name === getUserName())
            fangzhu = false
    }
    if (fangzhu === true) {
        gameButton2.style.opacity = "unset"
        gameButton2.style.visibility = "unset"
        gameButton2.style.width = "40px"
    }
    if (fangzhu === "guankan") {
        gameButton2.style.opacity = "unset"
        gameButton2.style.visibility = "unset"
        gameButton2.style.width = "40px"
        gameButton2.innerHTML = "观"
    }
    let gameButton1 = roomDiv.getElementsByClassName("gameButton1")[0]
    let roomOwner = getRoom(roomId)
    let roomOwnerId = roomOwner.userid

    if (findUserById(roomOwnerId).name === getUserName() || Be === false) {
        gameButton1.innerHTML = "踢"
        // gameButton1.style.opacity = "0"
        // gameButton1.style.visibility = "hidden"
        // gameButton1.style.width = "0px"
    } else {
        gameButton1.innerHTML = "退"
    }
}

function newRoomT(roomId, exit, Texit) {
    if (exit === undefined)
        exit = false
    let room = document.getElementsByClassName("roomDiv")
    let roomNum = room.length
    let roomDiv = null
    if (roomId === null || roomId === undefined)
        roomDiv = room[roomNum - 2]
    else {
        for (let i = 0; i < room.length - 1; i++) {
            if (room[i].getElementsByClassName("gameID")[0].innerHTML == roomId) {
                roomDiv = room[i]
            }
        }
    }
    if (roomDiv === null) {
        showError("系统错误！游戏房间不存在!")
    }
    if (Texit === true) {
        let head = roomDiv.getElementsByClassName("gameHeadImg")[0]
        // head.onerror=function () {
        //     let perImg = document.getElementById("perImg")
        //     perImg.src = "images/system/defaultHead.png"
        // }
        head.src = "images/system/noUserHead.png"
        let sex = roomDiv.getElementsByClassName("gameInfoARight")[0]
        sex.style.display = "none"
        sex.getElementsByClassName("gameInfoAB")[0].style.display = "none"
        sex.getElementsByClassName("gameInfoAG")[0].style.display = "none"
        let Rinfo = roomDiv.getElementsByClassName("gameInfo2")[0]
        Rinfo = Rinfo.getElementsByClassName("UserInfoRight")[0]
        let start = Rinfo.getElementsByClassName("gameStarts")[0]
        start.style.display = "none"
        let nick = Rinfo.getElementsByClassName("gameNickname")[0]
        nick.innerHTML = ""
        let gameButton2 = roomDiv.getElementsByClassName("gameButton2")[0]
        gameButton2.style.opacity = "0"
        gameButton2.style.visibility = "hidden"
        gameButton2.style.width = "0"
        roomDiv.getElementsByClassName("gameButton1")[0].innerHTML = "邀"
        showError("对方离开了房间", "ok")
        return
    }
    if (exit !== true) {
        let room = getRoom(roomId)
        let to = findUserById(room.user2ID).name
        let msg = {
            'TO': to,
            'type': 'ti',
            'room': room.id,
        }
        tools.ajaxGet("http://127.0.0.1:8080/gobang/api/talk", msg, function (res) {
            let head = roomDiv.getElementsByClassName("gameHeadImg")[0]
            // head.onerror=function () {
            //     let perImg = document.getElementById("perImg")
            //     perImg.src = "images/system/defaultHead.png"
            // }
            head.src = "images/system/noUserHead.png"
            let sex = roomDiv.getElementsByClassName("gameInfoARight")[0]
            sex.style.display = "none"
            sex.getElementsByClassName("gameInfoAB")[0].style.display = "none"
            sex.getElementsByClassName("gameInfoAG")[0].style.display = "none"
            let Rinfo = roomDiv.getElementsByClassName("gameInfo2")[0]
            Rinfo = Rinfo.getElementsByClassName("UserInfoRight")[0]
            let start = Rinfo.getElementsByClassName("gameStarts")[0]
            start.style.display = "none"
            let nick = Rinfo.getElementsByClassName("gameNickname")[0]
            nick.innerHTML = ""
            let gameButton2 = roomDiv.getElementsByClassName("gameButton2")[0]
            gameButton2.style.opacity = "0"
            gameButton2.style.visibility = "hidden"
            gameButton2.style.width = "0"
            roomDiv.getElementsByClassName("gameButton1")[0].innerHTML = "邀"
            showError("踢出成功！", "ok")
        }, function (res) {
            if (res.status !== 0) {
                showError("发送失败：" + makeString(res.desc))
                return
            }
        })
    } else {
        let room = getRoom(roomId)
        let to = findUserById(room.userid).name
        let msg = {
            'TO': to,
            'type': 'exit',
            'room': room.id,
        }
        tools.ajaxGet("http://127.0.0.1:8080/gobang/api/talk", msg, function (res) {
            let room = document.getElementsByClassName("roomDiv")
            let roomNum = room.length
            let roomDiv = null
            if (roomId === null || roomId === undefined)
                roomDiv = room[roomNum - 2]
            else {
                for (let i = 0; i < room.length - 1; i++) {
                    if (room[i].getElementsByClassName("gameID")[0].innerHTML == roomId) {
                        roomDiv = room[i]
                        break
                    }
                }
            }
            roomDiv.parentNode.removeChild(roomDiv)
            showError("退出成功！", "ok")
        }, function (res) {
            if (res.status !== 0) {
                showError("退出失败：" + makeString(res.desc))
                return
            }
        })

    }
}

function yaoqing(roomID, word) {
    if (word.indexOf("邀") >= 0) {
        tools.ajaxGet("http://127.0.0.1:8080/gobang/api/OLuser", null, function (res) {
            if (res.status !== 0) {
                showError("请求拒绝：" + makeString(res.desc))
                return
            }
            openYQ(res.data, roomID)
        }, function (res) {
            showError("服务器异常" + res)
        })
    } else if (word.indexOf("踢") >= 0) {
        newRoomT(roomID)
    } else if (word.indexOf("退") >= 0) {
        newRoomT(roomID, true)
    }
    else if (word.indexOf("观") >= 0) {
        runGame(roomID,1)
    }
    else if (word.indexOf("看") >= 0) {
        runGame(roomID,2)
    }
}

function openYQ(data, roomid) {
    if (document.getElementsByClassName("container")[8].style.top !== "50%") {
        let userList = document.getElementsByClassName("ManInfo")
        for (let i = userList.length - 1; i >= 0; i--) {
            userList[i].parentNode.removeChild(userList[i])
        }

        let datas = data.split(";")
        if (datas.length <= 0) {
            document.getElementById('yaoqingDiv').style.display = "none"
            document.getElementById('noOL').style.display = "block"
        } else {
            if (datas[0].length > 0) {
                document.getElementById('yaoqingDiv').style.display = "block"
                document.getElementById('noOL').style.display = "none"
                for (let i = 0; i < datas.length; i++) {
                    if (datas[i].name !== getUserName())
                        addOLuser(findUserByUsername(datas[i]), i, roomid)
                }
            } else {
                document.getElementById('yaoqingDiv').style.display = "none"
                document.getElementById('noOL').style.display = "block"
            }
        }
        document.getElementsByClassName("container")[8].style.top = "50%"
    } else {
        document.getElementsByClassName("container")[8].style.top = "-50%"
    }
}

function addOLuser(user, now, roomid) {
    let botton = document.getElementById("YQTableButton");
    let person = document.createElement("tr");
    if (now % 2 === 1)
        person.setAttribute("class", "ManInfo ManColorB");
    else
        person.setAttribute("class", "ManInfo ManColor");
    person.innerHTML += "<th>" + "<img src=\"images/headIcons/" + user.name + ".png\" onerror=\"javascript:this.src='images/system/defaultHead.png';\">" + "</th>"
    person.innerHTML += "<th  style=\"display: none\">" + user.name + "</th>"
    person.innerHTML += "<th>" + user.nickname + "</th>"
    person.innerHTML += "<th>" + "<input type=\"button\" value=\"邀请用户\" title=\"邀请用户\" onclick=\"sendYQ(\'" + user.name + "\',\'" + roomid + "\')\">" + "</th>"
    botton.parentNode.insertBefore(person, botton)
}

function sendYQ(user, room) {
    if (websocket.readyState === websocket.OPEN) {
        let msg = {
            'TO': user,
            'type': 'try',
            'room': room,
        }
        tools.ajaxGet("http://127.0.0.1:8080/gobang/api/talk", msg, function (res) {
            if (res.status !== 0) {
                showError("发送失败：" + makeString(res.desc))
                return
            }
            showError("成功邀请，请等待对方回应！", "ok")
            document.getElementsByClassName("container")[8].style.top = "-50%"
        }, function (res) {
            showError("服务器异常" + res)
        })
    } else {
        showError("服务器异常")
    }
}

function getYQ(data) {
    document.getElementsByClassName("container")[9].style.top = "50%"
    document.getElementById("YQFrom").innerHTML = data.from
    document.getElementById("YQTxtx").innerHTML = data.from + "邀请您加入游戏"
    document.getElementById("YQID").innerHTML = data.room
}

function agreeGame(Re, username, room) {
    if (room === undefined)
        room = document.getElementById("YQID").innerHTML
    if (Re === true || Re === undefined) {
        if (username == null) {
            username = document.getElementById("YQFrom").innerHTML
        }
        let id = findUserByUsername(getUserName()).id
        let user = findUserByUsername(username)
        let msg = {
            'TO': user.name,
            'type': 'agree',
            'room': room,
            'myid': id,
        }
        tools.ajaxGet("http://127.0.0.1:8080/gobang/api/talk", msg, function (res) {
            document.getElementsByClassName("container")[9].style.top = "-50%"
            if (res.status !== 0) {
                showError("发送失败：" + makeString(res.desc))
                return
            }
            RoomType='normal'
            openRoom2()
        }, function (res) {
            showError("服务器异常" + res)
            document.getElementsByClassName("container")[9].style.top = "-50%"
        })
    } else {
        showError("对方已接受邀请！", "ok")
        RoomType='normal'
        openRoom2()
    }
}

function disagree(get) {
    if (get === true) {
        showError("对方已拒绝邀请")
        return
    }
    document.getElementsByClassName('container')[9].style.top = '-50%'
    let username = document.getElementById("YQFrom").innerHTML
    let user = findUserByUsername(username)
    let msg = {
        'TO': user.name,
        'type': 'disagree',
    }
    tools.ajaxGet("http://127.0.0.1:8080/gobang/api/talk", msg, null, null)
}

function getRoom(roomId) {
    let JsonString = b64_to_utf8(localStorage.getItem(utf8_to_b64("房间数据")))
    let rooms = JSON.parse(JsonString);
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].id == roomId) {
            let room = {
                "id": rooms[i].id,
                "userid": rooms[i].userid,
                "user2ID": rooms[i].user2ID,
                "data": rooms[i].data,
                "onetime": rooms[i].onetime,
                "status": rooms[i].status,
                "totaltime": rooms[i].totaltime,
            }
            return room
        }
    }
    return null
}

function BeT(roomId) {
    let room = document.getElementsByClassName("roomDiv")
    let roomNum = room.length
    let roomDiv = null
    if (roomId === null || roomId === undefined)
        roomDiv = room[roomNum - 2]
    else {
        for (let i = 0; i < room.length - 1; i++) {
            if (room[i].getElementsByClassName("gameID")[0].innerHTML == roomId) {
                roomDiv = room[i]
                break
            }
        }
    }
    if (roomDiv === null) {
        showError("被踢错误！游戏房间不存在!")
        return
    }
    roomDiv.parentNode.removeChild(roomDiv)
    showError("您已被房主请出房间")
}

function runGame(roomId,type) {
    gamingId = parseInt(roomId)
    let room = getRoom(roomId)
    let nowUser = findUserByUsername(getUserName())
    let user1, user2
    if(type===0) {
        if (room.userid === nowUser.id) {
            myChess = 1
            watch = 0
            user1 = nowUser
            user2 = findUserById(room.user2ID)
            let msg = {
                'TO': user2.name,
                'type': 'openG',
                'room': roomId,
            }
            tools.ajaxGet("http://127.0.0.1:8080/gobang/api/talk", msg, function (res) {
                document.getElementsByClassName("container")[9].style.top = "-50%"
                go()
            }, function (res) {
                if (res.status !== 0) {
                    showError("开始游戏失败：" + makeString(res.desc))
                }
            })
        } else if (room.user2ID === nowUser.id) {
            user2 = nowUser
            user1 = findUserById(room.userid)
            myChess = 2
            watch = 0
            go()
        } else {
            watch = 1
            go()
        }
    }
    else{
        user1 = findUserById(room.userid)
        user2 = findUserById(room.user2ID)
        myChess = 1
        watch=type
        go()
    }

    function go() {
        danTime = room.onetime
        totalTime = room.totaltime
        makeChessboard(myChess, user1, user2)
        showChessboard()
    }
}

function goGame(user, roomId) {

}