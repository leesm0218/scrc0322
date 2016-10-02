/**
 * Created by hwss on 2016-09-27.
 */

var scrc;
scrc = scrc || {};

$(function () {
    var blocks = scrc.namespace("blocks");
    var main_screen = scrc.namespace("main_screen");
    var util = scrc.namespace("util");

    var $workmenu = $(".workmenu");
    var $tools = $workmenu.find(".tools");
    var $code = $workmenu.find(".code");


    blocks.draggable = function (e, p) {
        $(e, p).draggable({
            cursor: "move",
            //addClasses : ".dragging",
            helper: "clone",
            drag: blocks.drag
        });
    };

    $workmenu
        .on("mouseover", ".code-piece", function (event) {
            $(".mouseover").removeClass("mouseover");
            $(util.parents(event.target, ".code-piece")[0]).addClass("mouseover");
        })
        .on("mouseleave", ".code-piece", function (event) {
            $(".mouseover").removeClass("mouseover");
        });

    $code.droppable({
        accept : ".workmenu .code-piece",
        //addClasses : ".dragging",
        drop : blocks.drop
    });

    $tools.droppable({
        accept: ".code .code-piece",
        drop : function (event, ui) {
            blocks.remove(ui.helper)
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
});