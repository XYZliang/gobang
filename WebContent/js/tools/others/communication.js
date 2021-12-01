var websocket = null;

function initWebSocket() {
    if ('WebSocket' in window) {
        // Websocket的连接
        websocket = new WebSocket(wsBasePath + "/ws/action");// WebSocket对应的地址
    } else if ('MozWebSocket' in window) {
        // Websocket的连接
        websocket = new MozWebSocket(wsBasePath + "/ws/action");// SockJS对应的地址
    } else {
        // SockJS的连接
        websocket = new SockJS(wsBasePath + "/ws/action");// SockJS对应的地址
    }
    websocket.onopen = onOpen;
    websocket.onmessage = onMessage;
    websocket.onerror = onError;
    websocket.onclose = onClose;
}

function onOpen(evt) {
    console.log("连接打开：", evt);
}

function onError(evt) {
    console.log("出现错误：", evt);
}

function onClose(evt) {
    console.log("连接关闭：", evt);
}

function sendWsMessage(to, range, data) {
    var data = {
        from: loginUser,
        to: to,
        range: range,
        action: data
    };
    console.log("wsSocked send:", data);
    websocket.send(JSON.stringify(data));
}

window.close = function () {
    websocket.onclose();
}
