//利用localStorage模拟一个后端数据库

function getCookie(name) {
    let prefix = name + "="
    let start = document.cookie.indexOf(prefix)
    if (start == -1) {
        return null;
    }
    let end = document.cookie.indexOf(";", start + prefix.length)
    if (end == -1) {
        end = document.cookie.length;
    }
    let value = document.cookie.substring(start + prefix.length, end)
    return unescape(value);
}

function setCookie(cname, cvalue, exdays, path) {
    let d = new Date()
    document.cookie = "testCookie=true"
    if (!(getCookie("testCookie") === "true"))
        console.log("本地运行无法储存Cookie，请使用网页版进行测试！")
    let cookieString = cname + "=" + cvalue
    if (exdays) {
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
        let expires = "expires=" + d.toUTCString();
        cookieString = cookieString + "; " + expires
    }
    if (path)
        cookieString = cookieString + "; " + path
    document.cookie = cookieString
}

function utf8_to_b64(str) {//支持中文的base64加密解密
    if (str === null || str === 'null')
        return null;
    return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
    if (str === null || str === 'null')
        return null;
    return decodeURIComponent(escape(window.atob(str)));
}

let user = {
    "id": 0,
    "admin": 0,
    "level": 0,
    "name": "nologin",
    "nickname": "nologin",
    "sex": 0,
    "times": 0,
    "wintimes": 0
}

function updateUserInfo(admin, level, name, nickname, sex, times, wintimes, id) {
    let userObj = user;
    userObj.name = name;
    userObj.nickname = nickname;
    userObj.level = level;
    userObj.admin = admin;
    userObj.sex = sex;
    userObj.times = times;
    userObj.wintimes = wintimes;
    userObj.id = id;
    console.log(userObj)
    updateUser(userObj)
}

function updateUserInfoFromJson(JSON) {
    updateUserInfo(JSON.admin, JSON.level, JSON.name, JSON.nickname, JSON.sex, JSON.times, JSON.wintimes, JSON.id)
}

// function register(name, id, username, pwd, admin = false, highPermissions = false, check = false) {
//     let userObj = user;
//     userObj.username = username;
//     userObj.pwd = pwd;
//     userObj.name = name;
//     userObj.id = id;
//     userObj.admin = admin;
//     userObj.highPermissions = highPermissions;
//     if (id[0] === "1" && id[1] === "0") {
//         userObj.type = "tea"
//         userObj.highPermissions = true;
//     } else
//         userObj.type = "stu"
//     if (admin)
//         userObj.type = "admin"
//     userObj.checker = check
//     userObj.message = Math.floor(Math.random() * 99);
//     console.log(userObj)
//     updateUser(userObj)
// }
//
// function registerJsonn(json) {
//     console.log("数据接受成功");
//     let userObj = user;
//     userObj.username = json.userName
//     userObj.name = json.name
//     userObj.id = json.stuid
//     userObj.type = json.type
//     if (json.type.indexOf("管理员") !== -1)
//         userObj.admin = true
//     else
//         userObj.admin = false
//     userObj.highPermissions = json.highPermissions;
//     userObj.qq = json.qq
//     userObj.wechat = json.wechat
//     userObj.apple = json.apple
//     userObj.xinyong = json.xinyong
//     userObj.serverKey = json.serverKey
//     userObj.message = Math.floor(Math.random() * 99);
//     userObj.certification = json.certification;
//     userObj.phone = json.phone;
//     updateUser(userObj)
// }
//
// function login(username, pwd) {
//     let UserJsonString = localStorage.getItem(utf8_to_b64(username))
//     let userObj = JSON.parse(b64_to_utf8(UserJsonString));
//     if (userObj === undefined || userObj === null)
//         return false;
//     console.log(userObj)
//     console.log(userObj.username === username)
//     console.log(userObj.pwd === pwd)
//     console.log(userObj.pwd)
//     console.log(pwd)
//     return userObj.username === username && userObj.pwd === pwd;
// }

function getName(username) {
    let UserJsonString = localStorage.getItem(utf8_to_b64(username))
    let userObj = JSON.parse(b64_to_utf8(UserJsonString));
    return userObj.name;
}

// function getUser(username) {
//
//     if (username === null || username === 'null')
//         return user;
//     let UserJsonString = localStorage.getItem(utf8_to_b64(username))
//     return JSON.parse(b64_to_utf8(UserJsonString));
// }

function updateUser(userObj) {
    let UserJsonString = JSON.stringify(userObj);
    localStorage.setItem(utf8_to_b64(userObj.name), utf8_to_b64(UserJsonString));
}

function getUser(userName) {
    let UserJsonString = localStorage.getItem(utf8_to_b64(userName))
    let userObj = JSON.parse(b64_to_utf8(UserJsonString));
    return userObj;
}
