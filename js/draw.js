//----------------------
// お絵かき部分
var drawData = {
    drawFlag: false,
    oldX: 0,
    oldY: 0,
    brushSize: 4,
    penColor: "rgba(0, 0, 0, 1)"
}
var can = document.getElementById("myCanvas");
var context = can.getContext("2d");
context.fillStyle = '#ffffff';
context.fillRect(0, 0, can.width, can.height);
// context.clearRect(0, 0, can.width, can.height);
can.width = document.documentElement.clientWidth;
can.height = document.documentElement.clientHeight;

can.addEventListener("touchmove", function draw(e){
    if(!drawData.drawFlag) return;
    var x = e.touches[0].pageX;
    var y = e.touches[0].pageY;
    var can = document.getElementById("myCanvas");
    // var context = can.getContext("2d");
    context.strokeStyle = drawData.penColor;
    context.lineWidth = drawData.brushSize;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(drawData.oldX, drawData.oldY);
    context.lineTo(x, y);
    context.stroke();
    context.closePath();
    drawData.oldX = x;
    drawData.oldY = y;
}, true);
can.addEventListener("touchstart", function(e){
    drawData.drawFlag = true;
    drawData.oldX = e.touches[0].pageX;
    drawData.oldY = e.touches[0].pageY;
}, true);
can.addEventListener("touchend", function(){
    drawData.drawFlag = false;
}, true);
//ドラッグイベントで画面がスクロールしないように
document.ontouchmove = function(e){
    e.preventDefault();
}

//----------------------
// menu用

$$('body').doubleTap(showMenu); //ダブルタップ

function showMenu(e){
    $("#overlay").fadeIn(90);
    $("#menu").fadeIn(90);
}

//スライダー
$(function(){
    $("#overlay").css({"width":document.documentElement.clientWidth, "height":document.documentElement.clientHeight});
    $("#saveResult").css({"width":document.documentElement.clientWidth, "height":document.documentElement.clientHeight});
    $('#sizeSlider').empty().noUiSlider( 'init', {
        handles: 1,
        connect: "lower",
        start: 30,
        step: 5,
        change:
            function(){
                changeValue($(this));
            }
    });

    function changeValue(e){
        var value = e.noUiSlider("value")[1];
        value = Math.ceil(value / 5) + 1;
        $("#sizeValue").html(value);
        drawData.brushSize = value;
    }

    $("#sizeValue").html(4);

    $$("#boxClose").tap(function(){
        $("#menu").fadeOut(80);
        $("#overlay").fadeOut(80);
    });

    //色変更
    $("li.colorbox").each(function(){
        $(this).css("background", $(this).attr("name"));
        $$(this).tap(function(){
            var color = $(this).attr("name");
            drawData.penColor = color;
            changeCurrentColor(color);
        });
    });
    //現在地
    function changeCurrentColor(name){
        $("li.colorbox").each(function(){
            var color = $(this).attr("name");
            if(color == name){
                $(this).addClass("current");
            }else{
                $(this).removeClass("current");
            }
        });
    }

    //保存
    var id;
    $$("#saveBtn").tap(function(){
        $("#saveResult").fadeIn(90);
        var canvas2ImagePlugin = window.plugins.canvas2ImagePlugin;
        canvas2ImagePlugin.saveImageDataToLibrary(
            function(msg){
                $("#saveResult p").html("COMPLETE!");
                id = setTimeout(fadeOutProcess, 1000);
            },
            function(err){
                $("#saveResult p").html("ERROR..");
                id = setTimeout(fadeOutProcess, 1000);
            },
            'myCanvas'
        );
    });

    function fadeOutProcess(){
        console.log("save complete");
        clearTimeout(id);
        $("#saveResult").fadeOut(80);
    }

    //クリア
    $$("#clearBtn").tap(function(){
        // var can = document.getElementById("myCanvas");
        // var context = can.getContext("2d");
        // context.clearRect(0, 0, can.width, can.height);
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, can.width, can.height);
    });
});



