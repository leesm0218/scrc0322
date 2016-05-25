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

    util.distance = function (x, y, px, py) {
        return Math.pow(Math.pow(px - x, 2) + Math.pow(py - y, 2), 0.5);
    };

    util.rad2deg = function (angle) {
        return angle * Math.PI / 180;
    };

    util.deg2rad = function (angle) {
        return angle / Math.PI * 180;
    };

    var checkSupportsImport = function () {
        //console.log( 'import' in document.createElement('link') );

        return 'import' in document.createElement('link');
    };

    var wait_templates = [];

    util.loadTemplate = function (template, callback) {
        if ( checkSupportsImport && checkSupportsImport() ){
            checkSupportsImport = undefined;
            var link = document.createElement('link');

            link.rel = 'import';
            link.href = "template/code_piece.html";

            wait_templates.push([template, callback]);

            link.onload = function(e) {
                var loadHtmlFile = this.import.querySelector('html');
                var contents  = document.querySelector('body');

                contents.appendChild(loadHtmlFile.cloneNode(true));

                util.loadTemplate = function (template, callback) {
                    var t = document.querySelector(template);

                    var clone = document.importNode(t.content, true);

                    callback(clone);

                    return util;
                };

                for (var i = 0; i < wait_templates.length; i++) {
                    var t = wait_templates[i];

                    util.loadTemplate(t[0], t[1]);
                }
                wait_templates = undefined;
            };

            document.head.appendChild(link);
        } else if (!checkSupportsImport) {
            wait_templates.push([template, callback]);
        } else {
            alert("template 파일 로드 실패");
        }

        return util;
    };
}());