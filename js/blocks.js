/**
 * Created by hwss on 2016-05-02.
 */

var scrc;
scrc = scrc || {};


$(function () {
    var blocks = scrc.namespace("blocks");

    blocks.create = function (elmt) {
        return elmt.clone().attr("id", scrc.util.uniqueId());
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
    var blocks = scrc.namespace("blocks");

    $("#blocks")
        .append(blocks.create(blocks.element.operator.binary.plus.elmt))
        .append(blocks.create(blocks.element.operator.binary.minus.elmt))
        .append(blocks.create(blocks.movement.move.elmt))
        .append(blocks.create(blocks.movement.rotate.elmt));
});
