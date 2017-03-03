/**
 * Created by wangsheng on 10/3/14.
 */
//这个文件里的逻辑是用来控制如何生成一个节点。
var flow_control_configure_node_content = {};

$(function(){

    var board = message_board_controller.get_node_info();
    var ifAnswer = board.children(".configure:first");
    var ifSelect = board.children(".configure:nth-child(6)");
    var inputQuestionName = board.children("input:nth-child(4)");
    var inputRowName = board.children("input:nth-child(7)");
    var inputColumnName = board.children("input:nth-child(9)");

    function startConfiguringNodeContent(){
        //在这里用户需要输入关于节点的各种信息，当然首先把这一块显示出来啦
        message_board_controller.show_node_info();
        application_slide_controller.make_question_list_slide_no_transition();
        /**
         * 然后当然现在要配置$("#configure-flow-control-node")上面的各种响应了。那么都有哪些响应呢-_-?
         * 首先让我来看看$("#configure-flow-control-node")具体都有哪些元素：
         * User answers question {input:questionName} and selects {input:rowName} for {input:columnName}
         */
        setAllNavigationAndCommandButton();
        attachListenerToDecideIfAnswer();
        attachListenerToDecideIfSelect();
        attachListenerToInputQuestionName();
        attachListenerToInputRowName();
        attachListenerToInputColumnName();
    }

    function setAllNavigationAndCommandButton(){
        //为了简化起见，把现有的各种导航按钮和命令按钮disable而不是飞出(免得等下又要飞入啊啊啊啊啊啊）
        //也就是说要冻结Chat Log, Result, Question List, Question Detail导航栏，同时飞入"Previous Slide"和“Next Slide"
        menu_system.disable_button(menu_system.get_shown_button_by_label("Chat Log"));
        menu_system.disable_button(menu_system.get_shown_button_by_label("Results"));
        menu_system.disable_button(menu_system.get_shown_button_by_label("Question List"));
        menu_system.disable_button(menu_system.get_shown_button_by_label("Question Detail"));

        menu_system.fly_in_button_after_next_fly_out(function(){
            question_list_question_controller.set_question_slide_navigation_button();
            menu_system.configure_command_button("Confirm", goAndCreateNode);
            menu_system.configure_command_button("Cancel", function(){alert(2)});
        });

        menu_system.mark_all_command_button_removal_ready();
        menu_system.fly_out_button();
    }

    function goAndCreateNode(){
        application_slide_controller.make_flow_control_slide_active_no_transition();
        menu_system.mark_all_command_button_removal_ready();
        menu_system.mark_button_removal_ready(menu_system.get_shown_button_by_label("Previous Slide"));
        menu_system.mark_button_removal_ready(menu_system.get_shown_button_by_label("Next Slide"));
        menu_system.fly_out_button();
        message_board_controller.hide_node_info();
        menu_system.enable_button(menu_system.get_shown_button_by_label("Chat Log"));
        menu_system.enable_button(menu_system.get_shown_button_by_label("Results"));
        menu_system.enable_button(menu_system.get_shown_button_by_label("Question List"));
        menu_system.enable_button(menu_system.get_shown_button_by_label("Question Detail"));
        //从message-board那里得到各种各样的信息
        fetchInputAndCreateNode();
    }


    //从容易的开始，当用户点击"answers",文字变成"does not answer"
    function attachListenerToDecideIfAnswer(){
        ifAnswer.click(function(){
            if(ifAnswer.text() === "answers"){
                ifAnswer.text("does not answer");
            } else {
                ifAnswer.text("answers");
            }
        });
    }

    //当用户点击“selects"的时候，文字变成“does not select"
    function attachListenerToDecideIfSelect(){
        ifSelect.click(function(){
            if(ifSelect.text() === "selects"){
                ifSelect.text("does not select");
            } else {
                ifSelect.text("select");
            }
        });
    }

    //好了现在当用户激活了{input:questionName}了之后主画面切换到问题列表。
    //需要注意的是这个并不是真正的问题滑块。只是一个类似问题滑块的版面，让你选择问题，浏览问题的questionText而已。同理适用于下面所
    //提到的问题细节滑块。
    function attachListenerToInputQuestionName(){
        inputQuestionName.focus(function(){
            if(application_slide_controller.current_slide !== 0){
                application_slide_controller.make_question_list_slide_no_transition();
                //由于这两个按钮可能之前被冻结了，所以为了以防万一我还是解冻吧
                if(question_list_slide_controller.previous_active_slide_index !== -1){
                    menu_system.enable_button(menu_system.get_shown_button_by_label("Previous Slide"));
                }
                if(question_list_slide_controller.next_active_slide_index !== question_list_slide_controller.question_slides.length){
                    menu_system.enable_button(menu_system.get_shown_button_by_label("Next Slide"));
                }
            }
        });
    }

    function soGodDamnHardToFindAppropriateNameForThisFunction(){
        if(application_slide_controller.current_slide !== 1){
            application_slide_controller.make_question_detail_slide_active_no_transition();
            //同时由于到了‘问题细节’板块，我已经不需要‘Previous Slide'和‘Next Slide'了。所以就冻结他们
            menu_system.disable_button(menu_system.get_shown_button_by_label("Previous Slide"));
            menu_system.disable_button(menu_system.get_shown_button_by_label("Next Slide"));
        }
    }

    //好了现在当用户激活了{input:columnName}之后主画面切换到问题细节滑块
    function attachListenerToInputRowName(){
        inputRowName.focus(soGodDamnHardToFindAppropriateNameForThisFunction);
    }

    //好了现在来让我飞入两个命令按钮'确定‘和‘取消’
    function attachListenerToInputColumnName(){
        inputColumnName.focus(soGodDamnHardToFindAppropriateNameForThisFunction);
    }

    function fetchInputAndCreateNode(){
        var content;

        if(ifAnswer.text() === "answers"){
            content = "+ ";
        } else {
            content = "- ";
        }

        content = content + inputQuestionName.val();

        if(ifSelect.text() === "selects"){
            content = content + " + ";
        } else {
            content = content + " - ";
        }

        content = content + inputColumnName.val() + " > " + inputRowName.val();
        createNewNode(content);
    }

    function createNewNode(content){
        flowController.command.createNewNode(content);
    }


    /*设置对外接口*/
    flow_control_configure_node_content.startConfiguringNodeContent = startConfiguringNodeContent;
});