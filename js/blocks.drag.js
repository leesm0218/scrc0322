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
            $(".mouseover").removeClass("mouseover");
            $(util.parents(event.target, ".code-piece")[0]).addClass("mouseover");
        })
        .on("mouseleave", ".code-piece", function (event) {
            $(".mouseover").removeClass("mouseover");
        });

    blocks.draggable = function (e, p) {
        $(e, p).draggable({
            cursor: "move",
            //addClasses : ".dragging",
            helper: "clone",
            drag: drag
        });
    };

    var changed_blocks = [];

    function invalidateBlock (block) {
        if (changed_blocks.indexOf(block) == -1) {
            changed_blocks.push(block);
        }
    }

    $code.droppable({
        accept : ".workmenu .code-piece",
        //addClasses : ".dragging",
        drop : function (event, ui) {
            var $elmt = ui.helper;

            // 새것이라면 클론 생성
            if (util.parents($elmt, ".tools").is(".tools")) {
                $elmt = scrc.blocks.create($elmt);

                if ($elmt.hasClass("bracketed")) {
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
                }
                blocks.resizing($elmt)
            } else if (!$elmt.parent().is(".code")) {
                var $outer_space = util.parents($elmt, ".element-space:first");
                var offset = $elmt.offset();

                $code.append($elmt);
                $elmt.css({
                    left: (offset.left - $code.position().left) + "px",
                    top: (offset.top - $code.position().top) + "px"
                });

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
                        invalidateBlock($other_elmt);
                        //blocks.resizing($other_elmt);
                    }
                    $space.find(".default").hide();
                    $space.append($elmt);
                    $space.removeClass("in-space");
                    blocks.resizing($parent);
                }
            } else if ($elmt.hasClass("bracketed")) {
                var $magnet = $code.find(".magneted-bottom:first");

                if ($magnet.length > 0) {
                    var npid = $magnet.attr("next-piece-id");

                    attach($magnet, $elmt);

                    if (npid) {
                        var $e = last_piece($elmt);

                        var $next = $("#" + npid);

                        attach($e, $next);
                    }
                }

                $code.find(".magnet").removeClass("magneted-bottom");
            }
            //extrude($elmt);
            invalidateBlock($elmt);
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

    function findTop ($elmt) {
        var pid;
        var $top = $elmt;

        while (pid = $top.attr("prev-piece-id")) {
            $top = $("#" + pid);
        }

        return $top;
    }

    function findRootBlock ($elmt) {
        var $top = findTop($elmt);

        if ($top.is(".bracket")) {
            return findRootBlock($top.parent());
        }

        return $top;
    }

    function extrude_ () {
        //console.log(changed_blocks.length)
        var block = changed_blocks.shift();

        if (block) {
            var $elmt = util.parents(block, ".code>.code-piece");

            extrude($elmt);
        }
    }

    function positioningBracket (iter) {
        var $elmt = iter.now();
        var $open = $elmt.find(".b-open"),
            $line = $elmt.find(".b-line"),
            $close = $elmt.find(".b-close");

        $line.css({
            top: ($open.height()) + "px"
        });
        $close.css({
            top: ($open.height() + $line.height()) + "px"
        });
        $elmt.css({
            height: $open.height() + $line.height() + $close.height()
        })
    }

    function positioningElmt (iter) {
        var prev_iter = iter.prev();

        if (!prev_iter) return;

        var $elmt = iter.now(),
            $prev = prev_iter.now();

        var pos = position($prev, $code);

        $elmt.css({
            left: pos.left - $code.position().left + ($prev.is(".b-open") ? 19 : 0),
            top: pos.top - $code.position().top + $prev.height() + 1
        });
    }

    function makeIteratorSiblings ($elmt) {
        function makeIter ($e) {
            return {
                now: function () {
                    return $e;
                },
                next: function () {
                    var pid = $e.attr("next-piece-id");

                    if (pid) {
                        return makeIter($("#" + pid));
                    } else {
                        return false;
                    }
                },
                prev: function () {
                    var pid = $e.attr("prev-piece-id");

                    if (pid) {
                        return makeIter($("#" + pid));
                    } else {
                        return false;
                    }
                }
            };
        }

        return makeIter($elmt);
    }

    function circuitSiblings ($elmt, callback) {
        var iter = makeIteratorSiblings($elmt);

        function circuit() {
            iter = iter.next();

            if (iter) {
                callback(iter, circuit);
            }
        }

        if (iter) {
            callback(iter, circuit);
        }
    }

    function circuitTree ($elmt, callbacks, callback) {
        var option = {};

        circuitSiblings($elmt, function (iter, circuit) {
            var $e = iter.now();

            callbacks.topdown(iter, option, function () {
                if ($e.is(".bracketed")) {
                    circuitTree($e.find(">.b-open"), callbacks, function () {
                        callbacks.bottomup(iter, option, circuit);
                    });
                } else {
                    callbacks.bottomup(iter, option, circuit);
                }
            });
        });

        callback && callback();
    }

    // 정렬
    function extrude ($elmt) {
        var $root = findRootBlock($elmt);

        //console.log("start--------------------------")
        circuitTree($root, {
            topdown: function (iter, option, callback) {
                //console.log("topdown")
                positioningElmt(iter);

                callback();
            },
            bottomup: function (iter, option, callback) {
                //console.log("bottomup")
                var $e = iter.now();

                if ($e.is(".bracketed")) {
                    positioningBracket(iter);
                }

                if (!iter.prev()) {
                    option.$top = $e;
                    option.height = 1;
                } else {
                    option.height += parseFloat($e.css("height")) + 1;
                }

                if (!iter.next()) {
                    option.$top.siblings(".b-line").css({
                        height: util.max(option.height, 10)
                    });
                }

                callback();
            }
        });
        //console.log("--------------------------end")
    }

    $tools.droppable({
        accept: ".code .code-piece",
        drop : function (event, ui) {
            remove(ui.helper)
        }
    });

    function remove ($elmt) {
        var $root = findRootBlock($elmt);

        circuitTree($root, {
            topdown: function (iter, option, callback) {
                callback();
            },
            bottomup: function (iter, option, callback) {
                var $e = iter.now();

                $e.remove();

                callback();
            }
        });
    }

    function position ($elmt, $parent) {
        //console.log($elmt, $elmt.position())
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
            invalidateBlock($("#" + prev_piece_id));
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
                    aw = $that.is(".bracketed") ? $that.find(".b-close").width() : $that.width();

                if (ey + eh - 5 <= oy && oy <= ey + eh + 25 &&
                    ex - aw <= ox && ox <= ex + ew + aw) {
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
        // .code의 자식일 경우에만
        if ($this.closest(".code").length == 1) {
            invalidateBlock($this);
        }

        if ($this.hasClass("dragging")) return;

        var $root = findRootBlock($this);
        var zIndexInc = 1;

        circuitTree($root, {
            topdown: function (iter, option, callback) {
                var $e = iter.now();

                $e.addClass("dragging");
                if (!$e.is(".bracketed")) {
                    $e.css({
                        "z-index": ""
                    });
                    $e.css({
                        "z-index": "+=" + zIndexInc
                    });
                    zIndexInc++;
                }

                callback();
            },
            bottomup: function (iter, option, callback) {
                var $e = iter.now();

                if (!$e.is(".bracketed")) {
                    $e.css({
                        "z-index": ""
                    });
                    $e.css({
                        "z-index": "+=" + zIndexInc
                    });
                    zIndexInc++;
                }
                if ($e.is(".bracketed")) {
                    $e.find(".b-close").css({
                        "z-index": ""
                    });
                    $e.find(".b-close").css({
                        "z-index": "+=" + zIndexInc
                    });
                    zIndexInc++;
                }

                callback();
            }
        });
    }

    function releaseTogether ($this)
    {
        invalidateBlock($this);

        var $root = findRootBlock($this);

        circuitTree($root, {
            topdown: function (iter, option, callback) {
                var $e = iter.now();


                $e.removeClass("dragging");
                if (!$e.is(".bracketed")) {
                    $e.css({
                        "z-index": ""
                    });
                }

                callback();
            },
            bottomup: function (iter, option, callback) {
                var $e = iter.now();

                $e.css({
                    "z-index": ""
                });
                if ($e.is(".bracketed")) {
                    $e.find(".b-close").css({
                        "z-index": ""
                    });
                }

                callback();
            }
        });
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