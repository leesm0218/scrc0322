/**
 * Created by Choi on 2016-08-01.
 */

var scrc;
scrc = scrc || {};


$(function () {
    var main_screen = scrc.namespace("main_screen");
    var util = scrc.namespace("util");
    var script = scrc.namespace("script");

    // Create X(close) button and append it to each list item
    var myNodelist = document.getElementsByTagName("LI");
    var i;
    for (i =  0; i < myNodelist.length; i++) {
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        myNodelist[i].appendChild(span);
    }

// Click on a close button to hide the current list item
    var close = document.getElementsByClassName("close");
    var i;
    for (i =  0; i < close.length; i++) {
        close[i].onclick = function() {
            var div = this.parentElement;
            div.style.display = "none";
        }
    }


    /* 파일 추가시 스크립트 추가, 일단 파일경로(fakepath)만 */
    script.add = function () {
        var li = document.createElement("li");
        var inputValue = document.getElementById("input").value;
        var t = document.createTextNode(inputValue);
        li.appendChild(t);
        document.getElementById("sprite_list").appendChild(li);

        document.getElementById("input").value = "";

        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        li.appendChild(span);

        for (i = 0; i < close.length; i++) {
            close[i].onclick = function() {
                var div = this.parentElement;
                div.style.display = "none";
            }
        }


    };


    /* 라디오버튼처럼 하나만 selected되도록 */

    /*var list = document.querySelector('ul#sprite_list');

    list.addEventListener('click', function(ev) {
        var tm = document.getElementsByTagName("li");
        for(i=0; i<tm.length; i++){
            tm[i].className = "";
        }
        if (ev.target.tagName === 'LI') {
            ev.target.classList.toggle('selected');
        }

        var $shape = $(ev.target);
        // shape에 id 프로퍼티가 없으므로 새로운 태그를 만들어 거기에 id를 넣었음.
        // konvadiv.js의 120번쨰 줄부터
        // select함수의 동작을 위해 select함수도 약간 고침.
        // main_screen.js의 select함수와 konvadiv.js의 154번쨰 줄부터
        main_screen.select($shape.attr("id"));


    }, false);*/


});