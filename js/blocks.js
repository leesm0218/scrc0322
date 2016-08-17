/**
 * Created by hwss on 2016-05-02.
 */

var scrc;
scrc = scrc || {};


$(function () {
    var util = scrc.namespace("util");
    var blocks = scrc.namespace("blocks");
    var main_screen = scrc.namespace("main_screen");

    blocks.create = function ($elmt) {
        $elmt = $elmt.clone ? $elmt : $($elmt);

        var $elmt_copy = $elmt.clone().attr("id", scrc.util.uniqueId());
        console.log($elmt.css("width"));

        if ($elmt.hasClass("code-piece")) {
            $elmt_copy.attr("target-id", main_screen.select_img_id);
        } else if ($elmt.hasClass("control")) {
            $elmt_copy.find(".bracket").each(function () {
                $(this).attr("id", scrc.util.uniqueId());
            })
        }

        return $elmt_copy;
    };

    function resize ($elmt) {
        var child_size = {
            width: 0,
            height: 0
        };

        var $childs = $elmt.find(">*:not(:hidden)");

        console.log("$childs.length: " + $childs.length);
        if ($childs.length) {
            $childs.each(function (i, e) {
                var $e = $(e);

                resize($e);

                child_size.width += $e.outerWidth();
                child_size.height = util.max(child_size.height, $e.outerHeight());
                console.log(child_size.width, child_size.height)
            });
            $elmt.css({
                width: (($elmt.outerWidth() - $elmt.width()) + child_size.width) + "px",
                height: child_size.height + "px"
            })
        }
    }

    blocks.resizing = function ($elmt) {
        console.log("resize start", $elmt)
        $elmt = $($elmt);
        $elmt.each(function (i, e) {
            var $e = $(e);
            var $root = util.parents($e, ".tools .code-piece, .code>.code-piece");

            console.log("root", $root)
            resize($root);
        });
    }
});

$(function () {
    var blocks = scrc.namespace("blocks");
    var util = scrc.namespace("util");

    util
        .loadTemplate("template.code-piece.operator", function (template) {
            $(".toolbox[value=01]").append(template);
            blocks.draggable(".code-piece.operator", ".tools");
            blocks.resizing(".tools .code-piece.operator");
        })
        .loadTemplate("template.code-piece.movement", function (template) {
            $(".toolbox[value=01]").append(template);
            blocks.draggable(".code-piece.movement", ".tools");
            blocks.resizing(".tools .code-piece.movement");
        })
        .loadTemplate("template.code-piece.event", function (template) {
            $(".toolbox[value=01]").append(template);
            blocks.draggable(".code-piece.event", ".tools");
            blocks.resizing(".tools .code-piece.event");
        })
        .loadTemplate("template.code-piece.control", function (template) {
            $(".toolbox[value=01]").append(template);
            blocks.draggable(".code-piece.control", ".tools");
            blocks.resizing(".tools .code-piece.control");
        });
});
