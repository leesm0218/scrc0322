/**
 * Created by hwss on 2016-05-02.
 */
var scrc;
scrc = scrc || {};
scrc.util = scrc.util || {};

$(function () {
    scrc.util.uniqueId = (function(){
        var id=0;

        return function(){ return "--uq--id--" + id++;}
    })();
});