/**
 * Created by hwss on 2016-11-07.
 */

var load_data;

$(function () {
    var blocks = scrc.namespace("blocks");
    var main_screen = scrc.namespace("main_screen");
    var util = scrc.namespace("util");


    function InitProject () {
        main_screen.clear();
        $(".code").html("");
        $(".toolbox[value=09]").html("");
        blocks.variables = {};
        util.loadTemplate(".scrc-template.code-piece.data", function (template) {
            var $div = $("<div>").append(template);

            $div.find(">*").each(function (i, e) {
                blocks.addUl(e, ".toolbox[value=09]");
                if ($(e).is(".code-piece")) {
                    blocks.draggable(e, ".toolbox");
                    blocks.resizing($(e));
                    blocks.alignmentHeight($(e));
                }
            });
        })
    }

    $("#new_project").on("click", function () {
        InitProject();
    });

    $("#save_project").on("click", function () {
        var stage = main_screen.stage;
        var imgs = stage.getChildren()[0].children;
        var save_imgs = [];

        for (var i = 0; i < imgs.length; i++) {
            var src = imgs[i].getImage().src.split("/").pop();
            var save_img = {
                id : imgs[i]._id,
                src : src,
                position : imgs[i].getPosition()
            };
            //console.log(imgs[i].getPosition());
            save_imgs.push(save_img);
        }

        var save_code = $(".code").html();

        var save_vals = [];

        for (var id in blocks.variables) {
            save_vals.push({
                id: id,
                name: $(".toolbox .variable.element[variable-id=" + id + "]").attr("variable-name"),
                value: blocks.variables[id]
            })
        }

        var save_data = {
            code : save_code,
            imgs : save_imgs,
            variables : save_vals
        };
        console.log(JSON.stringify(save_data));
		//FileSaver.js 사용. 출처:https://github.com/eligrey/FileSaver.js/
		var blob = new Blob([JSON.stringify(save_data)], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "Scratch_save.txt");

    });

    $("#load_project").on("change", function (e) {
		var reader = new FileReader();

		reader.onload = function(e) {
            var load_data = reader.result;

                load_data = JSON.parse(load_data);
            var load_code = load_data.code;
            var load_imgs = load_data.imgs;
            var load_vals = load_data.variables;
            var id_link = {};
            var val_link = {};

            $(".code").html(load_code);
            $(".code .code-piece").each(function (i, e) {
                $($(e), $(".code")).draggable({
                    cursor: "move",
                    revert: "invalid",
                    helper: "original",
                    drag: blocks.drag
                });
            });

            for (var i = 0; i < load_imgs.length; i++) {
                //console.log(load_imgs[i]);
                main_screen.addImage(load_imgs[i].src, function () {
                    var old_id = load_imgs[i].id;
                    var old_position = load_imgs[i].position;
                    var count = i;

                    return function (myimg) {
                        var new_id = myimg._id;

                        id_link[old_id] = new_id;
                        myimg.setPosition(old_position);
                        main_screen.draw();

                        if (count + 1 == load_imgs.length) {
                            id_linker(id_link);
                        }
                    }
                } ());
            }

            for (var i = 0; i < load_vals.length; i++) {
                console.log(load_vals[i]);
                blocks.createVariable(load_vals[i].name, function () {
                    var old_id = load_vals[i].id;
                    var value = load_vals[i].value;
                    var count = i;

                    return function (new_id) {
                        val_link[old_id] = new_id;
                        blocks.variables[new_id] = value;

                        if (count + 1 == load_vals.length) {
                            val_linker(val_link);
                        }
                    }
                } ());
            }
		};
        console.log(e.target.files[0])
        if (e.target.files[0]) {
            InitProject();
            reader.readAsText(e.target.files[0]);
        }
    });

    function id_linker (id_link) {
        var cps_list = {};

        for (var old_id in id_link) {
            cps_list[old_id] = $(".code .code-piece[target-id=" + old_id + "]");
        }

        for (var old_id in id_link) {
            cps_list[old_id].attr("target-id", id_link[old_id]);
        }
    }

    function val_linker (val_link) {
        var val_list = {};

        for (var old_id in val_link) {
            val_list[old_id] = $(".workmenu .code-piece.variable.element[variable-id=" + old_id + "]");
        }

        for (var old_id in val_link) {
            val_list[old_id].attr("variable-id", val_link[old_id]);
        }
    }
});
