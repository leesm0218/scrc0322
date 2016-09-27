/**
 * Created by hwss on 2016-09-26.
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


    // 동일한 레벨 내에서 제일 위의 블록을 찾는다.
    blocks.findTop = function ($elmt) {
        var pid;
        var $top = $elmt;

        while (pid = $top.attr("prev-piece-id")) {
            $top = $("#" + pid);
        }

        return $top;
    };

    // 괄호를 포함한 제일 위의 블록을 찾는다.
    blocks.findRootBlock = function ($elmt) {
        var $top = blocks.findTop($elmt);

        if ($top.is(".bracket")) {
            return blocks.findRootBlock($top.parent());
        }

        return $top;
    };

    // 같은 레벨 내의 형제들을 순회하는 iterator를 만든다.
    blocks.makeIteratorSiblings = function ($elmt) {
        function makeIter ($e) {
            return {
                now: function () {
                    return $e;
                },
                next: function () {
                    var pid = $e.attr("next-piece-id");

                    if (pid) {
                        return makeIter($("#" + pid));
                    } else {
                        return false;
                    }
                },
                prev: function () {
                    var pid = $e.attr("prev-piece-id");

                    if (pid) {
                        return makeIter($("#" + pid));
                    } else {
                        return false;
                    }
                }
            };
        }

        return makeIter($elmt);
    };

    // 같은 레벨 내의 형제들을 순회한다.
    blocks.circuitSiblings = function ($elmt, callback, last_callback) {
        var iter = blocks.makeIteratorSiblings($elmt);

        function act (iter, circuit) {
            if (iter) {
                callback(iter, circuit);
            } else {
                last_callback && last_callback();
            }
        }

        function circuit () {
            iter = iter.next();

            act(iter, circuit);
        }

        act(iter, circuit);
    };

    // 괄호를 포함한 노드들을 순회한다.
    blocks.circuitTree = function ($elmt, callbacks, callback) {
        var option = {};
        callbacks.before = callbacks.before || function (iter, option, callback) {
                callback();
            };
        callbacks.after = callbacks.after || function (iter, option, callback) {
                callback();
            };

        blocks.circuitSiblings($elmt, function (iter, circuit) {
            var $e = iter.now();

            callbacks.before(iter, option, function () {
                if ($e.is(".bracketed")) {
                    var $opens = $e.find(">.b-open");

                    var loop = util.syncLoop(0, $opens.length, {
                        func: function (i, loop) {
                            var $open = $($opens[i]);

                            blocks.circuitTree($open, callbacks, loop);
                        },
                        done: function () {
                            callbacks.after(iter, option, circuit);
                        }
                    });
                    loop.start();
                } else {
                    callbacks.after(iter, option, circuit);
                }
            });
        }, callback);
    };
});
