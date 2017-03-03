function QuestionListQuestion(indexInSlide, $question, slide){
	/*
	 * This is not the order of the question in the survey, but the order in the
	 * slide where the page lies. The order starts from 0.
	 */
	this.indexInSlide = indexInSlide;
	this.$question = $question;
	this.enableSelection();
	this.slide = slide;
};

QuestionListQuestion.prototype.enableSelection = function(){
	var question = this;
	question.$question.click(function(){
		question_list_question_controller.select_question(question);
	});
}

/**
 * 这个方法决定是否需要透明度的渐变效果，位移的渐变/动画效果。如果需要透明渐变，则opacity参数喂true, 否则设为false. 同理适用于位移.
 */
QuestionListQuestion.prototype.toggleTransition = function(opacity, transform){
	if(opacity && transform) {
		this.$question.css("transition", "opacity 1s, -webkit-transform 1s");
	} else if (opacity && !transform) {
		this.$question.css("transition", "opacity 1s");
	} else if (transform && !opacity) {
		this.$question.css("transition", "-webkit-transform 1s");
	} else {
		// 如果不需要任何渐变效果则取消transition属性
		this.$question.css("transition", "");
	}
}

QuestionListQuestion.prototype.removeQuestion = function(){
	this.toggleTransition(true, false);
	//从集合里将这个元素删除
	var questionsInSlides = this.slide.questions;
	
	questionsInSlides.splice(this.indexInSlide, 1);
	//从DOM里将对应的HTML元素删除
	this.$question.remove();
	//更新其他question的index
	for(var idx in questionsInSlides){
		var question = questionsInSlides[idx];
		if(question.indexInSlide > this.indexInSlide){
			question.indexInSlide--;
		}
	}
}

/**
 * 这个方法计算问题移动到正确位置所需的位移，并且通过改变问题的CSS来将问题移动到正确的位置。此方法并不会调整自动调整transition属性。
 * 使用者在调用这个方法之前必须自行调整transition属性
 */
QuestionListQuestion.prototype.moveToPositionManualTransition = function(){
	/*
	 * Each slide has 6 rows, each row includes like 8 questions. Each question
	 * has a height of 35px. 每行的高度和这一行所包含的问题的高度是相同的。但是实际上每一行所占空间的高度还包括
	 * 每一行上面的空白区域。这个空白区域大概是20像素高。换言之每一行所需要占用空间的实际高度是55像素。
	 */
	
	// determine which row the question sits. Row order starts from 0.
	var rowIndex = Math.floor(this.indexInSlide / 8);
	// determine the index of the position in the row. Index starts from 0.
	var indexInRow = this.indexInSlide % 8;
	
	/*
	 * 现在开始计算这个问题移动到自己的位置所需要的位移。所有的计算都假设问题的位置是相对于问题所在滑块位置。换言之假如一个问题的位置是在它
	 * 所在滑块的最左上角，那么这个问题的位置就应该是0，0.同样，当计算所需位移的时候，假设问题的初始位置（位移前）是0， 0， 也就是在滑块的
	 * 左上角。
	 * 
	 * 每个问题长140像素，高35像素。每个问题左边需要预留10像素的空白空间。
	 */
	var translateY = rowIndex * 70;
	var translateX = indexInRow * 150 + 10;
	var cssTranslate = cssUtil.twoDimenstionalTranslate(translateX, translateY);

	// 直接改变问题所对于的HTML元素的CSS样式来移动问题。
	this.$question.css("-webkit-transform", cssTranslate).css("opacity", "1");
};

/**
 * 如果一个问题并不在当前显示的滑块中，那么这个问题的移动应该不带任何渐变或者动画效果。所有的移动都应该即刻完成。
 */
QuestionListQuestion.prototype.moveToPositionNoTransition = function(){
	this.toggleTransition(false, false); //取消透明度渐变和位移动画
	this.moveToPositionManualTransition();//即刻完成位移
}

/**
 * 只启动透明渐变效果，并且移动此问题。
 */
QuestionListQuestion.prototype.moveToPositionOpacityTransition = function(){
	this.toggleTransition(true, false);
	this.moveToPositionManualTransition();
}

/**
 * 只启动位移动画效果，并且移动此问题。
 */
QuestionListQuestion.prototype.moveToPositionTransformTransition = function(){
	this.toggleTransition(false, true);
	this.moveToPositionManualTransition();
}
