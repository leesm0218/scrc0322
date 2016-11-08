/**
 * Created by hwss on 2016-05-12.
 */

var scrc;
scrc = scrc || {};


$(function () {
    var main_screen = scrc.namespace("main_screen");
    var variables = scrc.namespace("blocks.variables");
    //
    // 블럭 동작 정의
    //
    var operator = scrc.namespace("blocks.element.operator");
    operator.methods = {
        binary: {
            "plus": function (lhs, rhs) {
                return lhs + rhs;
            },
            "minus": function (lhs, rhs) {
                return lhs - rhs;
            },
            "mul": function (lhs, rhs) {
                return lhs * rhs;
            },
            "sub": function (lhs, rhs) {
                return lhs / rhs;
            },
            "random": function (lhs, rhs) {
                return lhs + Math.floor(Math.random() * rhs);
            },
            "lt": function (lhs, rhs) {
                return lhs < rhs;
            },
            "gt": function (lhs, rhs) {
                return lhs > rhs;
            },
            "eq": function (lhs, rhs) {
                return lhs == rhs;
            },
            "and": function (lhs, rhs) {
                return lhs && rhs;
            },
            "or": function (lhs, rhs) {
                return lhs || rhs;
            }
        },
        monoary: {
            "not": function (lhs) {
                return !lhs;
            }
        }
    };

    // 여러 엘리먼트들이 들어갈 수 있는 빈공간.
    // 내부에는 '하나'의 엘리먼트만 들어갈 수 있다.
    scrc.namespace("blocks.element.element-space").calc = function (elmt) {
        var $this = $(elmt);
        var $inside_elmt = $this.find(">.element:visible");
        var calcs = scrc.namespace("blocks.calc");
        var calc = calcs[$inside_elmt.attr("calc")].calc;

        return calc($inside_elmt[0]);
    };

    // number는 default element 중에 하나인데
    // 따로 존재할 수 업고 항상 다른 엘리먼트의 안에 있다.
    // TODO: space element가 텅 비어 있으면 나타나고, 아니면 숨겨지는 식으로 구현할 것.
    scrc.namespace("blocks.calc.number").calc = function (elmt) {
        return parseFloat(elmt.value);
    };

    var binary_calc = scrc.namespace("blocks.element.operator.binary").calc = function (elmt) {
        var space = scrc.namespace("blocks.element.element-space");
        var calc = space.calc;
        var $this = $(elmt);
        var $space = $this.find(">.element-space");

        return operator.methods.binary[$this.attr("calc")](calc($space[0]), calc($space[1]));
    };

    var monoary_calc = scrc.namespace("blocks.element.operator.monoary").calc = function (elmt) {
        var space = scrc.namespace("blocks.element.element-space");
        var calc = space.calc;
        var $this = $(elmt);
        var $space = $this.find(">.element-space");

        return operator.methods.monoary[$this.attr("calc")](calc($space[0]));
    };

    scrc.namespace("blocks.calc.plus").calc = binary_calc;
    scrc.namespace("blocks.calc.minus").calc = binary_calc;
    scrc.namespace("blocks.calc.mul").calc = binary_calc;
    scrc.namespace("blocks.calc.sub").calc = binary_calc;
    scrc.namespace("blocks.calc.random").calc = binary_calc;
    scrc.namespace("blocks.calc.lt").calc = binary_calc;
    scrc.namespace("blocks.calc.gt").calc = binary_calc;
    scrc.namespace("blocks.calc.eq").calc = binary_calc;
    scrc.namespace("blocks.calc.and").calc = binary_calc;
    scrc.namespace("blocks.calc.or").calc = binary_calc;

    scrc.namespace("blocks.calc.not").calc = monoary_calc;

    scrc.namespace("blocks.calc.not").calc = function (elmt) {
        var space = scrc.namespace("blocks.element.element-space");
        var calc = space.calc;
        var $elmt = $(elmt);
        var $space = $elmt.find(">.element-space");

        return !calc($space[0]);
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

    scrc.namespace("blocks.calc.value").calc = function (elmt) {
        var $this = $(elmt);
        var variable_id = $this.attr("variable-id");

        return variables[variable_id];
    }
});
