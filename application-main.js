$(function(){
	
	gryphon_container_layout.adjust_body_margin();
    init_all_kinds_of_raw_slides();
	configure_question_list_on_start_up();
	
	/**
	 * 此方法适用于在程序第一次启动的时候调用。
	 * 1.创建所有滑块以及问题的JS对象，同时创建对应的HTML对象。
	 * 2.立刻调整所有问题的位置。此位置调整没有动画效果。
	 * 3.立刻调整所有滑块的位置。同样此调整没有动画效果。
	 */
	function configure_question_list_on_start_up (){
		//创建第一个演示用的滑块。
		var $slide = $("<div></div>");
		$slide.addClass("question-slide").appendTo("#question-list");
		var slide = new QuestionListSlide(0, $slide);
		question_list_slide_controller.question_slides.push(slide);
		slide.makeActiveNoTransition();
		//在此滑块内部放置48个演示用的问题
		for(var i = 0; i < 42; i++){
			var $question = $("<div></div>");
			$question.addClass("question").text("S" + i).appendTo($slide);
			var question = new QuestionListQuestion(i, $question, slide);
			slide.questions.push(question);
			question.moveToPositionManualTransition();
		}
		
		//创建第二个演示用的滑块。
		$slide = $("<div></div>");
		$slide.addClass("question-slide").appendTo("#question-list");
		slide = new QuestionListSlide(1, $slide);
		question_list_slide_controller.question_slides.push(slide);
		slide.moveRightNoTransition();
		//在此滑块内部放置30个演示用的问题
		for(var i = 0; i < 30; i++){
			var $question = $("<div></div>");
			$question.addClass("question").text("H" + i).appendTo($slide);
			var question = new QuestionListQuestion(i, $question, slide);
			slide.questions.push(question);
			question.moveToPositionManualTransition();
		}
		
		//创建第三个演示用的滑块。
		$slide = $("<div></div>");
		$slide.addClass("question-slide").appendTo("#question-list");
		slide = new QuestionListSlide(2, $slide);
		question_list_slide_controller.question_slides.push(slide);
		slide.moveRightNoTransition();
		//在此滑块内部放置30个演示用的问题
		for(var i = 0; i < 40; i++){
			var $question = $("<div></div>");
			$question.addClass("question").text("P" + i).appendTo($slide);
			var question = new QuestionListQuestion(i, $question, slide);
			slide.questions.push(question);
			question.moveToPositionManualTransition();
		}
		
		question_list_question_controller.set_all_navigation_buttons();
		
		question_list_question_controller.set_all_init_command_buttons ();
		
		menu_system.fly_in_button();
	};

    /**
     * 也就是说开始初始化所有除了问题滑块之外的其他滑块，包括结果滑块，问题细节滑块，流程控制滑块
     */
    function init_all_kinds_of_raw_slides(){
        var question_detail_slide = new RawSlide("detail", $("#question-detail-slide"));
        var flow_control_slide = new RawSlide("flow_control", $("#flow-control-slide"));
        var result_slide = new RawSlide("result", $("#result-slide"));

        application_slide_controller.question_detail_slide = question_detail_slide;
        application_slide_controller.flow_control_slide = flow_control_slide;
        application_slide_controller.result_slide = result_slide;
    };

});