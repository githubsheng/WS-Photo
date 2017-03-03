var question_list_question_controller = {
		selected_question : null
};


question_list_question_controller.set_all_navigation_buttons = function(){
	question_list_question_controller.set_other_navigation_buttons();
	question_list_question_controller.set_question_slide_navigation_button();
}

/*加入‘前一滑块’和‘后一滑块’*/
question_list_question_controller.set_question_slide_navigation_button = function(){

	//创建“上一滑块”按钮，这个按钮只是切换到前一个问题滑块
	var $previousButton = menu_system.configure_navigation_button("Previous Slide", function(){
        var $button = menu_system.get_shown_button_by_label("Next Slide");
		menu_system.enable_button($button);
		
		//将当前显示的滑块滑到右边去
		var current_active_slide = question_list_slide_controller.get_current_active_slide();
		current_active_slide.moveRightTransformTransition();
		question_list_slide_controller.next_active_slide_index = current_active_slide.slide_index;
		//将新激活的模块设置成当前显示
		var previous_active_slide = question_list_slide_controller.get_previous_active_slide();
		previous_active_slide.makeActiveTransformTransition();
		question_list_slide_controller.current_active_slide_index = previous_active_slide.slide_index;
		//最后更新previous_active_slide_index并减1
		question_list_slide_controller.previous_active_slide_index --;		
		
		//如果已经没有上一个问题滑块了
		if(question_list_slide_controller.previous_active_slide_index === -1) {
			menu_system.disable_button(menu_system.get_shown_button_by_label("Previous Slide"));
		}
	});	
	
	//创建“下一滑块”按钮,这个按钮只是切换到下一个问题滑块
	var $nextButton = menu_system.configure_navigation_button("Next Slide", function(){
		//如果你往右移动，那么往左的按钮肯定就可以按了。
        var $button = menu_system.get_shown_button_by_label("Previous Slide");
		menu_system.enable_button($button);
		
		//将当前显示的滑块滑到左边去
		var current_active_slide = question_list_slide_controller.get_current_active_slide();
		current_active_slide.moveLeftTransformTransition();
		question_list_slide_controller.previous_active_slide_index = current_active_slide.slide_index;
		//将新激活的模块设置成当前显示
		var next_active_slide = question_list_slide_controller.get_next_active_slide();
		next_active_slide.makeActiveTransformTransition();
		question_list_slide_controller.current_active_slide_index = next_active_slide.slide_index;
		//最后更新new_active_slide_index并加1
		question_list_slide_controller.next_active_slide_index ++;
		
		//如果已经没有下一个问题滑块了
		if(question_list_slide_controller.next_active_slide_index === question_list_slide_controller.question_slides.length) {
            menu_system.disable_button(menu_system.get_shown_button_by_label("Next Slide"));
		}
	});

    if(question_list_slide_controller.previous_active_slide_index === -1) {
        menu_system.disable_button($previousButton);
    } else {
        menu_system.enable_button($previousButton);
    }

    if(question_list_slide_controller.next_active_slide_index === question_list_slide_controller.question_slides.length) {
        menu_system.disable_button($nextButton);
    } else {
        menu_system.enable_button($nextButton);
    }
}


question_list_question_controller.set_other_navigation_buttons = function(){
	menu_system.configure_navigation_button("Chat Log", function(){alert(1);});
	menu_system.configure_navigation_button("Results", function(){alert(1);});
}

question_list_question_controller.set_all_init_command_buttons = function(){
	menu_system.configure_command_button("New Question", question_list_question_controller.ask_for_question_name);
	menu_system.configure_command_button("New Interlude", function(){alert("new!")});
};

/**
 * 此方法选定一个问题（以便以后修改）
 */
