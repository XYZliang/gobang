let websocket = null;
let initWS = false;

function initWebSocket() {
    if (initWS === false) {
        tools.ajaxGet("http://127.0.0.1:8080/gobang/api/initWS", null, function (res) {
            console.log(res)
            if (res.status !== 0) {
                return
            }
            init2()
            initWS = true
        }, function (res) {
            showError("服务器异常" + res)
        })
    } else {
        init2()
    }

    function init2() {
        if ('WebSocket' in window) {
            //Websocket的连接
            websocket = new WebSocket("ws://127.0.0.1:8080/gobang/ws/action");//WebSocket对应的地址
        } else if ('MozWebSocket' in window) {
            //Websocket的连接
            websocket = new MozWebSocket("ws://127.0.0.1:8080/gobang/ws/action");//SockJS对应的地址
        } else {
            //SockJS的连接
            websocket = new SockJS("ws://127.0.0.1:8080/gobang/ws/action");//SockJS对应的地址
        }
        websocket.onopen = onOpen;
        websocket.onmessage = onMessage;
        websocket.onerror = onError;
        websocket.onclose = onClose;
    }
}

function onOpen(evt) {
    console.log("连接打开：", evt);
}

function onMessage(evt) {
    console.log(evt);
    let json = JSON.parse(evt.data);
    if (json.type === "try")
        getYQ(json)
    else if (json.type === "agree")
        agreeGame(false, json.from, json.room)
    else if (json.type === "ti")
        BeT(json.room)
    else if (json.type === "disagree")
        disagree(true)
    else if (json.type === "exit")
        newRoomT(json.room, null, true)
    else if (json.type === "openG")
        runGame(json.room, 0)
    else if (json.type === "makeQ")
        makeQi(parseInt(json.x), parseInt(json.y), parseInt(json.Black), true)
    else if (json.type === "ping" || json.type === "hui" || json.type === "shu")
        want(json.type, json.x, json.y)
    else if (json.type === "pingok")
        ping(true)
    else if (json.type === "pingdis")
        ping(true)
    else if (json.type === "huiok")
        hui(true)
    else if (json.type === "huidis")
        hui(false)
    else if (json.type === "watch")
        watchG(false, json)
    else if (json.type === "rewatch")
        watchG(true, json)
}

function onError(evt) {
    console.log("出现错误：", evt);
}

function onClose(evt) {
    console.log("连接关闭：", evt);
}

function doSend() {
    if (websocket.readyState == websocket.OPEN) {
        var msg = $("#myTalk").val();
        request({
            to: $("#targetList").val(),
            message: $('#myTalk').val()
        }, "post", "<%=basePath%>action/talk", callBack);
        console.log("发送成功!");
    } else {
        console.log("连接失败!");
    }
}

function doSendAll() {
    if (websocket.readyState === websocket.OPEN) {
        var msg = $("#myTalk").val();
        request({to: "ALL", message: $('#myTalk').val()}, "post", "<%=basePath%>action/talk", callBack);
        console.log("发送成功!");
    } else {
        console.log("连接失败!");
    }
}

window.close = function () {
    websocket.onclose();
}

function changeUser() {
    request({username: $("#userList").val()}, "post", "<%=basePath%>action/setCurUser", changeUserCallBack);
}

function changeUserCallBack(result) {
    callBack(result);
    initWebSocket();
}

function callBack(result) {
    alert(result.description);
}

