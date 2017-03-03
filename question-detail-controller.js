/**
 * Created by wangsheng on 5/3/14.
 */

/*这整个JS文件都是作为纯演示用的，如果你要写这一块请重新写过*/
var question_detail_controller = {};

$(function(){
    question_detail_controller.start_up();
});

question_detail_controller.start_up = function(){
    var column_slides =  $("#question-detail-slide .question-matrix-columns");

    var row_slides = $("#question-detail-slide .question-matrix-rows");
    var row_slides_controllers = $("#question-detail-slide #row-slides-controller div");
    var current_active_row_slide_index = 0;

    row_slides.filter(":first").css("opacity", 1).css("z-index", "1");
    row_slides_controllers.filter(":first").css("-webkit-transform", "scale(1, 1)");

    column_slides.filter(":first").css("opacity", 1).css("z-index", "1");

    function registerSwitchRowSlideControllerAction(index){
        row_slides_controllers.eq(index).click(function(){
            if(current_active_row_slide_index !== index) {
                $(this).css("-webkit-transform", "scale(1, 1)");
                row_slides_controllers.eq(current_active_row_slide_index).css("-webkit-transform", "scale(0.7, 0.7)");

                row_slides.eq(current_active_row_slide_index).css("opacity", 0).css("z-index", "");
                row_slides.eq(index).css("opacity", 1).css("z-index", "1");
                current_active_row_slide_index = index;
            }
        });
    }

    for(var i = 0; i < 3; i++){
        registerSwitchRowSlideControllerAction(i);
    }

    var expandOrCollapse = 0; //0: collapsed status and 1: expanded status.


    row_slides_controllers.eq(3).click(function(){
        if(expandOrCollapse === 0){
            column_slides.css("opacity", 0);
            $(this).css("-webkit-transform", "scale(1, 1)");
            row_slides.eq(0).css("opacity", 1);
            row_slides.eq(1).css("-webkit-transform", "translate(280px, 0px)").css("opacity", 1);
            row_slides.eq(2).css("-webkit-transform", "translate(560px, 0px)").css("opacity", 1);
            expandOrCollapse = 1;
        } else {
            column_slides.eq(0).css("opacity", 1); //temporary solution!!!
            $(this).css("-webkit-transform", "scale(0.7, 0.7)");
            row_slides.not(row_slides.eq(current_active_row_slide_index)).css("opacity", 0);
            row_slides.eq(1).css("-webkit-transform", "translate(0px, 0px)");
            row_slides.eq(2).css("-webkit-transform", "translate(0px, 0px)");
            expandOrCollapse = 0;
        }
    });

}

question_detail_controller.set_edit_rows_columns_dummy_buttons = function(){


    function switchToFlowControlListener(){

        menu_system.fly_in_button_after_next_fly_out(
            function(){
                //配置好流程控制页面的各种命令按钮
                flowController.set_all_command_buttons();
                //配置好一个由流程控制页面返回问题细节页面的导航按钮
                question_detail_controller.set_return_question_detail_navigation_button();
            });
        menu_system.mark_all_command_button_removal_ready();
        menu_system.fly_out_button();


        application_slide_controller.make_flow_control_slide_active();
    }

    menu_system.configure_command_button("Flow Control", switchToFlowControlListener);
    menu_system.configure_command_button("Change Type", function(){alert(1);});
    menu_system.configure_command_button("Copy", function(){alert(1);});
    menu_system.configure_command_button("Cut", function(){alert(1);});
    menu_system.configure_command_button("Paste", function(){alert(1);});
    menu_system.configure_command_button("Remove", function(){alert(1);});
    menu_system.configure_command_button("Cancel", function(){alert(1);});
}

question_detail_controller.set_return_question_detail_navigation_button = function(){
    menu_system.configure_navigation_button("Question Detail", function(){
        //当这个按钮被按到的时候,首先将这个按钮自己标记为“准备飞出”
        var $thisButton = menu_system.get_shown_button_by_label("Question Detail");
        menu_system.mark_button_removal_ready($thisButton);
        //然后呢将所有的命令按钮都标记为“准备飞出”
        menu_system.mark_all_command_button_removal_ready();
        //设置当现有的按钮飞出的时候应该飞入哪些新的按钮。当然是问题细节滑块页面的那一堆按钮啦
        menu_system.fly_in_button_after_next_fly_out(question_detail_controller.set_edit_rows_columns_dummy_buttons);
        //最终正式滑出已经标记为“飞出”的各种各样的按钮
        menu_system.fly_out_button();
        //然后滑入问题细节滑块
        application_slide_controller.make_question_detail_slide_active();
    });
}