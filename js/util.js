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

$(function () {
    var util = scrc.namespace("util");

    util.uniqueId = (function(){
        var id=0;

        return function(){ return "--uq--id--" + id++;}
    })();
});