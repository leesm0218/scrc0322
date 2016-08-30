var scrc;
scrc = scrc || {};

$(function () {
    var blocks = scrc.namespace("blocks");
    var main_screen = scrc.namespace("main_screen");
    var util = scrc.namespace("util");

    var $workmenu = $(".workmenu");
    var $tools = $workmenu.find(".tools");
    var $code = $workmenu.find(".code");


    $workmenu
        .on("mouseover", ".code-piece", function (event) {
            //console.log("mouseover");
            $(".mouseover").removeClass("mouseover");
            $(util.parents(event.target, ".code-piece")[0]).addClass("mouseover");
        })
        .on("mouseleave", ".code-piece", function (event) {
            $(".mouseover").removeClass("mouseover");
            //util.parents(event.target, ".code-piece").removeClass("mouseover");
        });

    blocks.draggable = function (e, p) {
        $(e, p).draggable({
            cursor: "move",
            //addClasses : ".dragging",
            helper: "clone",
            drag: drag
        });
    };

    //blocks.draggable(".code-piece", $tools);

    var changed_blocks = [];

    $code.droppable({
        accept : ".workmenu .code-piece",
        //addClasses : ".dragging",
        drop : function (event, ui) {
            var $elmt = ui.helper;

            // 새것이라면 클론 생성
            if (util.parents($elmt, ".tools").is(".tools")) {
                $elmt = scrc.blocks.create($elmt);

                if ($elmt.hasClass("bracketed")) {
                    /*var $open_bracket = $elmt.find(".bracket:first");
                    var $close_bracket = $elmt.find(".bracket:last");
                    $code.append($open_bracket);
                    $code.append($close_bracket);

                    $open_bracket.css({
                        left: ui.offset.left - $code.position().left,
                        top: ui.offset.top - $code.position().top + 4
                    });
                    $close_bracket.css({
                        left: ui.offset.left - $code.position().left,
                        top: ui.offset.top - $code.position().top + 4
                    });

                    $($open_bracket, $code).draggable({
                        cursor: "move",
                        revert: "invalid",
                        helper: "original",
                        drag: drag
                    });

                    $($close_bracket, $code).draggable({
                        cursor: "move",
                        revert: "invalid",
                        helper: "original",
                        drag: drag
                    });

                    console.log($open_bracket, $close_bracket)*/
                    $elmt.removeClass("ui-draggable-dragging");
                    $code.append($elmt);
                    $elmt.css({
                        left: ui.offset.left - $code.position().left,
                        top: ui.offset.top - $code.position().top
                    });
                    $($elmt, $code).draggable({
                        cursor: "move",
                        revert: "invalid",
                        helper: "original",
                        drag: drag
                    });
                } else {
                    $elmt.removeClass("ui-draggable-dragging");
                    $code.append($elmt);

                    $elmt.css({
                        left: ui.offset.left - $code.position().left,
                        top: ui.offset.top - $code.position().top
                    });

                    $($elmt, $code).draggable({
                        cursor: "move",
                        revert: "invalid",
                        helper: "original",
                        drag: drag
                    });

                    //console.log($elmt.attr("id"));
                }
                //changed_blocks.push($elmt);
                blocks.resizing($elmt)
            } else if (!$elmt.parent().is(".code")) {
                var $outer_space = util.parents($elmt, ".element-space:first");
                var offset = $elmt.offset();

                $code.append($elmt);
                $elmt.css({
                    left: (offset.left - $code.position().left) + "px",
                    top: (offset.top - $code.position().top) + "px"
                });

                //changed_blocks.push($outer_space);
                //changed_blocks.push($elmt);
                blocks.resizing($outer_space);
                blocks.resizing($elmt);
            }

            if ($elmt.hasClass("magnet")) {
                // 자석 기능
                var $magnet = $code.find(".magneted-bottom:first");

                if ($magnet.length > 0) {
                    var npid = $magnet.attr("next-piece-id");

                    attach($magnet, $elmt);

                    if (npid) {
                        var $e = last_piece($elmt);

                        var $next = $("#" + npid);

                        attach($e, $next);
                    }

                    /*var deep_count = parseInt($magnet.attr("deep-count")) || 0;
                    if ($magnet.hasClass("open")) {
                        if ($elmt.hasClass("close")) {
                            $elmt.attr("deep-count", deep_count);
                        } else {
                            $elmt.attr("deep-count", deep_count + 1);
                        }
                    } else if ($elmt.hasClass("close")) {
                        $elmt.attr("deep-count", deep_count - 1);
                    } else {
                        $elmt.attr("deep-count", deep_count);
                    }*/
                } else {
                    //$elmt.attr("deep-count", 0);
                }

                $code.find(".magnet").removeClass("magneted-bottom");
            } else if ($elmt.hasClass("element")) {
                var $space = $code.find(".element-space.in-space:first");

                if ($space.length > 0) {
                    var $parent = util.parents($space, ".code>.code-piece");

                    var $other_elmt = $space.find(".code-piece:visible:not(.default):first");
                    if ($other_elmt.length > 0) {
                        $code.append($other_elmt[0]);
                        $other_elmt.css({
                            left: ($parent.offset().left - $code.position().left),
                            top: ($parent.offset().top - $code.position().top)
                        }).animate({
                            left: ($parent.offset().left - $code.position().left - 20),
                            top: ($parent.offset().top - $code.position().top + 30)
                        }, 100);
                        changed_blocks.push($other_elmt);
                        //blocks.resizing($other_elmt);
                    }
                    $space.find(".default").hide();
                    $space.append($elmt);
                    $space.removeClass("in-space");
                    //changed_blocks.push($parent);
                    blocks.resizing($parent);
                }
            }
            //extrude($elmt);
            changed_blocks.push($elmt);
            releaseTogether($elmt);
            $(".mouseover").removeClass("mouseover");
        }
    });

    var width_changed = true;
    $(".column2").on("keypress", "input", function () {
        if (width_changed) {
            width_changed = false;
            $(this).trigger("change");
        }
    });

    $(".column2").on("keydown", "input", function () {
        if (width_changed) {
            width_changed = false;
            $(this).trigger("change");
        }
    });

    $(".column2").on("keyup", "input", function () {
        if (width_changed) {
            width_changed = false;
            $(this).trigger("change");
        }
    });

    /*$(".column2").on("change", "input", function () {
        if (!width_changed) {
            var $this = $(this);
            $(".code").append("<div id='virtual_dom' style='display:inline-block; border: 0px;'>" + $this.val() + "</div>");
            var inputWidth = $("#virtual_dom").width() + 4.0;
            console.log(inputWidth - $this.width())
            blocks.resizing(util.parents($this, ".toolbox>.code-piece, .code>.code-piece"))
            //regulate(util.parents($this, ".tool>.code-piece, .code>.code-piece"), $this, {
            //    width: "+=" + (inputWidth - $this.width())
            //}, 1);
            $("#virtual_dom").remove();
            width_changed = true;
        }
    });*/

    function regulate ($parent, $elmt, css, delay)
    {
        delay = delay || 100;
        var $e = $elmt, $p = $e.parent();
        var old_width = $e.width();
        var old_height = $e.height();

        console.log("start")
        $e.css(css);
        /*do {
            //console.log($p.width(), $e.width(), old_width, $p.width() + $e.width() - old_width)
            //console.log($p.height(), $e.height(), old_height, $p.height() + $e.height() - old_height)
            var new_width = $p.width() + $e.width() - old_width;
            var new_height = $p.height() + $e.height() - old_height;
            old_width = $e.width();
            old_height = $e.height();
            //console.log(new_width, new_height)
            $p.css({
                width: new_width + "px",
                height: new_height + "px"
            }, delay);
            $e = $p;
            $p = $e.parent();
            var k=999999999;
            while(--k);
            console.log($e, $p.attr("id"), $parent.attr("id"), $p.attr("id") != $parent.attr("id"))
        } while ($p.attr("id") != $parent.attr("id"));
        console.log("done")*/
    }

    // 마지막 피스
    function last_piece ($elmt)
    {
        var pid, $e = $elmt;

        while (pid = $e.attr("next-piece-id")) {
            $e = $("#" + pid);
        }

        return $e;
    }

    // 서로 붙힘
    function attach ($elmt, $next)
    {
        $elmt
            .attr({
                "next-piece-id": $next.attr("id")
            });

        $next
            .attr({
                "prev-piece-id": $elmt.attr("id")
            });
    }

    function deduplication (array) {
        var result_array = [];

        for (var i = 0; i < array.length; i++) {
            var count = 0;

            for (var j = 0; j < array.length; j++) {
                if (array[i] == array[j]) {
                    count++;

                    if (count == 1) {
                        result_array.push(array[i]);
                    }
                }
            }
        }
        /*array.each(function (i, e) {
            var count = 0;

            array.each(function (ii, ee) {
                if (e == ee) {
                    count++;

                    if (count == 1) {
                        result_array.push(e);
                    }
                }
            });
        });*/

        return result_array;
    }

    function extrude_ () {
        changed_blocks = deduplication(changed_blocks);

        for (var i = 0; i < changed_blocks.length; i++) {
            //blocks.resizing(changed_blocks[i]);
            extrude(changed_blocks[i]);
        }

        changed_blocks = [];
    }

    function eeee ($elmt) {

    }
    function extrudeBracketOpen ($elmt) {
        var $parent = $elmt.parent();
        var height = 0;
        var pid;
        var $e = $elmt;

        while (pid = $e.attr("prev-piece-id")) {
            $e = $("#" + pid);
        }

        var $prev = $e;
        var e_pos = position($e, $code);

        while (pid = $e.attr("next-piece-id")) {
            $e = $("#" + pid);

            var pos = position($prev, $code);
            $e
                .css({
                    left: e_pos.left - $code.position().left + 19,
                    top: pos.top - $code.position().top + $prev.height() + 1
                });
            height += parseFloat($e.css("height")) + 1;
            $prev = $e;
        }

        $parent.find(".b-line").css({
            height: util.max(height + 1, 10)
        });
    }

    function extrudeBracketClose ($elmt) {
        var pid;
        var $e = $elmt;

        while (pid = $e.attr("prev-piece-id")) {
            $e = $("#" + pid);
        }

        var $prev = $e;

        while (pid = $e.attr("next-piece-id")) {
            $e = $("#" + pid);

            var pos = position($prev, $code);
            $e
                .css({
                    left: pos.left - $code.position().left,
                    top: pos.top - $code.position().top + $prev.height() + 1
                });
            $prev = $e;
        }
    }

    // 정렬
    function extrude ($elmt) {
        var $elmt = util.parents($elmt, ".code>.code-piece");

        if ($elmt.hasClass("bracketed")) {
            var $open = $elmt.find(".b-open"),
                $line = $elmt.find(".b-line"),
                $close = $elmt.find(".b-close");

            var open_pos = position($open, $code),
                line_pos = position($line, $code);

            extrudeBracketOpen($open);
            $line.css({
                top: ($open.height()) + "px"
            });
            extrudeBracketClose($close);
            $close.css({
                top: ($open.height() + $line.height()) + "px"
            });
        } else {
            var pid;
            var $top = $elmt;

            while (pid = $top.attr("prev-piece-id")) {
                $top = $("#" + pid);
            }

            var $e = $top;
            var $prev = $top;

            while (pid = $e.attr("next-piece-id")) {
                $e = $("#" + pid);

                var pos = position($prev, $code);
                $e
                    .css({
                        left: pos.left - $code.position().left,
                        top: pos.top - $code.position().top + $prev.height() + 1
                    });
                $prev = $e;
            }

            if ($top.hasClass("bracket")) {
                extrude($top.parent());
            }
        }
    }

    $tools.droppable({
        accept: ".code .code-piece",
        drop : function (event, ui) {
            remove(ui.helper)
        }
    });

    function remove ($elmt) {
        while ($elmt.length > 0) {
            $elmt.remove();
            var pid = $elmt.attr("next-piece-id")
            $elmt = $("#" + pid);
        }
    }

    function position ($elmt, $parent) {
        var result = {
            left: $elmt.position().left,
            right: $elmt.position().right,
            top: $elmt.position().top,
            bottom: $elmt.position().bottom
        };

        var $p = $elmt.parent();
        while ($p && $p.attr("id") != $parent.attr("id")) {
            result.left += $p.position().left;
            result.right += $p.position().right;
            result.top += $p.position().top;
            result.bottom += $p.position().bottom;
            $p = $p.parent();
        }

        result.left += $parent.position().left;
        result.right += $parent.position().right;
        result.top += $parent.position().top;
        result.bottom += $parent.position().bottom;

        return result;
    }

    function checkMagnet (ui) {
        var $elmts = $(".code .magnet"),
            $that = ui.helper;
        var ox = ui.offset.left,
            oy = ui.offset.top;

        // 자석 분리 시
        var prev_piece_id = $that.attr("prev-piece-id");
        if (prev_piece_id) {
            $("#" + prev_piece_id)
                .removeAttr("next-piece-id");

            $that
                .removeAttr("prev-piece-id");
        }

        //$that.addClass("dragging");
        // 마그넷 기능
        //console.log("code-sec 내부 N: " + $elmts.length + "{");
        for (var i = 0; i < $elmts.length; i++) {
            var $this = $($elmts[i]);

            if ($this.attr("id") != $that.attr("id")) {
                var epos = position($this, $code);
                var ex = epos.left,
                    ey = epos.top,
                    ew = $this.width(),
                    eh = $this.height(),
                    aw = $that.width();

                if (ey + eh - 5 <= oy && oy <= ey + eh + 15 &&
                    ex - aw - 5 <= ox && ox <= ex + ew + 5) {
                    $elmts.removeClass("magneted-bottom");
                    $this.addClass("magneted-bottom");
                    break;
                } else {
                    $this.removeClass("magneted-bottom");
                }
            }
        }
        // console.log("}\n" + ox + ", " + oy);
    }

    function checkElement (ui) {
        var $spaces = $(".code .element-space"),
            $that = ui.helper;
        var ox = ui.offset.left,
            oy = ui.offset.top;

        $spaces = $spaces.not($that.find(".element-space"));

        var $outer_space = $that.parent();
        if ($outer_space.is(".element-space")) {
            $outer_space.find(">.default").show();
        }

        // 마그넷 기능

        for (var i = 0; i < $spaces.length; i++) {
            var size = 999;
            var $space = $($spaces[i]);

            if ($that.attr("id") == undefined || $space.attr("id") != $that.attr("id")) {
                var epos = position($space, $code);
                var offset = $space.offset();
                var ex = offset.left,
                    ey = offset.top,
                    ew = $space.width(),
                    eh = $space.height(),
                    aw = $space.width();

                if (ey < oy && oy < ey + eh &&
                    ex < ox && ox < ex + ew) {
                    //console.log(eh + ew )
                    if (eh + ew < size) {
                        size = eh + ew;
                        $spaces.removeClass("in-space");
                        $space.addClass("in-space");
                    }
                } else {
                    $space.removeClass("in-space");
                }
            }
        }
    }

    function checkConditions (ui) {
        var $that = ui.helper;

        if ($that.hasClass("magnet")) {
            checkMagnet(ui);
        } else if ($that.hasClass("element")) {
            checkElement(ui);
        }
    }

    function drag (event, ui)
    {
        // console.log("drag start")
        var $that = ui.helper;

        checkConditions(ui);

        // 함께 이동
        moveTogether($that);
    }

    function moveTogether ($this)
    {
        changed_blocks.push($this);

        if ($this.hasClass("dragging")) return;

        var $e = $this;
        var next_piece_id = $e.attr("next-piece-id");
        var zIndexInc = 1;

        $e.addClass("dragging");

        while (next_piece_id) {
            // var pos = position($e, $code);
            var $that = $("#" + next_piece_id + ":visible");


            if ($that.length > 0) {
                $that.addClass("dragging");
                $that.css({
                    "z-index": ""
                });
                $that.css({
                    "z-index": "+=" + zIndexInc
                });
                zIndexInc++;

                $e = $that;
            }
            next_piece_id = $e.attr("next-piece-id");
        }
    }

    function releaseTogether ($this)
    {
        changed_blocks.push($this);

        var $e = $this;
        var next_piece_id = $e.attr("next-piece-id");

        $e.removeClass("dragging");
        while (next_piece_id) {
            var $that = $("#" + next_piece_id + ":visible");

            $that.removeClass("dragging");
            $that.css({
                "z-index" : ""
            });
            if ($that.length > 0) {
                $e = $that;
            }
            next_piece_id = $e.attr("next-piece-id");
        }
    }

    scrc.refresh = function () {
        requestAnimationFrame(scrc.refresh);
        //console.log(changed_blocks.length);
        extrude_();
    }
});

$(function () {
    scrc.refresh();
});