/**
 * Created by hwss on 2016-07-28.
 */

$(function () {
    var blocks = scrc.namespace("blocks");

    $(".main .column1 .screenbar").on("click", ".startbutton", function () {
        //console.log("start");
        //console.log($(".column2 .code .event[action=start]"))
        $(".column2 .code .event[action=start]").trigger("dblclick");
    });

    $(".main .column2 .workmenu").on("mouseenter", ".variable.element", function () {
        var $this = $(this);

        blocks.calculate($this, function (value) {
            $this.attr("title", value);
        });
    });
});
