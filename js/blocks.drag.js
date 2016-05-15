var scrc;
scrc = scrc || {};



$(function () {
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
});

$(function () {
    /*
    var $tool_sec = $("#script-tab .tool-sec");
    var $code_sec = $("#script-tab .code-sec");

    $(".code-piece", $tool_sec).draggable({
        cursor : "move",
        drag : function (event, ui) {
            console.log("drag");
        }
    });

    $code_sec.droppable({
        accept : ".tool-sec .code-piece",
        drop : function (event, ui) {

        }
    });

    $tool_sec.droppable({
        accept: ".code-sec .code-piece",
        drop : function (event, ui) {

        }
    })
    */
});