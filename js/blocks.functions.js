/**
 * Created by hwss on 2016-10-06.
 */

var scrc;
scrc = scrc || {};

$(function () {
    var util = scrc.namespace("util");
    var blocks = scrc.namespace("blocks");
    var functions = scrc.namespace("blocks.functions");

    var uniqueFunctionId = function(){
        return "function" + uniqueFunctionId.id++;
    };
    uniqueFunctionId.id=0;

    var promptName = function () {
        var name = prompt("함수명을 입력하세요.", "함수" + uniqueFunctionId.id);

        if (name == null) return null;

        var name_is_vaild = /^[A-Za-z_가-힣]{1}[A-Za-z0-9_가-힣]{0,19}$/.test(name),
            name_is_duplicate = name_is_vaild && $(".function[function-name=" + name + "]").length != 0;

        while (!name_is_vaild || name_is_duplicate) {
            name = prompt("함수명을 다시 입력하세요" +
                (!name_is_vaild ? "(이름이 유효하지 않습니다)" :
                    name_is_duplicate ? "(이름이 중복되었습니다)" : ""));

            if (name == null) return null;

            name_is_vaild = /^[A-Za-z_가-힣]{1}[A-Za-z0-9_가-힣]{0,19}$/.test(name);
            name_is_duplicate = name_is_vaild && $(".function[function-name=" + name + "]").length != 0;
        }

        return name;
    };

    $(".toolboxes").on("click", "#create_function", function () {
        console.log("함수 생성")
        var name = promptName();

        if (name == null) return;

        var id = uniqueFunctionId();

        util.loadTemplate(".scrc-template.code-piece.function", function (template) {
            var $div = $("<div>").append(template);
            var $elmt = $div.find(">.code-piece.function");

            $elmt.attr("function-id", id);
            $elmt.attr("function-name", name);
            functions[id] = 0;
            $elmt.find(".text:first").text(name);

            blocks.addUl($elmt, ".toolbox[value=10]");
            if ($elmt.is(".code-piece")) {
                blocks.draggable($elmt, ".toolbox");
                blocks.resizing($elmt);
                blocks.alignmentHeight($elmt);
            }
        });
        util.loadTemplate(".scrc-template.code-piece.function-define", function (template) {
           /* var $div = $("<div>").append(template);
            var $elmt = $div.find(">.code-piece.function-define");

            $elmt.attr("function-id", id);
            $elmt.attr("function-name", name);
            functions[id] = 0;
            $elmt.find(".text:first").text(name);

            console.log("함수 정의하기1")
            $(".code").append(blocks.create($elmt));
            console.log("함수 정의하기2")
            if ($elmt.is(".code-piece")) {
                console.log("함수 정의하기3")
                blocks.draggable($elmt, ".code");
                console.log("함수 정의하기4")
                blocks.resizing($elmt);
                console.log("함수 정의하기5")
                //blocks.alignmentHeight($elmt);
                console.log("함수 정의하기6")
            }
            console.log("함수 정의하기7")*/
        });
    });
});
