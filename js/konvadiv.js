/* 2016-05-22 by Choi */

var scrc;
scrc = scrc || {};

$(function () {
    var main_screen = scrc.namespace("main_screen");
    var script = scrc.namespace("script");

    // http://konvajs.github.io/docs/index.html

    // create stage canvas
    var width = $("#container").width();
    var height = $("#container").height();

    var stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height,
        offset: {
            x: -width / 2,
            y: -height / 2
        }
    });

    // create image layer
    var layer = new Konva.Layer();

    $(".spritebar input").on("change", handleFiles);

    function handleFiles(e) {

        var img = new Image();
        img.src = URL.createObjectURL(e.target.files[0]);

        img.onload = function () {
            var myimg = new Konva.Image({
                x: 50,
                y: 50,
                image: img,
                draggable: true,
                width: 100,
                height: 100,
                offset: {
                    x: 50,
                    y: 50
                },
                stroke:"red",
                strokeWidth: 2,
                strokeEnabled: false

            });
            layer.add(myimg);
            layer.draw();
            myimg.on("dragstart", function () {
                this.moveToTop();
                layer.draw();
            });
            main_screen.imgs[myimg._id] = myimg;
            main_screen.select(myimg._id);

            var $sprite_list = $("#sprite_list");
            var title = document.getElementById("input").value.split("\\").pop().split(".").shift();
            var $new_list = $("<li>").text(title).attr("id", myimg._id);
            var $close_bt = $("<span>").text("\u00D7").addClass("close");

            $close_bt.on("click", function () {
                var id = $new_list.attr("id");
                $new_list.remove();
                layer.getChildren(function (shape) {
                    if (shape._id == id) {
                        shape.remove();
                        layer.draw();
                    }
                })
            });
            $new_list.append($close_bt);
            $sprite_list.append($new_list);

            $sprite_list.find("li").removeClass("selected");
            $new_list.addClass("selected");

            /* 파일 추가시 스크립트 추가, 일단 파일경로(fakepath)만 */
            /*var newlist = document.createElement("li");
            var inputValue = document.getElementById("input").value;
            $(newlist).text(inputValue).attr("id", myimg._id);
            var element = document.getElementById("sprite_list");
            element.classList.toggle('selected');

            // Create X(close) button and append it to each list item
            var myNodelist = $(element).find("LI");
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
            }*/
        }
    }


    //mouseover stroke event

    layer.on('mouseover', function(evt) {
        var shape = evt.target;
        shape.strokeEnabled(true);
        layer.draw();
    });
    layer.on('mouseout', function(evt) {
        var shape = evt.target;
        shape.strokeEnabled(false);
        layer.draw();
    });
    layer.on("click", function (evt) {
        var shape = evt.target;
        shape.moveToTop();
        $("#sprite_list li").removeClass("selected");
        $("#sprite_list li[id='" + shape._id + "']").addClass("selected");
        main_screen.select(shape._id);
        layer.draw();
    });

    // add the layer to the stage
    stage.add(layer);

    main_screen.stage = stage;

    main_screen.moveToTop = function (id) {
        layer.getChildren(function (shape) {
            if (shape._id == id) {
                shape.moveToTop();
                layer.draw();
            }
        })
    }
});