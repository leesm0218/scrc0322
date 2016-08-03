/**
 * Created by hwss on 2016-05-12.
 */

var scrc;
scrc = scrc || {};


$(function () {
    // 코드 조각들을 클릭하면 코드가 동작한다.
    // TODO: 말풍선으로 출력하도록 바꾼다.
    // TODO: 제어부의 경우 타이머를 통해 불연속적으로 동작해야 하므로 바꿔야 한다.
    var $workmenu = $(".workmenu");

    $workmenu.on("dblclick", ".code-piece.operator", function (event) {
        var binary = scrc.namespace("blocks.element.operator.binary");
        var calc = binary[$(this).attr("operator")].calc;

        console.log(calc(this));
        return false;
    });

    $workmenu.on("dblclick", ".code-piece.movement.element", function (event) {
        var calcs = scrc.namespace("blocks.calc");
        var calc = calcs[$(this).attr("calc")].calc;

        console.log(calc(this));
        return false;
    });

    $workmenu.on("dblclick",
        ".code-piece.movement:not(.element), .code-piece.event:not(.element), .code-piece.control:not(.element)",
        function (event) {
        var actions = scrc.namespace("blocks.actions");
        var $this = $(this), pid;

        // 최상위 코드조각 찾기
        while (pid = $this.attr("prev-piece-id")) {
            $this = $("#" + pid);
        }

        // 동작을 타이머로 끊어서 실행한다.
        var timer = function ($that) {
            return function () {
                var pid;

                // 코드조각을 실행하고
                var action = actions[$that.attr("action")].action;
                action($that[0], function (elmt) {
                    var $that = $(elmt);
                    // 하위 코드조각으로 들어가기
                    if (pid = $that.attr("next-piece-id")) {
                        //console.log(3);
                        setTimeout(timer($("#" + pid)), 1);
                    } else {
                        // 최하위 코드조각이면
                        // 상위 코드조각으로 올라가면서 동작중 표시 지우기
                        var $t = $that;
                        while (pid = $t.attr("prev-piece-id")) {
                            $t.removeClass("acting");
                            $t = $("#" + pid);
                        }
                        $t.removeClass("acting");
                    }
                });
            }
        };

        // 하위 코드조각을 순회하며 동작중 표시하기
        var $t = $this;
        $t.addClass("acting");
        while (pid = $t.attr("next-piece-id")) {
            $t = $("#" + pid);
            $t.addClass("acting");
        }

        // 동작 시작
        setTimeout(timer($this), 1);

        return false;
    });
});

$(function () {
    var main_screen = scrc.namespace("main_screen");
    //
    // 블럭 동작 정의
    //
    var operator = scrc.namespace("blocks.element.operator");
    operator.methods = {
        binary : {
            "plus": function (lhs, rhs) {
                return lhs + rhs;
            },
            "minus": function (lhs, rhs) {
                return lhs - rhs;
            }
        }
    };

    // 여러 엘리먼트들이 들어갈 수 있는 빈공간.
    // 내부에는 '하나'의 엘리먼트만 들어갈 수 있다.
    scrc.namespace("blocks.element.space").calc = function (elmt) {
        var number = scrc.namespace("blocks.element.default.number");
        var calc = number.calc;
        var $elmt = $(elmt).find(".element");

        return calc($elmt[0]);
    };

    // number는 default element 중에 하나인데
    // 따로 존재할 수 업고 항상 다른 엘리먼트의 안에 있다.
    // TODO: space element가 텅 비어 있으면 나타나고, 아니면 숨겨지는 식으로 구현할 것.
    scrc.namespace("blocks.element.default.number").calc = function (elmt) {
        return parseInt(elmt.value);
    };

    var calc = scrc.namespace("blocks.element.operator.binary").calc = function (elmt) {
        var space = scrc.namespace("blocks.element.space");
        var calc = space.calc;
        var $this = $(elmt);
        var $space = $this.find(".space");

        return operator.methods.binary[$this.attr("operator")](calc($space[0]), calc($space[1]));
    };

    scrc.namespace("blocks.element.operator.binary.plus").calc = calc;
    scrc.namespace("blocks.element.operator.binary.minus").calc = calc;

    //var movement = scrc.namespace("blocks.movement");
    scrc.namespace("blocks.actions.move").action = function (elmt, callback) {
        var calc = scrc.blocks.element.space.calc;
        var $this = $(elmt);
        var $space = $this.find(".space");
        var dist = calc($space[0]);
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
        var calc = scrc.blocks.element.space.calc;
        var $this = $(elmt);
        var $space = $this.find(".space");
        var angle = calc($space[0]);
        var id = $this.attr("target-id") || main_screen.select_img_id;

        main_screen.imgs[id].rotate(angle);
        main_screen.draw();

        callback(elmt);
    };

    scrc.namespace("blocks.actions.left-rotate").action = function (elmt, callback) {
        var calc = scrc.blocks.element.space.calc;
        var $this = $(elmt);
        var $space = $this.find(".space");
        var angle = -calc($space[0]);
        var id = $this.attr("target-id") || main_screen.select_img_id;

        main_screen.imgs[id].rotate(angle);
        main_screen.draw();

        callback(elmt);
    };

    scrc.namespace("blocks.actions.point-in-direction").action = function (elmt, callback) {
        var calc = scrc.blocks.element.space.calc;
        var $this = $(elmt);
        var $space = $this.find(".space");
        var angle = calc($space[0]);
        var id = $this.attr("target-id") || main_screen.select_img_id;

        main_screen.imgs[id].setRotation(angle);
        main_screen.draw();

        callback(elmt);
    };

    scrc.namespace("blocks.actions.rach-gu").action = function (elmt, callback) {
        var calc = scrc.blocks.element.space.calc;
        var $this = $(elmt);
        var $space = $this.find(".space");
        var x = calc($space[0]);
        var y = calc($space[1]);
        var id = $this.attr("target-id") || main_screen.select_img_id;

        //console.log(main_screen.imgs[id]);
        main_screen.imgs[id].setPosition({x:x, y:y});
        main_screen.draw();

        callback(elmt);
    };

    scrc.namespace("blocks.calc.x-position").calc = function (elmt) {
        var $this = $(elmt);
        var id = $this.attr("target-id") || main_screen.select_img_id;

        return main_screen.imgs[id].getX();
    };

    scrc.namespace("blocks.calc.y-position").calc = function (elmt) {
        var $this = $(elmt);
        var id = $this.attr("target-id") || main_screen.select_img_id;

        return main_screen.imgs[id].getY();
    };

    scrc.namespace("blocks.calc.comhair").calc = function (elmt) {
        var $this = $(elmt);
        var id = $this.attr("target-id") || main_screen.select_img_id;

        return main_screen.imgs[id].rotation() * Math.PI / 180;
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

    scrc.namespace("blocks.actions.sleep").action = function (elmt, callback) {
        var space = scrc.namespace("blocks.element.space");
        var calc = space.calc;
        var $this = $(elmt);
        var $space = $this.find(".space");

        setTimeout(function () {
            callback(elmt);
        }, calc($space[0]) * 1000);
    };
});
