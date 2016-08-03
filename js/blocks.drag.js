var scrc;
scrc = scrc || {};

$(function () {
    var blocks = scrc.namespace("blocks");
    var main_screen = scrc.namespace("main_screen");
    var util = scrc.namespace("util");

    var $workmenu = $(".workmenu");
    var $tools = $workmenu.find(".tools");
    var $code = $workmenu.find(".code");

    var parents = function  (target, parent) {
        var $target = $(target);

        if (!$target.is(parent)) {
            $target = $target.parents(parent);
        }

        return $target;
    };

    $workmenu
        .on("mouseover", ".code-piece", function (event) {
            //console.log("mouseover");
            parents(event.target, ".code-piece").addClass("mouseover");
        })
        .on("mouseout", ".code-piece", function (event) {
            parents(event.target, ".code-piece").removeClass("mouseover");
        });

    blocks.draggable = function (e, p) {
        $(e, p).draggable({
            cursor: "move",
            //addClasses : ".dragging",
            helper: "clone",
            drag: drag
        });
    };

    blocks.draggable(".code-piece", $tools);

    $code.droppable({
        accept : ".workmenu .code-piece",
        //addClasses : ".dragging",
        drop : function (event, ui) {
            var $elmt = ui.helper;

            // 새것이라면 클론 생성
            if (parents($elmt, ".tools").is(".tools")) {
                $elmt = scrc.blocks.create($elmt);

                if ($elmt.hasClass("bracketed")) {
                    var $open_bracket = $elmt.find(".bracket:first");
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

                    console.log($open_bracket, $close_bracket)
                } else {
                    $elmt.removeClass("ui-draggable-dragging");
                    $code.append($elmt);

                    $elmt.css({
                        left: ui.offset.left - $code.position().left,
                        top: ui.offset.top - $code.position().top + 4
                    });

                    $($elmt, $code).draggable({
                        cursor: "move",
                        revert: "invalid",
                        helper: "original",
                        drag: drag
                    });

                    //console.log($elmt.attr("id"));
                }
            }

            if ($elmt.hasClass("magnet")) {
                // 자석 기능
                var $magnet = $code.find(".code-piece.magneted-bottom:first");

                if ($magnet.length > 0) {
                    var npid = $magnet.attr("next-piece-id");

                    attach($magnet, $elmt);

                    if (npid) {
                        var $e = last_piece($elmt);

                        var $next = $("#" + npid);

                        attach($e, $next);
                    }
                    extrude($magnet, $elmt);
                }

                $code.find(".code-piece").removeClass("magneted-bottom");
            }
            releaseTogether($elmt);
        }
    });

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

    // 정렬
    function extrude ($prev, $this)
    {
        var pos = position($prev, $code);
        $this
            .css({
                left: pos.left - $code.position().left,
                top: pos.top - $code.position().top + $prev.height() + 4
            });

        var pid = $this.attr("next-piece-id");

        if (pid) {
            extrude($this, $("#" + pid));
        }
    }

    $tools.droppable({
        accept: ".code .code-piece",
        drop : function (event, ui) {
            ui.draggable.remove();
        }
    });

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
    function drag (event, ui)
    {
        var $elmts = $(".code .magnet"),
            $that = ui.helper;
        var ox = ui.offset.left,
            oy = ui.offset.top;

        if ($that.hasClass("magnet")) {
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

            // 자석 분리 시
            var prev_piece_id = $that.attr("prev-piece-id");
            if (prev_piece_id) {
                $("#" + prev_piece_id)
                    .removeAttr("next-piece-id");

                $that
                    .removeAttr("prev-piece-id");
            }
        }

        // 함께 이동
        moveTogether($that);
    }

    function moveTogether ($this)
    {
        var next_piece_id = $this.attr("next-piece-id");
        $this.addClass("dragging");
        var pos = position($this, $code);
        //console.log(pos)
        if (next_piece_id) {
            var $that = $("#" + next_piece_id);

            $that.css({
                left: pos.left - $code.position().left,
                top: pos.top - $code.position().top + $this.height() + 4
            });

            moveTogether($that);
        }
    }

    function releaseTogether ($this)
    {
        var next_piece_id = $this.attr("next-piece-id");
        $this.removeClass("dragging");
        if (next_piece_id) {
            var $that = $("#" + next_piece_id);

            releaseTogether($that);
        }
    }
});