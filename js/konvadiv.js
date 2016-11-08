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
        var file_name = e.target.files[0].name;

        //var url = URL.createObjectURL(e.target.files[0]);
        main_screen.addImage(file_name);
    }

    main_screen.addImage = function (file_name, callback) {
        var url = "scratch_images/" + file_name;

        var img = new Image();
        img.src = url;

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
            var title = file_name.split(".").shift();
            var $new_list = $("<li>").attr("id", myimg._id);

            $new_list.on("click", function (ev) {
                $("#sprite_list li").removeClass("selected");
                $new_list.addClass("selected");
                main_screen.select($new_list.attr("id"));
            });
            var list_img = new Image();
            list_img.src = url;
            $new_list.append(list_img);

            var $title = $("<span>").addClass("sprite-title").text(title);
            $new_list.append($title);

            var $close_bt = $("<span>").text("\u00D7").addClass("close");

            $close_bt.on("click", function () {
                var id = $new_list.attr("id");
                $new_list.remove();
                layer.getChildren(function (shape) {
                    if (shape._id == id) {
                        shape.remove();
                        $(".code .code-piece[target-id=" + id + "]").remove();
                        layer.draw();
                    }
                })
            });
            $new_list.append($close_bt);

            $sprite_list.append($new_list);

            $sprite_list.find("li").removeClass("selected");
            $new_list.addClass("selected");

            callback && callback(myimg);
        }
    };

    main_screen.clear = function () {
        layer.destroyChildren()
        stage.clear();
        var $sprite_list = $("#sprite_list");
        $sprite_list.html("");
    };


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
        console.log(shape._id)
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