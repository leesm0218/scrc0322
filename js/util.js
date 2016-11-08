/**
 * Created by hwss on 2016-05-02.
 */
var scrc;
scrc = scrc || {};

scrc.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
        parent = scrc,
        i;

    if (parts[0] === "scrc") {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i++) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }

        parent = parent[parts[i]];
    }

    return parent;
};

(function () {
    var util = scrc.namespace("util");

    util.uniqueId = (function(){
        return function(){ return "--uq--id--" + Math.floor(Math.random() * (Math.pow(2, 31)));}
    })();

    util.min = function (a, b) {
        return a > b ? b : a;
    };

    util.max = function (a, b) {
        return a < b ? b : a;
    };

    util.distance = function (x, y, px, py) {
        return Math.pow(Math.pow(px - x, 2) + Math.pow(py - y, 2), 0.5);
    };

    util.rad2deg = function (angle) {
        return angle * Math.PI / 180;
    };

    util.deg2rad = function (angle) {
        return angle / Math.PI * 180;
    };

    util.syncLoop = function (start, end, option) {
        var i = start, stoped = false;

        var loop = function () {
            if (!stoped && i < end) {
                //setTimeout(function () {
                    option.func(i++, loop);
                //}, 100);
            } else if (stoped) {
                stoped = false;
            } else {
                option.done();
            }
        };

        return {
            start: function () {
                loop();
            },
            stop: function () {
                stoped = true;
            }
        }
    };

    var wait_templates = [];

    util.loadTemplate = function (template, callback) {
        if (wait_templates && wait_templates.length == 0) {
            wait_templates.push([template, callback]);

            // $.get("template/code_piece.html", function (data) {
            setTimeout(function (data) {
                $("body").append(data);

                util.loadTemplate = function (template, callback) {
                    callback($(template + ">").clone());

                    return util;
                };

                for (var i = 0; i < wait_templates.length; i++) {
                    var t = wait_templates[i];

                    util.loadTemplate(t[0], t[1]);
                }
                wait_templates = undefined;
            }, 100);
        } else {
            wait_templates.push([template, callback]);
        }

        return util;
    };

    util.parents = function  (target, parent) {
        var $target = $(target);

        if (!$target.is(parent)) {
            $target = $target.parents(parent);
        }

        return $target;
    };
}());