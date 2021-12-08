function openRoom() {
    if (!debug) {
        if (!checkLogin()) {
            showError("请先登录！")
            return;
        }
    }
    if (document.getElementsByClassName("container")[6].style.top !== "50%") {
        getInfos(true)
    } else {
        document.getElementsByClassName("container")[6].style.top = "-50%"
    }
}

function openRoom2() {
    document.getElementsByClassName("container")[6].style.top = "50%"
    let id = findUserByUsername(getUserName()).id
    let info = {
        "id": id,
    }
    tools.ajaxGet("http://127.0.0.1:8080/gobang/api/getMyGame", info, function (res) {
        if (res.status !== 0) {
            showError("请求失败：" + makeString(res.desc))
            return
        }
        let roomDiv = document.getElementsByClassName("roomDiv")
        for (let i = roomDiv.length - 2; i >= 0; i--) {
            roomDiv[i].parentNode.removeChild(roomDiv[i])
        }
        let data = res.data
        for (let i = 0; i < data.length; i++) {
            if (data[i].user2ID === 0) {
                addNewRoom(getUserName(), data[i].onetime, data[i].totaltime, data[i].id)
            }
            // else{
            //
            // }
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

function addNewRoom(userName1, dan, total, id) {
    if (userName1 === null) {
        userName1 = getUserName()
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
        "                    <div class=\"gameButton2\">\n" +
        "                        开\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "                <div class=\"UserInfo UserInfoRight\">\n" +
        "                    <div class=\"gameStarts\" title=\"等级\" style=\"display: none\"></div>\n" +
        "                    <p class=\"gameNickname\" title=\"昵称\"></p>\n" +
        "                </div>\n" +
        "            </div>"
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
            msg("创建成功！", "ok")
        } else {
            showError("创建失败" + makeString(res.desc) + makeString(res.data))
        }
    }, function (res) {
        showError("系统异常！" + makeString(res.desc) + makeString(res.data))
        adminDo = false
    })
}

function newRoomAdd(userId, roomId) {
    let newUser = findUserById(userId)
    let room = document.getElementsByClassName("roomDiv")
    let roomNum = room.length
    let roomDiv = null
    if (roomId === null || roomId === undefined)
        roomDiv = room[roomNum - 2]
    else {
        for (let i = 0; i < room.length; i++) {
            if (room[i].getElementsByClassName("gameID")[0].innerHTML == roomId) {
                roomDiv = room[i]
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
    gameButton2.style.opacity = "unset"
    gameButton2.style.visibility = "unset"
    gameButton2.style.width = "40px"
    roomDiv.getElementsByClassName("gameButton1")[0].innerHTML = "踢"
}

function newRoomT(roomId) {
    let room = document.getElementsByClassName("roomDiv")
    let roomNum = room.length
    let roomDiv = null
    if (roomId === null || roomId === undefined)
        roomDiv = room[roomNum - 2]
    else {
        for (let i = 0; i < room.length; i++) {
            if (room[i].getElementsByClassName("gameID")[0].innerHTML == roomId) {
                roomDiv = room[i]
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
}

function yaoqing(roomID, word) {
    if (word.indexOf("邀") >= 0) {
        tools.ajaxGet("http://127.0.0.1:8080/gobang/api/OLuser",null, function (res) {
            if (res.status !== 0) {
                showError("请求拒绝：" + makeString(res.desc))
                return
            }
            openYQ(res.data)
        }, function (res) {
            showError("服务器异常" + res)
        })
    }
}

function openYQ(data) {
    if (document.getElementsByClassName("container")[8].style.top !== "50%") {
        let userList = document.getElementsByClassName("ManInfo")
        for (let i = userList.length - 1; i >= 0; i--) {
            userList[i].parentNode.removeChild(userList[i])
        }

        let datas=data.split(";")
        if(datas.length===1){
            document.getElementById('yaoqingDiv').style.display = "none"
            document.getElementById('noOL').style.display = "block"
        }
        else{
            document.getElementById('yaoqingDiv').style.display = "block"
            document.getElementById('noOL').style.display = "none"
        }
        for(let i=0;i<datas.length; i++){
            if(data[i].name!==getUserName())
                addOLuser(findUserByUsername(datas[i],i))
        }
        document.getElementsByClassName("container")[8].style.top = "50%"
    } else {
        document.getElementsByClassName("container")[8].style.top = "-50%"
    }
}

function addOLuser(user, now) {
    let botton = document.getElementById("YQTableButton");
    let person = document.createElement("tr");
    if (now % 2 === 1)
        person.setAttribute("class", "ManInfo ManColorB");
    else
        person.setAttribute("class", "ManInfo ManColor");
    person.innerHTML += "<th>" + "<img src=\"images/headIcons/" + user.name + ".png\" onerror=\"javascript:this.src='images/system/defaultHead.png';\">" + "</th>"
    person.innerHTML += "<th  style=\"display: none\">" + user.name + "</th>"
    person.innerHTML += "<th>" + user.nickname + "</th>"
    person.innerHTML += "<th>" + "<input type=\"button\" value=\"邀请用户\" title=\"邀请用户\" onclick=\"sendYQ(\'" + user.name + "\')\">" + "</th>"
    botton.parentNode.insertBefore(person, botton)
}

function sendYQ(user) {
    if (websocket.readyState === websocket.OPEN) {
        let msg = {
            'TO': user,
            'type': 'try',
        }
        tools.ajaxGet("http://127.0.0.1:8080/gobang/api/talk",msg,function (res){
            if (res.status !== 0) {
                showError("发送失败：" + makeString(res.desc))
                return
            }
            showError("成功邀请，请等待对方回应！","ok")
        }, function (res) {
            showError("服务器异常" + res)
        })
    } else {
        showError("服务器异常")
    }
}

function getYQ(data){
    document.getElementsByClassName("container")[9].style.top = "50%"
    document.getElementById("YQFrom").innerHTML=data.from
    document.getElementById("YQTxtx").innerHTML=data.from+"邀请您加入游戏"
}

function agreeGame(){

}