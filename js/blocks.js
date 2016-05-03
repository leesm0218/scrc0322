/**
 * Created by hwss on 2016-05-02.
 */
var scrc;
scrc = scrc || {};
scrc.blocks = scrc.blocks || {};
scrc.util = scrc.util || {};


$(function () {
    // 코드 조각들을 클릭하면 코드가 동작한다.
    // TODO: 말풍선으로 출력하도록 바꾼다.
    // TODO: 제어부의 경우 타이머를 통해 불연속적으로 동작해야 하므로 바꿔야 한다.

    $("#script-tab").on("dblclick", ".code-piece.operator", function (event) {
        var calc = scrc.blocks.element.operator.binary.calc;

        console.log(calc(this));
        return false;
    });
});

$(function () {
    //
    // 블럭 동작 정의
    //
    var operators = {
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
    scrc.blocks = scrc.blocks || {};
    scrc.blocks.element = scrc.blocks.element || {};
    scrc.blocks.element.space = scrc.blocks.element.space || {};
    scrc.blocks.element.space.calc = function (elmt) {
        var calc = scrc.blocks.element.default.number.calc;
        var $elmt = $(elmt).find(".element");

        return calc($elmt[0]);
    };

    // number는 default element 중에 하나인데
    // 따로 존재할 수 업고 항상 다른 엘리먼트의 안에 있다.
    // TODO: space element가 텅 비어 있으면 나타나고, 아니면 숨겨지는 식으로 구현할 것.
    scrc.blocks.element.default = scrc.blocks.element.default || {};
    scrc.blocks.element.default.number = scrc.blocks.element.default.number || {};
    scrc.blocks.element.default.number.calc = function (elmt) {
        return parseInt(elmt.value);
    };

    scrc.blocks.element.operator = scrc.blocks.element.operator || {};
    scrc.blocks.element.operator.binary = scrc.blocks.element.operator.binary || {};
    scrc.blocks.element.operator.binary.calc = function (elmt) {
        var calc = scrc.blocks.element.space.calc;
        var $this = $(elmt);
        var $space = $this.find(".space");

        return operators.binary[$this.attr("operator")](calc($space[0]), calc($space[1]));
    };

    scrc.blocks.element.operator.binary.plus = scrc.blocks.element.operator.binary.plus || {};
    scrc.blocks.element.operator.binary.plus.calc = scrc.blocks.element.operator.binary.calc;
});

$(function () {
    //
    // 블럭 형태 정의
    //
    scrc.blocks = scrc.blocks || {};
    scrc.blocks.element = scrc.blocks.element || {};

    scrc.blocks.element.space.elmt = $("<span>", {
        "class": "element space"
    });

    scrc.blocks.element.default = scrc.blocks.element.default || {};
    scrc.blocks.element.default.number.elmt = $("<input>", {
        "class" : "default element number",
        "type" : "text",
        "return-type" : "number"
    }).val(0);

    scrc.blocks.element.operator = scrc.blocks.element.operator || {};
    scrc.blocks.element.operator.binary = scrc.blocks.element.operator.binary || {};
    scrc.blocks.element.operator.binary.plus = scrc.blocks.element.operator.binary.plus || {};
    scrc.blocks.element.operator.binary.plus.elmt = $("<span>", {
        "class" : "code-piece binary operator element",
        "id" : scrc.util.uniqueId(),
        "operator" : "plus",
        "return-type" : "number",
        "draggable" : true
    })
        .append(scrc.blocks.element.space.elmt.clone()
            .append(scrc.blocks.element.default.number.elmt.clone()))
        .append(" + ")
        .append(scrc.blocks.element.space.elmt.clone()
            .append(scrc.blocks.element.default.number.elmt.clone()));

    scrc.blocks.element.operator.binary.minus = scrc.blocks.element.operator.binary.minus || {};
    scrc.blocks.element.operator.binary.minus.elmt = $("<span>", {
        "class" : "code-piece binary operator element",
        "id" : scrc.util.uniqueId(),
        "operator" : "minus",
        "return-type" : "number",
        "draggable" : true
    })
        .append(scrc.blocks.element.space.elmt.clone()
            .append(scrc.blocks.element.default.number.elmt.clone()))
        .append(" - ")
        .append(scrc.blocks.element.space.elmt.clone()
            .append(scrc.blocks.element.default.number.elmt.clone()));

    $("#blocks")
        .append(scrc.blocks.element.operator.binary.plus.elmt.clone())
        .append(scrc.blocks.element.operator.binary.minus.elmt.clone());
});
