/**
 * Created by Choi on 2016-08-03.
 */
/*var width = window.innerWidth;
var height = window.innerHeight;

// first we need Konva core things: stage and layer
var stage = new Konva.Stage({
    container: 'shapecontainer',
    width: width,
    height: height
});

var layer = new Konva.Layer();
stage.add(layer);


// then we are going to draw into special canvas element
var canvas = document.createElement('canvas');
canvas.width = 400
canvas.height = 300

// creted canvas we can add to layer as "Konva.Image" element
var image = new Konva.Image({
    image: canvas,
    x : 100,
    y : 100,
    stroke: 'green'

});
layer.add(image);
stage.draw();

// Good. Now we need to get access to context element
var context = canvas.getContext('2d');
context.strokeStyle = "#df4b26";
context.lineJoin = "round";
context.lineWidth = 4;


var isPaint = false;
var lastPointerPosition;
var mode = 'brush';


// now we need to bind some events
// we need to start drawing on mousedown
// and stop drawing on mouseup
stage.on('contentMousedown.proto', function() {
    isPaint = true;
    lastPointerPosition = stage.getPointerPosition();

});

stage.on('contentMouseup.proto', function() {
    isPaint = false;
});

// and core function - drawing
stage.on('contentMousemove.proto', function() {

    if (!isPaint) {
        return;
    }

    if (mode === 'brush') {
        context.globalCompositeOperation = 'source-over';
    }
    if (mode === 'eraser') {
        context.globalCompositeOperation = 'destination-out';
    }
    context.beginPath();

    var localPos = {
        x: lastPointerPosition.x - image.x(),
        y: lastPointerPosition.y - image.y()
    };
    context.moveTo(localPos.x, localPos.y);
    var pos = stage.getPointerPosition();
    localPos = {
        x: pos.x - image.x(),
        y: pos.y - image.y()
    };
    context.lineTo(localPos.x, localPos.y);
    context.closePath();
    context.stroke();


    lastPointerPosition = pos;
    layer.draw();
});


var toolselect = document.getElementById('shapetoolselect');
toolselect.addEventListener('change', function() {
    mode = toolselect.value;
});
*/