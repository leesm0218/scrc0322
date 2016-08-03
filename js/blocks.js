/**
 * Created by hwss on 2016-05-02.
 */

var scrc;
scrc = scrc || {};


$(function () {
    var blocks = scrc.namespace("blocks");
    var main_screen = scrc.namespace("main_screen");

    blocks.create = function ($elmt) {
        $elmt = $elmt.clone ? $elmt : $($elmt);

        var $elmt_copy = $elmt.clone().attr("id", scrc.util.uniqueId());

        if ($elmt.hasClass("movement")) {
            $elmt_copy.attr("target-id", main_screen.select_img_id);
        } else if ($elmt.hasClass("control")) {
            $elmt_copy.find(".bracket").each(function () {
                $(this).attr("id", scrc.util.uniqueId());
            })
        }

        return $elmt_copy;
    };
});

$(function () {
    var blocks = scrc.namespace("blocks");
    var util = scrc.namespace("util");

    util
        .loadTemplate("template.code-piece.operator", function (template) {
            $(".toolbox[value=01]").append(template);
            blocks.draggable(".code-piece.operator", ".tools");
        })
        .loadTemplate("template.code-piece.movement", function (template) {
            $(".toolbox[value=01]").append(template);
            blocks.draggable(".code-piece.movement", ".tools");
        })
        .loadTemplate("template.code-piece.event", function (template) {
            $(".toolbox[value=01]").append(template);
            blocks.draggable(".code-piece.event", ".tools");
        })
        .loadTemplate("template.code-piece.control", function (template) {
            $(".toolbox[value=01]").append(template);
            blocks.draggable(".code-piece.control", ".tools");
        });
});