question_list_question_controller.select_question = function(question){
	//如果之前没有选定任何问题，则飞出这么几个按钮，否则就是已经选了问题了，选了就不要再重复飞出来了
	if(question_list_question_controller.selected_question === null){
		menu_system.fly_in_button_after_next_fly_out(question_list_question_controller.set_question_specific_command_button);

        menu_system.mark_all_command_button_removal_ready();
        menu_system.fly_out_button();//飞出按钮后会自动飞入下一批按钮。
	}
	
	//首先让之前选择的问题恢复原状
	if(this.selected_question !== null){
		question_list_question_controller.selected_question.$question.css("background-color", "").css("color", "");
	}
	//然后更新选择的问题
	question_list_question_controller.selected_question = question;
	question.$question.css("background-color", "#0098A5").css("color", "white");
};

question_list_question_controller.unselect_question = function(isDetached){
	//取消所有已经选中的命令按钮
	if(!isDetached/*如果这个元素已经从DOMtree中删除了，那么就不需要再改它的CSS了。比如你将一个选定的问题删除了，那么你就没必要再去改它的CSS了*/){
		question_list_question_controller.selected_question.$question.css("background-color", "").css("color", "");	
	}
	question_list_question_controller.selected_question = null;

	//充值命令栏的按钮
	menu_system.fly_in_button_after_next_fly_out(question_list_question_controller.set_all_init_command_buttons);
    menu_system.mark_all_command_button_removal_ready();
    menu_system.fly_out_button();
}

question_list_question_controller.set_question_specific_command_button = function(){
    //太复杂了所以哥在这里定义一个方法吧
    function goToQuestionDetail(){
        //取消js-configured以将这个按钮标记为‘准备飞出’
        //标记‘下一滑块’为‘飞出’（准确的说是‘下一问题滑块’）
        var $button = menu_system.get_shown_button_by_label("Next Slide");
        menu_system.mark_button_removal_ready($button);
        //因为‘上一滑块’（准确的说是‘下一问题滑块’）可能被disable了，所以你要先enable
        menu_system.enable_button($button);
        //标记‘下一滑块’为‘飞出’
        $button = menu_system.get_shown_button_by_label("Previous Slide");
        menu_system.mark_button_removal_ready($button);
        menu_system.enable_button($button);
        //标记所有命令滑块为‘飞出’
        menu_system.mark_all_command_button_removal_ready();

        menu_system.fly_in_button_after_next_fly_out(function(){
            //飞入问题滑块的导航按钮
            question_list_question_controller.set_return_question_list_navigation_button();
            question_detail_controller.set_edit_rows_columns_dummy_buttons();
        });

        menu_system.fly_out_button();

        application_slide_controller.make_question_detail_slide_active();
    }


    //控制命令栏飞入于单个问题相关的按钮，比如edit, copy, cut
    menu_system.configure_command_button("Edit", goToQuestionDetail);
    menu_system.configure_command_button("Copy", function(){alert("copy")});
    menu_system.configure_command_button("Cut", function(){alert("cut")});
    menu_system.configure_command_button("Remove", question_list_question_controller.remove_question_action);
    menu_system.configure_command_button("Cancel", function(){question_list_question_controller.unselect_question(false)});
}

question_list_question_controller.set_return_question_list_navigation_button = function(){
    menu_system.configure_navigation_button("Question List", function(){
        //现在开始设定当用户按了这个‘返回问题集合’按钮后会发生什么
        //返回问题集合
        application_slide_controller.make_question_list_slide_active();
        //同时悲剧的是要将自己飞出，呵呵
        var $button = menu_system.get_shown_button_by_label("Question List");
        menu_system.mark_button_removal_ready($button);
        //如果现在时在‘流程控制’滑块，那么还要将“问题细节”按钮给飞出
        $button = menu_system.get_shown_button_by_label("Question Detail");
        if($button !== null){
            menu_system.mark_button_removal_ready($button);
        }

        menu_system.mark_all_command_button_removal_ready();
        //重新飞入问题集合的命令按钮，以及‘上一滑块’和‘下一滑块’
        function f(){
            question_list_question_controller.set_question_specific_command_button();
            question_list_question_controller.set_question_slide_navigation_button();
        }
        menu_system.fly_in_button_after_next_fly_out(f);
        menu_system.fly_out_button();
    });
}

