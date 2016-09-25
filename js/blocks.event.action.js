/**
 * Created by hwss on 2016-05-12.
 */

var scrc;
scrc = scrc || {};


$(function () {
    var main_screen = scrc.namespace("main_screen");
    var blocks = scrc.namespace("blocks");

    scrc.namespace("blocks.actions.move").action = function (elmt, callback) {
        var space = scrc.namespace("blocks.element.element-space");
        var calc = space.calc;
        var $this = $(elmt);
        var $space = $this.find(".element-space");
        var dist = calc($space[0]);

        if (isNaN(dist)) return callback(elmt);

        var id = $this.attr("target-id") || main_screen.select_img_id;
        //console.log(id);
        var angle = main_screen.imgs[id].rotation() * Math.PI / 180;
        //console.log(angle);
        var dx = Math.round(Math.cos(angle) * dist);
        var dy = Math.round(Math.sin(angle) * dist);

        //console.log(angle + "도로 " + dist + " 이동");
        //console.log("move(" + dx + ", " + dy + ")");
        main_screen.imgs[id].move({x:dx,y:dy});
        main_screen.draw();

        callback(elmt);
    };

    scrc.namespace("blocks.actions.right-rotate").action = function (elmt, callback) {
        var space = scrc.namespace("blocks.element.element-space");
        var calc = space.calc;
        var $this = $(elmt);
        var $space = $this.find(".element-space");
        var angle = calc($space[0]);

        if (isNaN(angle)) return callback(elmt);

        var id = $this.attr("target-id") || main_screen.select_img_id;

        main_screen.imgs[id].rotate(angle);
        main_screen.draw();

        callback(elmt);
    };

    scrc.namespace("blocks.actions.left-rotate").action = function (elmt, callback) {
        var space = scrc.namespace("blocks.element.element-space");
        var calc = space.calc;
        var $this = $(elmt);
        var $space = $this.find(".element-space");
        var angle = -calc($space[0]);

        if (isNaN(angle)) return callback(elmt);

        var id = $this.attr("target-id") || main_screen.select_img_id;

        main_screen.imgs[id].rotate(angle);
        main_screen.draw();

        callback(elmt);
    };

    scrc.namespace("blocks.actions.point-in-direction").action = function (elmt, callback) {
        var space = scrc.namespace("blocks.element.element-space");
        var calc = space.calc;
        var $this = $(elmt);
        var $space = $this.find(".element-space");
        var angle = calc($space[0]);

        if (isNaN(angle)) return callback(elmt);

        var id = $this.attr("target-id") || main_screen.select_img_id;

        main_screen.imgs[id].setRotation(angle);
        main_screen.draw();

        callback(elmt);
    };

    scrc.namespace("blocks.actions.rach-gu").action = function (elmt, callback) {
        var space = scrc.namespace("blocks.element.element-space");
        var calc = space.calc;
        var $this = $(elmt);
        var $space = $this.find(".element-space");
        var x = calc($space[0]);
        var y = calc($space[1]);

        if (isNaN(x) || isNaN(y)) return callback(elmt);

        var id = $this.attr("target-id") || main_screen.select_img_id;

        //console.log(main_screen.imgs[id]);
        main_screen.imgs[id].setPosition({x:x, y:y});
        main_screen.draw();

        callback(elmt);
    };

    scrc.namespace("blocks.actions.start").action = function (elmt, callback) {
        callback(elmt);
    };

    scrc.namespace("blocks.actions.endless-loop").action = function (elmt, callback) {
        if (true) {
            callback(elmt);
        } else {
            // break;
        }
    };

    scrc.namespace("blocks.actions.looping").action = function (elmt, callback) {
        var $this = $(elmt);
        var prev = $this.attr("prev-piece-id");
        var count = 0;

        while (prev) {
            var $prev = $("#" + prev);

            if ($prev.is(".open")) {
                if (count == 0) {
                    break;
                } else {
                    count--;
                }
            } else if ($prev.is(".close")) {
                count++
            }

            prev = $prev.attr("prev-piece-id");
        }

        var $open = $("#" + prev);

        callback($open[0]);
    };

    scrc.namespace("blocks.actions.repeat").action = function (elmt, callback, option) {
        var $elmt = $(elmt);

        var space = scrc.namespace("blocks.element.element-space");
        var calc = space.calc;
        var $space = $elmt.find(">.b-open").find(">.element-space");
        var n = calc($space[0]);

        function repeat () {
            if (n > 0) {
                console.log(n)
                n--;
                blocks.execute($elmt.find(">.b-open"), repeat);
            } else {
                callback(elmt);
            }
        }

        repeat();
    };

    scrc.namespace("blocks.actions.repeat-start").action = function (elmt, callback, option) {
        callback(elmt);
    };

    scrc.namespace("blocks.actions.sleep").action = function (elmt, callback) {
        var space = scrc.namespace("blocks.element.element-space");
        var calc = space.calc;
        var $this = $(elmt);
        var $space = $this.find(".element-space");

        setTimeout(function () {
            callback(elmt);
        }, calc($space[0]) * 1000);
    };
});
