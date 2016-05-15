var scrc;
scrc = scrc || {};



$(function () {
    /*
    var util = scrc.namespace("util");
    var blocks = scrc.namespace("blocks");

    var parents = function  (target, parent) {
        var $target = $(target);

        if (!$target.is(parent)) {
            $target = $target.parents(parent);
        }

        return $target;
    };

    var drag_info = {};

    $("#script-tab")
        .on("mouseover", ".code-piece", function (event) {
            parents(event.target, ".code-piece").addClass("mouseover");
        })
        .on("mouseout", ".code-piece", function (event) {
            parents(event.target, ".code-piece").removeClass("mouseover");
        });

    $(".tool-sec")
        .on("mousedown", ".code-piece", function (event) {
            var $target = $(event.target);

            if ($target.is(".code-piece")) {
                drag_info.$target = $target;
                drag_info.x = event.clientX - $target.position().left;
                drag_info.y = event.clientY - $target.position().top;
            }
        });

    $("#script-tab .code-sec")
        .on("mouseenter", function () {
            console.log(this.className + true);
            drag_info.code_sec_over = true;
        })
        .on("mouseleave", function () {
            console.log(this.className + false);
            if (!drag_info.draging) {
                drag_info.code_sec_over = false;
            }
        });

    $(window)
        .on("mousemove", function (event) {
            if (!drag_info.draging) {
                if (drag_info.$target != undefined) {
                    var dist = util.distance(drag_info.x, drag_info.y, event.clientX, event.clientY);

                    if (dist >= 10) {
                        drag_info.$target = blocks.create(drag_info.$target).appendTo("main");
                        drag_info.$target.addClass("draging");
                        drag_info.$target.css({
                            left: event.clientX -  drag_info.x,
                            top: event.clientY - drag_info.y
                        });
                        drag_info.draging = true;
                    }
                }
            } else {
                drag_info.$target.css({
                    left: event.clientX - drag_info.x,
                    top: event.clientY - drag_info.y
                });
            }
        })
        .on("mouseup", function (event) {
            if (drag_info.draging) {
                if (drag_info.$target != undefined) {
                    console.log(drag_info.code_sec_over);
                    if (drag_info.code_sec_over) {
                        drag_info.$target.appendTo($("#script-tab .code-sec"));
                        drag_info.$target.removeClass("draging");
                    } else {
                        drag_info.$target.remove();
                    }
                }
            }
            drag_info = {};
        });
        */
});

$(function () {
    var util = scrc.namespace("util");

    var $tool_sec = $("#script-tab .tool-sec");
    var $code_sec = $("#script-tab .code-sec");

    $(".code-piece", $tool_sec).draggable({
        cursor : "move",
        helper : "clone",
        drag : drag
    });

    $code_sec.droppable({
        accept : "#script-tab .code-piece",
        drop : function (event, ui) {
            var $elmt = ui.helper;

            // 새것이라면 클론 생성
            if (!$elmt.hasClass("created")) {
                /*$elmt = ui.helper.clone();
                $elmt.attr("id", util.uniqueId())
                    .addClass("created");*/
                $elmt = scrc.blocks.create($elmt).addClass("created");

                $code_sec.append($elmt);

                $elmt.css({
                    left: ui.offset.left - $code_sec.position().left,
                    top: ui.offset.top - $code_sec.position().top
                });

                $($elmt, $code_sec).draggable({
                    cursor: "move",
                    revert: "invalid",
                    helper: "original",
                    drag: drag
                });
                //console.log($elmt.attr("id"));
            }

            // 자석 기능
            var $magnet = $code_sec.find(".code-piece.magnet-bottom");

            if ($magnet.length > 0) {
                $magnet
                    .attr({
                        "next-piece-id" : $elmt.attr("id")
                    });

                $elmt
                    .css({
                        left: $magnet.position().left,
                        top: $magnet.position().top + $magnet.height()
                    })
                    .attr({
                        "prev-piece-id" : $magnet.attr("id")
                    });
            }

            $code_sec.find(".code-piece").removeClass("magnet-bottom");
        }
    });

    $tool_sec.droppable({
        accept: ".code-sec .code-piece",
        drop : function (event, ui) {
            ui.draggable.remove();
        }
    });

    function drag (event, ui)
    {
        var $elmts = $(".code-sec .code-piece"),
            $that = ui.helper;
        var ox = ui.offset.left,
            oy = ui.offset.top;

        // 마그넷 기능
        //console.log("code-sec 내부 N: " + $elmts.length + "{");
        $elmts.each(function (i) {
            var $this = $(this);

            if ($this.attr("id") != $that.attr("id")) {
                var ex = $this.position().left + $code_sec.position().left,
                    ey = $this.position().top + $code_sec.position().top,
                    ew = $this.width(),
                    eh = $this.height();

                if (ey + eh - 5 <= oy && oy <= ey + eh + 20 &&
                    ex - 20 <= ox && ox <= ex + ew + 5) {
                    $this.addClass("magnet-bottom");
                } else {
                    $this.removeClass("magnet-bottom");
                }
            }
        });
       // console.log("}\n" + ox + ", " + oy);

        // 함께 이동
        moveTogether($that);

        // 자석 분리 시
        var prev_piece_id = $that.attr("prev-piece-id");
        if (prev_piece_id) {
            $("#" + prev_piece_id)
                .removeAttr("next-piece-id");

            $that
                .removeAttr("prev-piece-id");
        }
    }

    function moveTogether ($this)
    {
        var next_piece_id = $this.attr("next-piece-id");
        if (next_piece_id) {
            var $that = $("#" + next_piece_id);

            $that.css({
                left: $this.position().left,
                top: $this.position().top + $this.height()
            });

            moveTogether($that);
        }
    }
});