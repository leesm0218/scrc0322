var scrc;
scrc = scrc || {};

$(function () {
    var blocks = scrc.namespace("blocks");
    var main_screen = scrc.namespace("main_screen");
    var util = scrc.namespace("util");

    var $tool_sec = $("#script-tab .tool-sec");
    var $code_sec = $("#script-tab .code-sec");

    var parents = function  (target, parent) {
        var $target = $(target);

        if (!$target.is(parent)) {
            $target = $target.parents(parent);
        }

        return $target;
    };

    $("#script-tab")
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

    blocks.draggable(".code-piece", $tool_sec);

    $code_sec.droppable({
        accept : "#script-tab .code-piece",
        //addClasses : ".dragging",
        drop : function (event, ui) {
            var $elmt = ui.helper;

            // 새것이라면 클론 생성
            if (parents($elmt, ".tool-sec").is(".tool-sec")) {
                $elmt = scrc.blocks.create($elmt);
                $elmt.removeClass("ui-draggable-dragging");
                $code_sec.append($elmt);

                $elmt.css({
                    left: ui.offset.left - $code_sec.position().left,
                    top: ui.offset.top - $code_sec.position().top + 4
                });

                $($elmt, $code_sec).draggable({
                    cursor: "move",
                    revert: "invalid",
                    helper: "original",
                    drag: drag
                });
                //console.log($elmt.attr("id"));
            }

            if ($elmt.hasClass("magnet")) {
                // 자석 기능
                var $magnet = $code_sec.find(".code-piece.magnet-bottom:first");

                if ($magnet.length > 0) {
                    var npid = $magnet.attr("next-piece-id");

                    $magnet
                        .attr({
                            "next-piece-id": $elmt.attr("id")
                        });

                    $elmt
                        .attr({
                            "prev-piece-id": $magnet.attr("id")
                        });

                    if (npid) {
                        var pid, $e = $elmt;

                        while (pid = $e.attr("next-piece-id")) {
                            $e = $("#" + pid);
                        }

                        var $next = $("#" + npid);

                        $e
                            .attr({
                                "next-piece-id": npid
                            });

                        $next
                            .attr({
                                "prev-piece-id": $e.attr("id")
                            })
                    }
                    extrude($magnet, $elmt);
                }

                $code_sec.find(".code-piece").removeClass("magnet-bottom");
            }
            releaseTogether($elmt);
        }
    });

    $tool_sec.droppable({
        accept: ".code-sec .code-piece",
        drop : function (event, ui) {
            ui.draggable.remove();
        }
    });

    function extrude ($prev, $this)
    {
        $this
            .css({
                left: $prev.position().left,
                top: $prev.position().top + $prev.height() + 4
            });

        var pid = $this.attr("next-piece-id");

        if (pid) {
            extrude($this, $("#" + pid));
        }
    }

    function drag (event, ui)
    {
        var $elmts = $(".code-sec .code-piece.magnet"),
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
                    var ex = $this.position().left + $code_sec.position().left,
                        ey = $this.position().top + $code_sec.position().top,
                        ew = $this.width(),
                        eh = $this.height(),
                        aw = $that.width();

                    if (ey + eh - 5 <= oy && oy <= ey + eh + 15 &&
                        ex - aw - 5 <= ox && ox <= ex + ew + 5) {
                        $elmts.removeClass("magnet-bottom");
                        $this.addClass("magnet-bottom");
                        break;
                    } else {
                        $this.removeClass("magnet-bottom");
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
        if (next_piece_id) {
            var $that = $("#" + next_piece_id);

            $that.css({
                left: $this.position().left,
                top: $this.position().top + $this.height() + 4
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