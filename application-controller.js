var application_slide_controller = {
		current_slide: 0, //0 for questionslides, 1 for question detail slide, 2 for flow control slide and 3 for result slide.
        question_detail_slide : null,
        flow_control_slide : null,
        result_slide: null
};

application_slide_controller.make_question_detail_slide_active = function(){
    switch(this.current_slide){
        case 0:
            //如果是问题滑块，那么把问题滑块往左边滑，从右边滑入细节滑块
            question_list_slide_controller.get_current_active_slide().moveLeftTransformTransition();
            break;
        case 2:
            //如果现在在流程控制的版面，那么把流程控制往右边滑，然后从左滑入问题细节滑块
            this.flow_control_slide.moveRightTransformTransition();
            break;
    }
    this.question_detail_slide.makeActiveTransformTransition();
    this.current_slide = 1;
};

application_slide_controller.make_question_detail_slide_active_no_transition = function(){
    switch(this.current_slide){
        case 0:
            //如果是问题滑块，那么把问题滑块往左边滑，从右边滑入细节滑块
            question_list_slide_controller.get_current_active_slide().moveLeftNoTransition();
            break;
        case 2:
            //如果现在在流程控制的版面，那么把流程控制往右边滑，然后从左滑入问题细节滑块
            this.flow_control_slide.moveRightNoTransition();
            break;
    }
    this.question_detail_slide.makeActiveNoTransition();
    this.current_slide = 1;
};

application_slide_controller.make_question_list_slide_active = function(){
    //不管是神马滑块都把它们往右边滑动
    switch(this.current_slide){
        case 1:
            this.question_detail_slide.moveRightTransformTransition();
            break;
        case 2:
            this.flow_control_slide.moveRightTransformTransition();
            this.question_detail_slide.moveRightNoTransition();
            break;
        case 3:
            this.result_slide.moveRightTransformTransition();
            break;
    }
    //把问题集合滑块从左往右滑入
    question_list_slide_controller.get_current_active_slide().makeActiveTransformTransition();
    this.current_slide = 0;
};

application_slide_controller.make_question_list_slide_no_transition = function(){
    //不管是神马滑块都把它们往右边滑动
    switch(this.current_slide){
        case 1:
            this.question_detail_slide.moveRightNoTransition();
            break;
        case 2:
            this.flow_control_slide.moveRightNoTransition();
            break;
        case 3:
            this.result_slide.moveRightNoTransition();
            break;
    }
    //把问题集合滑块从左往右滑入
    question_list_slide_controller.get_current_active_slide().makeActiveNoTransition();
    this.current_slide = 0;
}


application_slide_controller.make_flow_control_slide_active = function(){
    this.question_detail_slide.moveLeftTransformTransition();
    this.flow_control_slide.makeActiveTransformTransition();
    this.current_slide = 2;
};

application_slide_controller.make_flow_control_slide_active_no_transition = function(){
    switch(this.current_slide){
        case 0:
            question_list_slide_controller.get_current_active_slide().moveLeftNoTransition();
            this.question_detail_slide.moveLeftNoTransition();
            break;
        case 1:
            this.question_detail_slide.moveLeftNoTransition();
            break;
    }
    this.flow_control_slide.makeActiveNoTransition();
    this.current_slide = 2;
};

