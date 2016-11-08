/**
 * Created by hwss on 2016-11-07.
 */

var load_data;

$(function () {
    var blocks = scrc.namespace("blocks");
    var main_screen = scrc.namespace("main_screen");


    $("#new_project").on("click", function () {
        main_screen.clear();
        $(".code").html("");
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
        /*$(".code .code-piece").each(function (i, e) {
            $($(e), $(".code")).draggable({
                cursor: "move",
                revert: "invalid",
                helper: "original",
                drag: blocks.drag
            });
        });*/

        var save_data = {
            code : save_code,
            imgs : save_imgs
        };
        console.log(JSON.stringify(save_data));
		//FileSaver.js 사용. 출처:https://github.com/eligrey/FileSaver.js/
		var blob = new Blob([JSON.stringify(save_data)], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "Scratch_save.txt");

    });

    $("#load_project").on("change", function (e) {
        main_screen.clear();
        $(".code").html("");


		var reader = new FileReader();

		reader.onload = function(e) {
		var load_data = reader.result;

			load_data = JSON.parse(load_data);
        var load_code = load_data.code;
        var load_imgs = load_data.imgs;
        var id_link = {};

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
		}
		reader.readAsText(e.target.files[0]);

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
});
