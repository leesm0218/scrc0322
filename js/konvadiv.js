/* 2016-05-22 by Choi */

var scrc;
scrc = scrc || {};

$(function () {
    var main_screen = scrc.namespace("main_screen");
    var script = scrc.namespace("script");
    // http://konvajs.github.io/docs/index.html

    // create stage canvas
    var width = 400;
    var height = 300;

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
            
            script.add();
        }
    }



    //  rectangles for test

    var colors = ["red", "yellow", "blue"];

    for(var i = 0; i < 3; i++) {
        var box = new Konva.Rect({
            x: i * 40 - 100,
            y: i * 25 - 80,
            fill: colors[i],
            draggable: true,
            width: 100,
            height: 50,
            offset: {
                x: 50,
                y: 25
            },
            stroke:"red",
            strokeWidth: 2,
            strokeEnabled: false
        });

        box.on("dragstart", function() {
            this.moveToTop();
            main_screen.select(this._id);
            layer.draw();
        });

        box.on("dragmove", function() {
            document.body.style.cursor = "pointer";
        });
        /*
         * dblclick to remove box for desktop app
         * and dbltap to remove box for mobile app
         */

        box.on("dblclick dbltap", function() {
            //this.destroy();
            layer.draw();
        });

        box.on("mouseover", function() {
            document.body.style.cursor = "pointer";
        });
        box.on("mouseout", function() {
            document.body.style.cursor = "default";
        });

        layer.add(box);
        main_screen.imgs[box._id] = box;
        main_screen.select(box._id);

        
    }


    //mouseover stroke event

    layer.on('mouseover', function(evt) {
        document.body.style.cursor = "pointer";
        var shape = evt.target;
        shape.strokeEnabled(true);
        layer.draw();
    });
    layer.on('mouseout', function(evt) {
        document.body.style.cursor = "default";
        var shape = evt.target;
        shape.strokeEnabled(false);
        layer.draw();
    });
    layer.on("click", function (evt) {
        var shape = evt.target;
        shape.moveToTop();
        main_screen.select(shape._id);
        layer.draw();
    });

    // add the layer to the stage
    stage.add(layer);

    main_screen.stage = stage;
});