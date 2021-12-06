function openRoom() {
    if (!debug) {
        if (!checkLogin()) {
            showError("请先登录！")
            return;
        }
    }
    if (document.getElementsByClassName("container")[6].style.top !== "50%") {
        document.getElementsByClassName("container")[6].style.top = "50%"
        getInfos(false)
    } else {
        document.getElementsByClassName("container")[6].style.top = "-50%"
    }
}

function findUserByUsername(userName) {
    let UsersJsonString = localStorage.getItem(utf8_to_b64("所有用户"));
    let users = JSON.parse(b64_to_utf8(UsersJsonString));
    for (let i = 0; i < users.length; i++) {
        if (userName === users[i].name) {
            let user = {
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

function addNewRoom(userName1, dan, total,id) {
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
        "                    <img class=\"gameHeadImg\" src=\"images/system/noUserHead.png\">\n" +
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
        "                    <div class=\"gameButton1\">\n" +
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
}

function makeNewRoom() {
    let game = {
        'Dan': noTuiGe(Dan.value),
        'Total': noTuiGe(Total.value)
    }
    tools.ajaxGet("http://127.0.0.1:8080/gobang/api/makeNewGame", game, function (res) {
        if (res.status === 0) {
            addNewRoom(getUserName(), noTuiGe(Dan.value), noTuiGe(Total.value), res.data.id)
            document.getElementsByClassName('container')[7].style.top='-50%'
            msg("创建成功！","ok")
        } else {
            showError("创建失败" + makeString(res.desc) + makeString(res.data))
        }
    }, function (res) {
        showError("系统异常！" + makeString(res.desc) + makeString(res.data))
        adminDo = false
    })
}