/**
 * Created by Choi on 2016-08-01.
 */

var scrc;
scrc = scrc || {};

$(function () {

    var util = scrc.namespace("util");
    var script = scrc.namespace("script");

    /* 파일 추가시 스크립트 추가, 일단 파일경로(fakepath)만 */
    script.add = function () {
        var li = document.createElement("li");
        var inputValue = document.getElementById("input").value;
        var t = document.createTextNode(inputValue);
        li.appendChild(t);
        document.getElementById("sprite_list").appendChild(li);
    };


    /* 라디오버튼처럼 하나만 selected되도록 */
    /*
    var list = document.querySelector('ul#sprite_list');
    list.addEventListener('click', function(ev) {
        var tm = document.getElementsByTagName("li");
        for(i=0; i<tm.length; i++){
            tm[i].className = "";
        };
        if (ev.target.tagName === 'LI') {
            ev.target.classList.toggle('selected');
        }
    }, false);
    */

});