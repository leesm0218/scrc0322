/**
 * Created by hwss on 2016-05-05.
 */
var scrc;
scrc = scrc || {};

$(function () {
    var main_screen = scrc.namespace("main_screen");
    var util = scrc.namespace("util");
    var $main_screen = $("#main-screen");
    var canvas = $main_screen[0];

    if (canvas == null || canvas.getContext == null) return;

    $(canvas).attr({
        width : 400,
        height : 300
    });

    var ctx = canvas.getContext("2d");

    main_screen.one_point = {
        x : 100,
        y : 100,
        angle : 0,
        img : null,
        move : function (x, y) {
            this.x += x;
            this.y += y;
        },
        rotate : function (angle) {
            this.angle += angle / 180 * Math.PI;
        }
    };

    main_screen.draw = function () {
        var p = main_screen.one_point;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.translate(-p.x, -p.y);
        if (p.img == null) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - 20, p.y - 10);
            ctx.lineTo(p.x - 20, p.y + 10);
            ctx.closePath();
            ctx.fillStyle = "red";
            ctx.fill();
        } else {
            var img = p.img;

            ctx.drawImage(img, p.x - p.width / 2, p.y - p.height / 2, p.width, p.height);    // 이미지 위치x, 위치y, 크기x, 크기y
        }
        ctx.restore();
    };

    main_screen.draw();
});

$(function(){
    var main_screen = scrc.namespace("main_screen");

    $("#stage input").on("change", handleFiles);

    function handleFiles(e) {
        var img = new Image;
        img.src = URL.createObjectURL(e.target.files[0]);

        main_screen.one_point.img = img;
        main_screen.one_point.width = 128;
        main_screen.one_point.height = 120;

        img.onload = function() {
            main_screen.draw();
        };

        var canvasOffset=$("#main-screen").offset();
        var offsetX=canvasOffset.left;
        var offsetY=canvasOffset.top;

        var p = main_screen.one_point;
        var isDragging=false;

        function handleMouseDown(e){
            if (!isDragging) {
                p.x = parseInt(e.clientX - offsetX);
                p.y = parseInt(e.clientY - offsetY);
                // set the drag flag
                isDragging = true;

                main_screen.draw();
            }
        }

        function handleMouseUp(e){
            if (isDragging) {
                p.x = parseInt(e.clientX - offsetX);
                p.y = parseInt(e.clientY - offsetY);
                // clear the drag flag
                isDragging = false;

                main_screen.draw();
            }
        }

        function handleMouseOut(e){
            if(isDragging) {
                p.x = parseInt(e.clientX - offsetX);
                p.y = parseInt(e.clientY - offsetY);
                // user has left the canvas, so clear the drag flag
                //isDragging=false;

                main_screen.draw();
            }
        }

        function handleMouseMove(e){
            // if the drag flag is set, clear the canvas and draw the image
            if(isDragging){
                p.x = parseInt(e.clientX-offsetX);
                p.y = parseInt(e.clientY-offsetY);
                /*ctx.clearRect(0,0,canvasWidth,canvasHeight);
                ctx.drawImage(img,canMouseX-128/2,canMouseY-120/2,128,120);*/

                main_screen.draw();
            }
        }

        $("#main-screen").mousedown(handleMouseDown);
        $("#main-screen").mousemove(handleMouseMove);
        $("#main-screen").mouseup(handleMouseUp);
        $("#main-screen").mouseout(handleMouseOut);
    }
});