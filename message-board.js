var message_board_controller = {};

message_board_controller.show_single_input = function(label){
	$("#message-board #input-message span").text(label);
    $("#message-board #input-message").css("opacity", "1").css("z-index", 1);
};

message_board_controller.show_help_message = function(message){
	$("#message-board #help-message span").text(message);
    $("#message-board #help-message").css("opacity", "1").css("z-index", 1);
};

message_board_controller.hide_single_input = function(){
    $("#message-board #input-message").css("opacity", "0").css("z-index", "");
};

message_board_controller.hide_help_message = function(){
    $("#message-board #help-message").css("opacity", "0").css("z-index", "");
};

message_board_controller.get_new_question_name = function(){
	return $("#message-board #input-message input").val();
}

message_board_controller.get_node_info = function(){
    return $("#message-board #configure-flow-control-node");
};

message_board_controller.hide_node_info = function(){
    return $("#message-board #configure-flow-control-node").css("opacity", "0").css("z-index", "");
};

message_board_controller.show_node_info = function(){
    return $("#message-board #configure-flow-control-node").css("opacity", "1").css("z-index", 1);
};

