/**
 * Created by hwss on 2016-05-12.
 */

var scrc;
scrc = scrc || {};


$(function () {
    // 코드 조각들을 클릭하면 코드가 동작한다.
    // TODO: 말풍선으로 출력하도록 바꾼다.
    // TODO: 제어부의 경우 타이머를 통해 불연속적으로 동작해야 하므로 바꿔야 한다.
    var $workmenu = $(".workmenu");

    $workmenu.on("dblclick",
        [
            ".code-piece.operator",
            ".code-piece.movement.element"
        ].join(", "),
        function (event) {
            var $this = $(this);
            var $parent = $this.parents(".code-piece.element");

            while ($parent.length != 0) {
                $this = $parent;
                $parent = $parent.parents(".code-piece.element");

            }
            var binary = scrc.namespace("blocks.calc");
            var calc = binary[$this.attr("calc")].calc;

            console.log(calc($this[0]));
            return false;
        });

    $workmenu.on("dblclick",
        [
            ".code-piece.movement:not(.element)",
            ".code-piece.event:not(.element)",
            ".code-piece.control:not(.element)"
        ].join(", "),
        function (event) {
            var actions = scrc.namespace("blocks.actions");
            var $this = $(this), pid;

            // 최상위 코드조각 찾기
            while (pid = $this.attr("prev-piece-id")) {
                $this = $("#" + pid);
            }

            // 동작을 타이머로 끊어서 실행한다.
            var timer = function ($that) {
                return function () {
                    var pid;

                    // 코드조각을 실행하고
                    var action = actions[$that.attr("action")].action;
                    action($that[0], function (elmt) {
                        var $that = $(elmt);
                        // 하위 코드조각으로 들어가기
                        if (pid = $that.attr("next-piece-id")) {
                            //console.log(3);
                            setTimeout(timer($("#" + pid)), 1);
                        } else {
                            // 최하위 코드조각이면
                            // 상위 코드조각으로 올라가면서 동작중 표시 지우기
                            var $t = $that;
                            while (pid = $t.attr("prev-piece-id")) {
                                $t.removeClass("acting");
                                $t = $("#" + pid);
                            }
                            $t.removeClass("acting");
                        }
                    });
                }
            };

            // 하위 코드조각을 순회하며 동작중 표시하기
            var $t = $this;
            $t.addClass("acting");
            while (pid = $t.attr("next-piece-id")) {
                $t = $("#" + pid);
                $t.addClass("acting");
            }

            // 동작 시작
            setTimeout(timer($this), 1);

            return false;
        });
});
