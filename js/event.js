/**
 * Created by hwss on 2016-07-28.
 */

$(function () {
    $(".main .column1 .screenbar").on("click", ".startbutton", function () {
        //console.log("start");
        //console.log($(".column2 .code .event[action=start]"))
        $(".column2 .code .event[action=start]").trigger("dblclick");
    });
});
