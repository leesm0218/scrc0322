/**
 * Created by hwss on 2016-05-12.
 */

var scrc;
scrc = scrc || {};


$(function () {
    // 코드 조각들을 클릭하면 코드가 동작한다.
    // TODO: 말풍선으로 출력하도록 바꾼다.

    var $workmenu = $(".workmenu");
    var blocks = scrc.namespace("blocks");

    function findRootElement ($elmt) {
        var $parent = $elmt.parents(".code-piece.element");

        while ($parent.length != 0) {
            $elmt = $parent;
            $parent = $parent.parents(".code-piece.element");
        }

        return $elmt;
    }

    function turnon ($elmt) {
        blocks.circuitTree($elmt, {
            before: function (iter, option, callback) {
                var $e = iter.now();

                $e.addClass("acting");

                callback();
            }
        });
    }

    function turnoff ($elmt) {
        blocks.circuitTree($elmt, {
            before: function (iter, option, callback) {
                var $e = iter.now();

                $e.removeClass("acting");

                callback();
            }
        });
    }

    blocks.calculate = function ($elmt, callback) {
        var binary = scrc.namespace("blocks.calc");
        var calc = binary[$elmt.attr("calc")].calc;

        callback(calc($elmt[0]));
    };

    blocks.execute = function ($elmt, callback, option) {
        option = option || {};

        blocks.circuitSiblings($elmt, function (iter, circuit) {
            var $e = iter.now();
            var actions = scrc.namespace("blocks.actions");
            var action = actions[$e.attr("action")].action;

            requestAnimationFrame(function () {
                action($e, circuit, option);
            });
        }, callback);
    };

    $workmenu.on("dblclick",
        [
            ".code-piece.operator",
            ".code-piece.movement.element",
            ".code-piece.variable.element"
        ].join(", "),
        function (event) {
            var $elmt = $(this);
            $elmt = findRootElement($elmt);

            blocks.calculate($elmt, console.log);

            return false;
        });

    $workmenu.on("dblclick",
        [
            ".code-piece.movement:not(.element)",
            ".code-piece.event:not(.element)",
            ".code-piece.control:not(.element)",
            ".code-piece.data:not(.element)"
        ].join(", "),
        function (event) {
            var $this = $(this);
            $this = blocks.findRootBlock($this);

            if (!$this.is(".acting")) {
                turnon($this);
                blocks.execute($this, function () {
                    turnoff($this);
                });
            }

            return false;
        });
});
