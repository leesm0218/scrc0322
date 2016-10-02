/**
 * Created by hwss on 2016-05-05.
 */
var scrc;
scrc = scrc || {};

$(function () {
    var main_screen = scrc.namespace("main_screen");
    var util = scrc.namespace("util");

    main_screen.imgs = main_screen.imgs || {};
    main_screen.n_of_img = scrc.n_of_img || 0;
    main_screen.select_img_id = scrc.select_img_id || 0;

    main_screen.draw = function () {
        main_screen.stage.draw();
    };
    main_screen.select = function (id) {
        main_screen.moveToTop && main_screen.moveToTop(id);
        //console.log(main_screen.select_img_index)
        $(".code .code-piece[target-id=" + main_screen.select_img_id + "]").hide();
        $(".code .code-piece[target-id=" + id + "]").show();
        main_screen.select_img_id = id;
    }
});
