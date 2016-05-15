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
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - 10, p.y - 10);
        ctx.lineTo(p.x - 10, p.y + 10);
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.restore();
    };

    main_screen.draw();
});