function makeChessboard(Black){
    cleanChessboard()
    let ChessboardEnd=document.getElementById("ChessboardEnd")
    for(let i=1;i<=15;i++){
        let newR = document.createElement("tr");
        for(let ii=1;ii<=15;ii++){
            newR.innerHTML+="<th class=\"chess\" onclick=\"makeQi("+i+","+ii+","+Black+")\"><img src=\"\"></th>"
        }
        ChessboardEnd.parentNode.insertBefore(newR,ChessboardEnd)
    }
}
makeChessboard()
function makeQi(x,y,Black){
    let chess=document.getElementById("ChessboardTable")
    let hang=chess.getElementsByTagName("tr")
    for(let i=0;i<15;i++){
        if(i+1===x) {
            let lie=hang[i].getElementsByTagName("th")
            for (let ii = 0; ii < 15; ii++) {
                if(ii+1===y)
                {
                    let img=lie[ii].getElementsByTagName("img")[0]
                    if(Black===1)
                        img.src="images/system/chessB.png"
                    else
                        img.src="images/system/chessW.png"
                    img.style.display="block"
                    return
                }
            }
        }
    }
}
function cleanChessboard(){
    document.getElementById("ChessboardTable").innerHTML="<tr id=\"ChessboardEnd\"></tr>"
}


function leftDanTime(fun,time){
    var eleCircles=document.querySelectorAll("#timeCountX circle");
    var eleTimeSec=document.getElementById("timeSecond");
    var perimeter=Math.PI*2*170;
    var circleInit=function(){
        if(eleCircles[1]){
            eleCircles[1].setAttribute("stroke-dasharray","1069 1069")
        }
        if(eleCircles[2]){
            eleCircles[2].setAttribute("stroke-dasharray",perimeter/2+" 1069")
        }
        eleTimeSec.innerHTML=""
    };
    var timerTimeCount=null;
    var fnTimeCount=function(b){
        if(timerTimeCount){
            return
        }
        var b=b||10;
        var a=function(){
            var c=b/10;
            if(eleCircles[1]){
                eleCircles[1].setAttribute("stroke-dasharray",perimeter*c+" 1069")
            }
            if(eleCircles[2]&&b<=5){
                eleCircles[2].setAttribute("stroke-dasharray",perimeter*c+" 1069")
            }
            if(eleTimeSec){
                eleTimeSec.innerHTML=b
            }
            b--;
            if(b<0){
                clearInterval(timerTimeCount);
                timerTimeCount=null;
            }
        };
        a();
        timerTimeCount=setInterval(a,1000)
    };
    if(fun==="init")
    {
        circleInit()
    }
    if(fun==="start")
    {
        circleInit()
        fnTimeCount(time)
    }
    if(fun==="init0")
    {
        circleInit()
        fnTimeCount(0)
    }
}