/**
 * Created by hwss on 2016-09-22.
 */

var scrc;
scrc = scrc || {};

$(function () {
    var util = scrc.namespace("util");
    var blocks = scrc.namespace("blocks");

    var uniqueVariableId = (function(){
        var id=0;

        return function(){ return "variable" + id++;}
    })();

    $(".toolboxes").on("click", "#create_variable", function () {
        console.log("변수 생성")
        util.loadTemplate(".scrc-template.code-piece.variable", function (template) {
            var $div = $("<div>").append(template);
            var $elmt = $div.find(">.code-piece.variable.element");
            var id = uniqueVariableId();

            $elmt.attr("variable-id", id);
            $elmt.find(".text").text(id.replace("variable", "변수"));

            blocks.addUl($elmt, ".toolbox[value=09]");
            if ($elmt.is(".code-piece")) {
                blocks.draggable($elmt, ".toolbox");
                blocks.resizing($elmt);
                blocks.alignmentHeight($elmt);
            }
        })
    });
});
