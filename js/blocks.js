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

    function resize_ ($elmt) {
        var child_size = {
            width: 0,
            height: 0
        };

        if ($elmt.is(".element.default:visible, .text:visible")) {
            return;
        } else if ($elmt.is(".space")) {
            var $e = $elmt.find(":visible:first");

            resize_($e);
            $e.css({
                top: 0 + "px",
                left: 0 + "px"
            });

            child_size.width += $e.outerWidth();
            child_size.height = util.max(child_size.height, $e.outerHeight());
        } else {
            var padding = 2;

            $elmt.find(">.space, >.text").each(function (i, e) {
                var $e = $(e);

                resize_($e);
                $e.css({
                    //top: padding + "px",
                    left: (child_size.width + padding) + "px"
                });

                child_size.width += $e.outerWidth() + padding;
                child_size.height = util.max(child_size.height, $e.outerHeight());
            });
            child_size.width += padding;
            child_size.height += 2 * padding;
        }

        $elmt.css({
            width: child_size.width,
            height: child_size.height
        })
    }
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
        while(!$elmt.is(".toolbox .code-piece, .code>.code-piece")) {
            $elmt = $elmt.parent();;
        }
        resize_($elmt);
        /*$elmt.each(function (i, e) {
            var $e = $(e);
            var $root = util.parents($e, ".toolbox .code-piece, .code>.code-piece");

            console.log("root", $root)
            resize($root);
        });*/
    }

    blocks.addUl = function (e, toolbox) {
        var $toolbox = $(toolbox);

        var $table = $toolbox.find("ul");
        if ($table.length == 0) {
            $table = $toolbox.append("<ul>").find("ul");
        }

        $table.append($("<li>").append(e));
    }
});

$(function () {
    var blocks = scrc.namespace("blocks");
    var util = scrc.namespace("util");

    util
        .loadTemplate("template.code-piece.operator", function (template) {
            var $div = $("<div>").append(template);

            $div.find(">*").each(function (i, e) {
                blocks.addUl(e, ".toolbox[value=01]");
                blocks.draggable(e, ".toolbox");
                blocks.resizing(e);
            });
        })
        .loadTemplate("template.code-piece.movement", function (template) {
            var $div = $("<div>").append(template);

            $div.find(">*").each(function (i, e) {
                blocks.addUl(e, ".toolbox[value=01]");
                blocks.draggable(e, ".toolbox");
                blocks.resizing(e);
            })
        })
        .loadTemplate("template.code-piece.event", function (template) {
            var $div = $("<div>").append(template);

            $div.find(">*").each(function (i, e) {
                blocks.addUl(e, ".toolbox[value=01]");
                blocks.draggable(e, ".toolbox");
                blocks.resizing(e);
            });
        })
        .loadTemplate("template.code-piece.control", function (template) {
            var $div = $("<div>").append(template);

            $div.find(">*").each(function (i, e) {
                blocks.addUl(e, ".toolbox[value=01]");
                blocks.draggable(e, ".toolbox");
                blocks.resizing(e);
            });
        });
});
