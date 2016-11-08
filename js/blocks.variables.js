/**
 * Created by hwss on 2016-09-22.
 */

var scrc;
scrc = scrc || {};

$(function () {
    var util = scrc.namespace("util");
    var blocks = scrc.namespace("blocks");
    var variables = scrc.namespace("blocks.variables");

    var uniqueVariableId = function(){
        return "variable" + uniqueVariableId.id++;
    };
    uniqueVariableId.id=0;

    var promptName = function () {
        var name = prompt("변수명을 입력하세요.", "변수" + uniqueVariableId.id);

        if (name == null) return null;

        var name_is_vaild = /^[A-Za-z_가-힣]{1}[A-Za-z0-9_가-힣]{0,19}$/.test(name),
            name_is_duplicate = name_is_vaild && $(".variable.element[variable-name=" + name + "]").length != 0;

        while (!name_is_vaild || name_is_duplicate) {
            name = prompt("변수명을 다시 입력하세요" +
                (!name_is_vaild ? "(이름이 유효하지 않습니다)" :
                    name_is_duplicate ? "(이름이 중복되었습니다)" : ""));

            if (name == null) return null;

            name_is_vaild = /^[A-Za-z_가-힣]{1}[A-Za-z0-9_가-힣]{0,19}$/.test(name);
            name_is_duplicate = name_is_vaild && $(".variable.element[variable-name=" + name + "]").length != 0;
        }

        return name;
    };

    $(".toolboxes").on("click", "#create_variable", function () {
        console.log("변수 생성")
        util.loadTemplate(".scrc-template.code-piece.variable", function (template) {
            var name = promptName();

            if (name == null) return;

            var $div = $("<div>").append(template);
            var $elmt = $div.find(">.code-piece.variable.element");
            var id = uniqueVariableId();

            $elmt.attr("variable-id", id);
            $elmt.attr("variable-name", name);
            variables[id] = 0;
            $elmt.find(".text:first").text(name);

            blocks.addUl($elmt, ".toolbox[value=09]");
            if ($elmt.is(".code-piece")) {
                blocks.draggable($elmt, ".toolbox");
                blocks.resizing($elmt);
                blocks.alignmentHeight($elmt);
            }
        });
    });
});