/**-------------------------------listeners----------------------------------**/
question_list_question_controller.ask_for_question_name = function(){
	//因为如果一个元素刚刚被插入到DOMtree，或者刚刚取消display：none属性，transition并不会立刻察觉到这个元素的初始状态，所以此时transition
	//往往无法正常工作。因为当询问用户是否确定要添加问题的时候，可以预先插入一个元素，并且用".js-ready-to-add" class来标记
	//增加一个我问题并将这个问题移动到合适的区域。
	var slide = question_list_slide_controller.get_current_active_slide();
	var $slide = slide.$slide;
    //现在就将这个预备元素插入DOM tree
	$("<div></div>").addClass("question").addClass("js-ready-to-add").appendTo($slide);
	
	message_board_controller.show_single_input("Input the name of the question");


    function configureButtons(){
        menu_system.configure_command_button("Confirm", question_list_question_controller.add_new_question_action);
        menu_system.configure_command_button("Cancel", question_list_question_controller.cancel_add_new_question_action);
    }
    menu_system.fly_in_button_after_next_fly_out(configureButtons);

    menu_system.mark_all_command_button_removal_ready();
    menu_system.fly_out_button();

}
/*
 * 此方法以预先加入DOM tree的"js-ready-to-add"作为DOM元素，生成一个问题并将这个问题插入当前显示的滑块。
 */
question_list_question_controller.add_new_question_action = function(){
	//找到当前显示的滑块
	var slide = question_list_slide_controller.get_current_active_slide();
	//找到"js-ready-to-add"元素
	var $question = $(".js-ready-to-add").eq(0);
	//找到用户输出的问题名
	var new_question_name = message_board_controller.get_new_question_name();
	//正式开始以"js-ready-to-add"元素为基础创建一个新问题，此时出去"js-ready-to-add"标记。
	$question.removeClass("js-ready-to-add").text(new_question_name);
	
	var questionsInSlide = slide.questions;
	var question = new QuestionListQuestion(questionsInSlide.length, $question, slide);
	
	questionsInSlide.push(question);
	//将新创建的问题移动到合适的位置
	question.moveToPositionOpacityTransition();

    menu_system.fly_in_button_after_next_fly_out(question_list_question_controller.set_all_init_command_buttons);
    //现在需要做的是飞出确定和取消键并且加上“新问题”和“新逻辑”按钮
    menu_system.mark_all_command_button_removal_ready();
    menu_system.fly_out_button();

    //添加完问题后自然要将input隐藏掉
    message_board_controller.hide_single_input();
}

question_list_question_controller.cancel_add_new_question_action = function(){
    //移除"js-ready-to-add"DOM元素
    $(".js-ready-to-add").remove();

    //重新飞入“新问题”和“新逻辑”按钮
    menu_system.fly_in_button_after_next_fly_out(question_list_question_controller.set_all_init_command_buttons);

    //飞出“确定”和“取消”按钮
    menu_system.mark_all_command_button_removal_ready();
    menu_system.fly_out_button();

    message_board_controller.hide_single_input();
}

/**
 * 此方法应该作为删除问题按钮的listener
 */
question_list_question_controller.remove_question_action = function(){
	question_list_question_controller.selected_question.removeQuestion();
	var slide = question_list_question_controller.selected_question.slide;
	var questionsInSlide = slide.questions;
	
	//如果现在的slide是当前显示的slide，那么重新位移所有其他的本滑块的问题需要有动画效果。否则就不需要有动画效果。
	if(application_slide_controller.current_slide === 0 && question_list_slide_controller.current_active_slide_index === slide.slide_index){
		for(var idx in questionsInSlide){
			var question = questionsInSlide[idx];
			question.toggleTransition(false, true);
		}
		
		for(var idx in questionsInSlide){
			var question = questionsInSlide[idx];
			question.moveToPositionManualTransition();
		}
	} else {
		for(var idx in questionsInSlide){
			var question = questionsInSlide[idx];
			question.toggleTransition(false, false);
		}
		
		for(var idx in questionsInSlide){
			var question = questionsInSlide[idx];
			question.moveToPositionManualTransition();
		}
	}
	
	question_list_question_controller.unselect_question(true);
	
}

