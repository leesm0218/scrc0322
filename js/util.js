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
        var id=0;

        return function(){ return "--uq--id--" + id++;}
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

    util.composition = function (func1, func2) {
        func2(func1());
    };

    var wait_templates = [];

    util.loadTemplate = function (template, callback) {
        if (wait_templates && wait_templates.length == 0) {
            wait_templates.push([template, callback]);

            $.get("template/code_piece.html", function (data) {
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
            });
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