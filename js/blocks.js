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

        if ($elmt.hasClass("code-piece")) {
            $elmt_copy.attr("target-id", main_screen.select_img_id);

            if ($elmt.hasClass("control")) {
                $elmt_copy.find(".bracket").each(function (i, e) {
                    $(e).attr("id", util.uniqueId());
                })
            }
        }

        return $elmt_copy;
    };

    function resize ($elmt) {
        var child_size = {
            width: 0,
            height: 0
        };

        if ($elmt.is(".element.default:visible, .text:visible")) {
            return;
        } else if ($elmt.is(".element-space")) {
            var $e = $elmt.find(">:visible:first");

            resize($e);
            $e.css({
                top: 0 + "px",
                left: 0 + "px"
            });

            child_size.width += $e.outerWidth();
            child_size.height = util.max(child_size.height, $e.outerHeight());
        } else {
            var padding = 2;

            $elmt.find(">.element-space, >.text").each(function (i, e) {
                var $e = $(e);

                resize($e);
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

        //console.log($elmt, child_size)
        $elmt.css({
            width: child_size.width,
            height: child_size.height
        })
    }

    function resize_b_line ($elmt) {
        var $space = $elmt.find(">.movement-space");
        var $line = $elmt.find(">.text");

        $line.css({
            height: $space.outerHeight()
        });

        $elmt.css({
            height: $space.outerHeight()
        });
    }

    function resize_bracket ($elmt) {
        var $opens = $elmt.find(">.bracket.b-open"),
            $lines = $elmt.find(">.bracket.b-line"),
            $close = $elmt.find(">.bracket.b-close");

        $opens.each(function (i, e) {
            resize($(e));
        });
        $lines.each(function (i, e) {
            resize_b_line($(e));
        });
        resize($close);

        /*$open.css({ top: 0 + "px", margin: 0 });
        $line.css({ top: ($open.position().top + $open.height()) + "px", margin: 0
        });*/
        $($opens[1]).css({ top: ($($lines[0]).position().top + $($lines[0]).height()) + "px", margin: 0,
            width: $($opens[0]).outerWidth() + "px"
        });
        $close.css({ top: ($($lines[0]).position().top + $($lines[0]).height()) + "px", margin: 0,
            width: $($opens[0]).outerWidth() + "px"
        });

        /*$elmt.css({
            height: $open.outerHeight() + $line.outerHeight() + $close.outerHeight()
        });*/
    }

    blocks.resizing = function ($elmt) {
        $elmt = $($elmt);

        while(!$elmt.is(".toolbox .code-piece, .code>.code-piece")) {
            break;
            $elmt = $elmt.parent();
        }
        if ($elmt.is(".bracketed")) {
            resize_bracket($elmt);
        } else {
            resize($elmt);
        }
    };

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
        .loadTemplate(".scrc-template.code-piece.operator", function (template) {
            var $div = $("<div>").append(template);

            $div.find(">*").each(function (i, e) {
                blocks.addUl(e, ".toolbox[value=08]");
                blocks.draggable(e, ".toolbox");
                blocks.resizing($(e));
                blocks.extrude($(e));
            });
        })
        .loadTemplate(".scrc-template.code-piece.movement", function (template) {
            var $div = $("<div>").append(template);

            $div.find(">*").each(function (i, e) {
                blocks.addUl(e, ".toolbox[value=01]");
                blocks.draggable(e, ".toolbox");
                blocks.resizing($(e));
                blocks.extrude($(e));
            })
        })
        .loadTemplate(".scrc-template.code-piece.event", function (template) {
            var $div = $("<div>").append(template);

            $div.find(">*").each(function (i, e) {
                blocks.addUl(e, ".toolbox[value=02]");
                blocks.draggable(e, ".toolbox");
                blocks.resizing($(e));
                blocks.extrude($(e));
            });
        })
        .loadTemplate(".scrc-template.code-piece.control", function (template) {
            var $div = $("<div>").append(template);

            $div.find(">*").each(function (i, e) {
                blocks.addUl(e, ".toolbox[value=04]");
                blocks.draggable(e, ".toolbox");
                blocks.resizing($(e));
                blocks.extrude($(e));
            });
        });
});
