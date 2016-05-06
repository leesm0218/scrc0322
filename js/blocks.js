/**
 * Created by hwss on 2016-05-02.
 */
var scrc;
scrc = scrc || {};


$(function () {
    // 코드 조각들을 클릭하면 코드가 동작한다.
    // TODO: 말풍선으로 출력하도록 바꾼다.
    // TODO: 제어부의 경우 타이머를 통해 불연속적으로 동작해야 하므로 바꿔야 한다.
    var $script_tab = $("#code-sec");

    $script_tab.on("dblclick", ".code-piece.operator", function (event) {
        var binary = scrc.namespace("blocks.element.operator.binary");
        var calc = binary[$(this).attr("operator")].calc;

        console.log(calc(this));
        return false;
    });

    $script_tab.on("dblclick", ".code-piece.movement", function (event) {
        var movement = scrc.namespace("blocks.movement");
        var action = movement[$(this).attr("movement")].action;

        action(this);
        return false;
    });
});

$(function () {
    //
    // 블럭 동작 정의
    //
    scrc.namespace("blocks.element.operator").methods = {
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
    scrc.namespace("blocks.movement.move").action = function (elmt) {
        var calc = scrc.blocks.element.space.calc;
        var $this = $(elmt);
        var $space = $this.find(".space");
        var dist = calc($space[0]);
        var angle = scrc.main_screen.one_point.angle;
        var dx = Math.round(Math.cos(angle) * dist);
        var dy = Math.round(Math.sin(angle) * dist);

        console.log(angle + "도로 " + dist + " 이동");
        console.log("move(" + dx + ", " + dy + ")");
        scrc.main_screen.one_point.move(dx, dy);
        scrc.main_screen.draw();
    };

    scrc.namespace("blocks.movement.rotate").action = function (elmt) {
        var calc = scrc.blocks.element.space.calc;
        var $this = $(elmt);
        var $space = $this.find(".space");
        var angle = calc($space[0]);

        console.log(angle + "도 회전");
        console.log("rotate(" + angle + ")");
        scrc.main_screen.one_point.rotate(angle);
        scrc.main_screen.draw();
    };
});

$(function () {
    //
    // 블럭 형태 정의
    //
    scrc.namespace("blocks.element.space").elmt = $("<span>", {
        "class": "element space"
    });


    scrc.namespace("blocks.element.default.number").elmt = $("<input>", {
        "class" : "default element number",
        "type" : "text",
        "return-type" : "number"
    }).val(0);

    scrc.namespace("blocks.element.space.number").elmt =
        scrc.blocks.element.space.elmt.clone()
            .append(scrc.blocks.element.default.number.elmt.clone());

    scrc.namespace("blocks.element.operator.binary.plus").elmt = $("<span>", {
        "class" : "code-piece binary operator element",
        "id" : scrc.util.uniqueId(),
        "operator" : "plus",
        "return-type" : "number",
        //"draggable" : true
    })
        .append(scrc.blocks.element.space.number.elmt.clone())
        .append(" + ")
        .append(scrc.blocks.element.space.number.elmt.clone());

    scrc.namespace("blocks.element.operator.binary.minus").elmt = $("<span>", {
        "class" : "code-piece binary operator element",
        "id" : scrc.util.uniqueId(),
        "operator" : "minus",
        "return-type" : "number",
        //"draggable" : true
    })
        .append(scrc.blocks.element.space.number.elmt.clone())
        .append(" - ")
        .append(scrc.blocks.element.space.number.elmt.clone());

    scrc.namespace("blocks.movement.move").elmt = $("<span>", {
        "class" : "code-piece movement",
        "id" : scrc.util.uniqueId(),
        "movement" : "move",
        //"draggable" : true
    })
        .append(scrc.blocks.element.space.number.elmt.clone())
        .append(" 만큼 움직이기");

    scrc.namespace("blocks.movement.rotate").elmt = $("<span>", {
        "class" : "code-piece movement",
        "id" : scrc.util.uniqueId(),
        "movement" : "rotate",
        //"draggable" : true
    })
        .append(scrc.blocks.element.space.number.elmt.clone())
        .append(" 도 돌기");
});

$(function () {
    $("#script-tab").on("mouseover", ".code-piece", function (event) {
        var $target = $(event.target);

        if (!$target.hasClass("code-piece")) {
            $target = $target.parents(".code-piece");
        }

        $target.addClass("mouseover");
    });

    $("#script-tab").on("mouseout", ".code-piece", function (event) {
        var $target = $(event.target);

        if (!$target.hasClass("code-piece")) {
            $target = $target.parents(".code-piece");
        }

        $target.removeClass("mouseover");
    });
});

$(function () {
    $("#blocks")
        .append(scrc.blocks.element.operator.binary.plus.elmt.clone())
        .append(scrc.blocks.element.operator.binary.minus.elmt.clone())
        .append(scrc.blocks.movement.move.elmt.clone())
        .append(scrc.blocks.movement.rotate.elmt.clone());
});
