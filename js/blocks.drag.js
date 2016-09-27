var scrc;
scrc = scrc || {};

$(function () {
    var blocks = scrc.namespace("blocks");
    var main_screen = scrc.namespace("main_screen");
    var util = scrc.namespace("util");

    var $workmenu = $(".workmenu");
    // var $tools = $workmenu.find(".tools");
    var $code = $workmenu.find(".code");


    var changed_blocks = [];

    // 블록을 다시 정렬하기 위해 큐에 넣음.
    blocks.invalidateBlock = function (block) {
        if (changed_blocks.indexOf(block) == -1) {
            changed_blocks.push(block);
        }
    };

    // 높이 정렬
    blocks.alignmentHeight = function ($elmt) {
        var $root = blocks.findRootBlock($elmt);

        blocks.circuitTree($root, {
            after: function (iter, option, callback) {
                var $e = iter.now();

                if ($e.is(".bracketed")) {
                    fixupBracket(iter);
                }

                if (!iter.prev()) {
                    option.$top = $e;
                    option.height = 1;
                } else {
                    option.height += parseFloat($e.css("height")) + 1;
                }

                if (!iter.next()) {
                    option.$top.find("~.b-line:first").css({
                        height: util.max(option.height, 10)
                    });
                }

                callback();
            }
        });
    };

    // 위치 정렬
    blocks.alignmentLocation = function ($elmt) {
        var $root = blocks.findRootBlock($elmt);

        blocks.circuitTree($root, {
            before: function (iter, option, callback) {
                fixupBlock(iter);

                callback();
            }
        });
    };

    blocks.drag = function (event, ui) {
        // console.log("drag start")
        var $that = ui.helper;

        checkConditions(ui);

        // 함께 이동
        moveTogether($that);
    };

    blocks.drop = function (event, ui) {
        var $elmt = ui.helper;

        if (util.parents($elmt, ".tools").is(".tools")) {
            // 새것이라면 클론 생성
            $elmt = blocks.create($elmt);

            if ($elmt.hasClass("bracketed")) {
                // 괄호 블럭일 경우
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
                    drag: blocks.drag
                });
            } else {
                // 괄호 블럭이 아닌 경우
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
                    drag: blocks.drag
                });
            }
            blocks.resizing($elmt)
        } else if (!$elmt.parent().is(".code")) {
            // tool에 있던 것은 아니지만 code에도 없었다.
            // = 코드 내에 있던 엘리먼트
            var $outer_space = util.parents($elmt, ".code>.code-piece:first");
            var offset = $elmt.offset();

            $code.append($elmt);
            $elmt.css({
                left: (offset.left - $code.position().left) + "px",
                top: (offset.top - $code.position().top) + "px"
            });

            blocks.resizing($outer_space);
            blocks.invalidateBlock($outer_space);
            blocks.alignmentHeight($outer_space);
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
            // 엘리먼트
            //var $pre_space = util.parents($elmt, ".code>.code-piece");
            //console.log($pre_space)
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
                    blocks.invalidateBlock($other_elmt);
                    blocks.alignmentHeight($other_elmt);
                    //blocks.resizing($other_elmt);
                }
                $space.find(".default").hide();
                $space.append($elmt);
                $space.removeClass("in-space");
                blocks.resizing($parent);
                blocks.alignmentHeight($parent);
            }
        } else if ($elmt.hasClass("bracketed")) {
            // 괄호
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
        //blocks.alignmentHeight($elmt);
        blocks.invalidateBlock($elmt);
        blocks.alignmentHeight($elmt);
        blocks.releaseTogether($elmt);
        $(".mouseover").removeClass("mouseover");
    };

    blocks.remove = function ($elmt) {
        var $root = blocks.findRootBlock($elmt);

        blocks.circuitTree($root, {
            before: function (iter, option, callback) {
                callback();
            },
            after: function (iter, option, callback) {
                var $e = iter.now();
                var $outer_block = util.parents($e, ".code>.code-piece");

                if (!$e.is(".code>.code-piece")) {
                    $e.remove();

                    blocks.resizing($outer_block);
                    blocks.invalidateBlock($outer_block);
                    blocks.alignmentHeight($outer_block);
                } else {
                    $e.remove();
                }

                callback();
            }
        });
    };

    blocks.releaseTogether = function ($this) {
        blocks.invalidateBlock($this);
        blocks.alignmentHeight($this);

        var $root = blocks.findRootBlock($this);

        blocks.circuitTree($root, {
            before: function (iter, option, callback) {
                var $e = iter.now();


                $e.removeClass("dragging");
                if (!$e.is(".bracketed")) {
                    $e.css({
                        "z-index": ""
                    });
                }

                callback();
            },
            after: function (iter, option, callback) {
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
    };

    scrc.refresh = function () {
        requestAnimationFrame(scrc.refresh);
        //console.log(changed_blocks.length);
        realignment();
    }

    // 괄호의 위치와 높이를 정해준다.
    function fixupBracket (iter) {
        var $elmt = iter.now();
        var $opens = $elmt.find(">.b-open"),
            $lines = $elmt.find(">.b-line"),
            $close = $elmt.find(">.b-close");
        var height = 0;

        $opens.each(function (i, e) {
            var $open = $($opens[i]);
            var $line = $($lines[i]);

            $open.css({
                top: height + "px"
            });
            $line.css({
                top: (height + $open.height()) + "px"
            });
            height += $open.height() + $line.height();
        });

        $close.css({
            top: height + "px"
        });

        $elmt.css({
            height: height + $close.height()
        })
    }

    // 같은 레벨 내의 상위 블럭에 맞춰 위치를 정해준다.
    function fixupBlock (iter) {
        var prev_iter = iter.prev();

        if (!prev_iter) return;

        var $elmt = iter.now(),
            $prev = prev_iter.now();

        var pos = blocks.position($prev, $code);

        $elmt.css({
            left: pos.left - $code.position().left + ($prev.is(".b-open") ? 19 : 0),
            top: pos.top - $code.position().top + $prev.height() + 1
        });
    }

    // 다시 정렬하기
    function realignment () {
        var block = changed_blocks.shift();

        if (block) {
            var $elmt = util.parents(block, ".code>.code-piece");

            //blocks.alignmentHeight($elmt);
            blocks.alignmentLocation($elmt);
        }
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
            blocks.invalidateBlock($("#" + prev_piece_id));
            blocks.alignmentHeight($("#" + prev_piece_id));
        }

        //$that.addClass("dragging");
        // 마그넷 기능
        //console.log("code-sec 내부 N: " + $elmts.length + "{");
        for (var i = 0; i < $elmts.length; i++) {
            var $this = $($elmts[i]);

            if ($this.attr("id") != $that.attr("id")) {
                var epos = blocks.position($this, $code);
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
            /*var $outer_block = util.parents($outer_space, ".code>.code-piece");
            var outer_offset = $outer_block.offset();
            var offset = $that.offset();

            console.log(offset)
            console.log(outer_offset)
            $code.append($that);*/

            $outer_space.find(">.default").show();

            /*blocks.resizing($outer_block);
            blocks.invalidateBlock($outer_block);
            blocks.alignmentHeight($outer_block);
            blocks.resizing($that);*/
        }

        // 마그넷 기능

        for (var i = 0; i < $spaces.length; i++) {
            var size = 999;
            var $space = $($spaces[i]);

            if ($that.attr("id") == undefined || $space.attr("id") != $that.attr("id")) {
                var epos = blocks.position($space, $code);
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

    // 마지막 피스
    function last_piece ($elmt) {
        var pid, $e = $elmt;

        while (pid = $e.attr("next-piece-id")) {
            $e = $("#" + pid);
        }

        return $e;
    }

    // 서로 붙힘
    function attach ($elmt, $next) {
        $elmt
            .attr({
                "next-piece-id": $next.attr("id")
            });

        $next
            .attr({
                "prev-piece-id": $elmt.attr("id")
            });
    }

    function moveTogether ($this) {
        // .code의 자식일 경우에만
        if ($this.closest(".code").length == 1) {
            blocks.invalidateBlock($this);
            blocks.alignmentHeight($this);
        }

        if ($this.hasClass("dragging")) return;

        var $root = blocks.findRootBlock($this);
        var zIndexInc = 1;

        blocks.circuitTree($root, {
            before: function (iter, option, callback) {
                var $e = iter.now();

                $e.addClass("dragging");
                $e.css({
                    "z-index": ""
                });
                $e.css({
                    "z-index": "+=" + zIndexInc
                });
                zIndexInc++;
                if (!$e.is(".bracketed")) {
                }

                callback();
            },
            after: function (iter, option, callback) {
                var $e = iter.now();

                callback();
            }
        });
    }
});

$(function () {
    scrc.refresh();
});