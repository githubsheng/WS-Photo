/**
 * 这个所谓的控制器用于记录当前显示的滑块index
 */
var question_list_slide_controller = {
			//index由0开始算起
			previous_active_slide_index:-1, //这个适用于问题滑块
			next_active_slide_index:1, //这个适用于问题滑块
			current_active_slide_index:0, //这个适用于问题滑块
			question_slides: []
		};

question_list_slide_controller.get_slide_by_index = function(index){
	return this.question_slides[index];
}

question_list_slide_controller.get_current_active_slide = function(){
	return this.question_slides[this.current_active_slide_index];
}

question_list_slide_controller.get_previous_active_slide = function(){
	return this.question_slides[this.previous_active_slide_index];
}

question_list_slide_controller.get_next_active_slide = function(){
	return this.question_slides[this.next_active_slide_index];
}