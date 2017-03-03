/**
 * Created by wangsheng on 6/3/14.
 */

var flowController = {};

$(function(){
    var LEFT_CONNECTOR = 0;
    var RIGHT_CONNECTOR = 1;
    var nodeIdx = 0;

    var canvasPositionCalculator = document.querySelector("#canvas-position-calculator");
    var flowControlCanvas = document.querySelector("#flow-control-canvas");

    flowControlCanvas.width = 1100;
    flowControlCanvas.height = 450;

    var canvasMouseX = 0;
    var canvasMouseY = 0;
    var bbox = flowControlCanvas.getBoundingClientRect();

    var ctx = flowControlCanvas.getContext("2d");

    function configureCommonPaintSetting(){
        ctx.fillStyle = "#156951";
        ctx.strokeStyle = "#156951";
        ctx.lineWidth = 3;
        ctx.shadowColor = "rgba(0,0,0,0.7)";
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 2;
    }

    configureCommonPaintSetting();

    function paintBackground(){
        ctx.save();
        ctx.shadowColor = undefined;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillRect(0,0,flowControlCanvas.width, flowControlCanvas.height);
        ctx.restore();
    }

    paintBackground();

    /* -utilities- */
    function windowToCanvas (e) {
        canvasMouseX = (e.clientX - bbox.left);
        canvasMouseY = (e.clientY - bbox.top);
    }

    var nodeCollection = [];
    var nodeConnectionLineCollection = [];


    /* ------ node -----*/
    function Node(nodeContent){
        this.x = 0; //x y用于记录节点的位置。当然是节点左上角的坐标。
        this.y = 0;
        //配置真正的DOM元素
        this.$node = $("<div></div>").addClass("node").text(nodeContent).hide().appendTo("#canvas-position-calculator");
        this.outerWidth = this.$node.outerWidth(); //把DOM元素的外部长宽都存在这里以方便以后的计算
        this.outerHeight = this.$node.outerHeight();
        this.leftConnector = new NodeConnector(this, LEFT_CONNECTOR); //左部连接器
        this.rightConnector = new NodeConnector(this, RIGHT_CONNECTOR); //右部连接器
        this.isMoving = false; //用于鉴别此节点是否现在正在移动
        //每当一个节点被创建我就将这个节点放入到一个nodeCollection集合里
        nodeCollection.push(this);
    }

    //在首次创建节点的时候画出节点的大概模样, 在移动的时候同样也只会画出一个大概的模样
    Node.prototype.drawFakeNode = function(x, y){
        this.x = x;
        this.y = y;
        ctx.strokeRect(this.x, this.y, this.outerWidth, this.outerHeight);
        this.drawConnectors();

    };

    //开始移动时将DOM元素隐藏
    Node.prototype.startMovement = function(actionAfterConfirm){
        this.$node.hide();
        this.isMoving = true;
        bbox = flowControlCanvas.getBoundingClientRect();

        var node = this;

        function drawFakeWhileMouseMove(e){
            windowToCanvas(e);
            //首先清除整个画面
            ctx.clearRect(0, 0, flowControlCanvas.width, flowControlCanvas.height);
            //画出整个背景
            paintBackground();
            //将所有的非移动的节点都重新画一遍（注意因为节点中间的HTML不用画，所以我们只需要画两个连接器就行了）
            nodeConnectionLineCollection.forEach(function(l){
                l.draw();
            });

            nodeCollection.forEach(function(n){
                if(n.isMoving === false) {
                    n.drawConnectors();
                }
            });

            //最后画出当前移动节点的假替身
            node.drawFakeNode(canvasMouseX, canvasMouseY);
        }

        //首先根据鼠标位置来画出一个假的形状
        flowControlCanvas.addEventListener("mousemove", drawFakeWhileMouseMove);

        function confirmNodePosition(){
            node.isMoving = false;
            //因为此前一直在移动的时候一直在更新节点的X Y信息，所以现在就用最后一次更新的X Y 信息
            node.$node.css("top", node.y).css("left", node.x).show();
            drawEverythingHahaEverything();
            //按完一次后就将各种相关的监听器移除
            flowControlCanvas.removeEventListener("mousemove", drawFakeWhileMouseMove);
            flowControlCanvas.removeEventListener("click", confirmNodePosition);
            //最后调用传入的actionAfterConfirm;
            actionAfterConfirm();
        }

        //用户此时点击左键以确定要再哪里创建节点/确定将节点移动到哪里
        flowControlCanvas.addEventListener("click",confirmNodePosition);
    };

    Node.prototype.updateNodeContent = function(nodeContent){
        this.$node.text(nodeContent);
        this.outerWidth = this.$node.outerWidth();
        this.outerHeight = this.$node.outerHeight();
        this.drawConnectors();
    };

    Node.prototype.remove = function(){
        //remove itself from nodeCollection.
        var idx = nodeCollection.indexOf(this);
        nodeCollection.splice(idx, 1);

        //remove connected lines from nodeConnectionLineCollection
        for(var idx2 in this.leftConnector.connectedLines){
            var line2 = this.leftConnector.connectedLines[idx2];
            line2.remove();
        }

        for(var idx3 in this.rightConnector.connectedLines){
            var line3 = this.rightConnector.connectedLines[idx3];
            line3.remove();
        }

        this.$node.remove();
    };

    //由于节点的中间部分是DOM元素，而DOM元素不需要我自己来画，所以实际上只需要画出节点的两个连接器就行了
    Node.prototype.drawConnectors = function(){
        this.updateConnectorPositioin();
        this.leftConnector.draw();
        this.rightConnector.draw();
    };

    Node.prototype.updateConnectorPositioin = function() {
        this.leftConnector.updatePosition(this.x - 10, this.y);
        this.rightConnector.updatePosition(this.x + this.outerWidth, this.y);
    };

    /* -----NodeConnector----- */
    function NodeConnector(node, type){
        this.node = node;
        this.x = 0;
        this.y = 0;
        this.type = type; //0 for left and 1 for right.
        this.connectedLines = [];
    }

    NodeConnector.prototype.updatePosition = function(x, y){
        this.x = x;
        this.y = y;
        this.updateConnectedLines();
    };

    NodeConnector.prototype.updateConnectedLines = function(){
        if(this.type === LEFT_CONNECTOR){
            for(var idx in this.connectedLines) {
                var endPoint = this.connectedLines[idx].endPoint;
                endPoint.x = this.getConnectionLineEndPointPositionX();
                endPoint.y = this.getConnectionLineEndPointPositionY();
            }
        } else {
            for(var idx2 in this.connectedLines) {
                var startPoint = this.connectedLines[idx2].startPoint;
                startPoint.x = this.getConnectionLineEndPointPositionX();
                startPoint.y = this.getConnectionLineEndPointPositionY();
            }
        }
    };

    NodeConnector.prototype.drawPath = function(){
        ctx.beginPath();
        ctx.rect(this.x , this.y, 10, this.node.outerHeight);
    };

    NodeConnector.prototype.draw = function(){
        this.drawPath();
        ctx.fill();
    };

    NodeConnector.prototype.getConnectionLineEndPointPositionX = function(){
        return this.x + 5;
    };

    NodeConnector.prototype.getConnectionLineEndPointPositionY = function(){
        return this.y + 10;
    };

    /* ------ connecting line ----- */
    function ConnectionLine(){
        this.logicalStart = null; //这个应该是某个节点的右连接器
        this.logicalEnd = null; //这个应该是某个节点的左连接器
        this.startPoint = {x:0, y:0};
        this.endPoint = {x:0, y:0};
        this.controlPointOne = {x:0, y:0}; //靠近起点的控制点
        this.controlPointTwo = {x:0, y:0}; //靠近终点的控制点
        this.createLineOnCanvasAction = this.generateCreateLineOnCanvasAction(this);
        nodeConnectionLineCollection.push(this);
    }

    ConnectionLine.prototype.generateCreateLineOnCanvasAction = function(line){
        function createLineOnCanvasAction(e){
            windowToCanvas(e);
            line.autoUpdateEndPoint();
            line.autoUpdateControlPoint();
            ctx.clearRect(0,0,1100,450);
            drawEverythingHahaEverything();
        }
        return createLineOnCanvasAction;
    };

    ConnectionLine.prototype.draw = function(){
        this.drawPath();
        ctx.stroke();
    };

    ConnectionLine.prototype.drawControlPoints = function(){
        ctx.save();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "lightgray";
        ctx.fillStyle = "lightgray";
        ctx.beginPath();
        ctx.moveTo(this.startPoint.x, this.startPoint.y);
        ctx.lineTo(this.controlPointOne.x, this.controlPointOne.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.endPoint.x, this.endPoint.y);
        ctx.lineTo(this.controlPointTwo.x, this.controlPointTwo.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.controlPointOne.x, this.controlPointOne.y, 5, 0, Math.PI * 2, false);
        ctx.arc(this.controlPointTwo.x, this.controlPointTwo.y, 5, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
    };

    ConnectionLine.prototype.drawPath = function(){
        ctx.beginPath();
        ctx.moveTo(this.startPoint.x, this.startPoint.y);
        ctx.bezierCurveTo(this.controlPointOne.x, this.controlPointOne.y,
            this.controlPointTwo.x, this.controlPointTwo.y,
            this.endPoint.x, this.endPoint.y);
    };

    ConnectionLine.prototype.toggleCreatingLineOnCanvas = function(enable){
        if(enable){
            flowControlCanvas.addEventListener("mousemove",this.createLineOnCanvasAction);
        } else {
            flowControlCanvas.removeEventListener("mousemove",this.createLineOnCanvasAction);
        }

    };

    ConnectionLine.prototype.autoUpdateEndPoint = function(){
        this.endPoint.x = canvasMouseX;
        this.endPoint.y = canvasMouseY;
    };

    ConnectionLine.prototype.autoUpdateControlPoint = function(){
        this.controlPointOne.x = (this.startPoint.x + this.endPoint.x)/2;
        this.controlPointOne.y = this.startPoint.y;

        this.controlPointTwo.x = (this.startPoint.x + this.endPoint.x)/2;
        this.controlPointTwo.y = this.endPoint.y;
    };

    ConnectionLine.prototype.remove = function(){
        var idx = nodeConnectionLineCollection.indexOf(this);
        nodeConnectionLineCollection.splice(idx, 1);

        var idx2 = this.logicalStart.connectedLines.indexOf(this);
        this.logicalStart.connectedLines.splice(idx2, 1);


        var idx3 = this.logicalEnd.connectedLines.indexOf(this);
        this.logicalEnd.connectedLines.splice(idx3, 1);
    };

    (function createStartEndNode(){
        //好吧在这里我要创建头尾两个节点,当然内部我就不用上面那个方法创建了。
        var startNode = new Node("Start Survey");
        startNode.$node.css("top", "220px").css("left", "0px").show();
        startNode.x = -3;
        startNode.y = 220;
        startNode.updateConnectorPositioin();
        startNode.rightConnector.draw();


        var endNode = new Node("Display S1 C1");
        endNode.$node.css("top", "220px").css("right", "0px").show();
        endNode.x = 1100 - (endNode.outerWidth);
        endNode.y = 220;
        endNode.updateConnectorPositioin();
        endNode.leftConnector.draw();
    })();

    var createConnectionLineDrawingListener = (function(){

        var isCreatingConnectionLine = false;
        var line;

        function enableConnectionLineDrawingListener(e){
            //测试点击的位置是不是在一个连接处
            bbox = flowControlCanvas.getBoundingClientRect();
            windowToCanvas(e);
            for(var idx in nodeCollection){
                var node = nodeCollection[idx];

                var targetConnector = null;

                node.leftConnector.drawPath();
                if(ctx.isPointInPath(canvasMouseX, canvasMouseY)){
                    targetConnector = node.leftConnector;
                }

                if(targetConnector === null){
                    node.rightConnector.drawPath();
                    if(ctx.isPointInPath(canvasMouseX, canvasMouseY)){
                        targetConnector = node.rightConnector;
                    }
                }

                if(targetConnector === null){
                    continue;
                }

                if(isCreatingConnectionLine /*那么已经画了线的开端，现在我要做的是画线的结尾*/){
                    line.toggleCreatingLineOnCanvas(false);
                    //最终确定了这条线之后，就应该把线的作画开头于逻辑开头同步，同样，线的作画结尾应该同逻辑结尾一样。由于一开始用户开始画线的
                    //时候可能是从逻辑结尾的位置开始画起，所以在之前的作画过程中可能作画开头恰好是逻辑结尾，首位调换。
                    if(targetConnector.type === LEFT_CONNECTOR){
                        line.logicalEnd = targetConnector;
                    } else {
                        line.logicalStart = targetConnector;
                    }

                    line.startPoint.x = line.logicalStart.getConnectionLineEndPointPositionX();
                    line.startPoint.y = line.logicalStart.getConnectionLineEndPointPositionY();

                    line.endPoint.x = line.logicalEnd.getConnectionLineEndPointPositionX();
                    line.endPoint.y = line.logicalEnd.getConnectionLineEndPointPositionY();

                    line.autoUpdateControlPoint();
                    drawEverythingHahaEverything();

                    //此时此刻这条线已经确定存在了，我可以安全地把它记录在相应地连接器里
                    line.logicalStart.connectedLines.push(line);
                    line.logicalEnd.connectedLines.push(line);

                    isCreatingConnectionLine =false;
                    line = null;
                    selectListener.selectLineListener.toggleLineSelection(true);

                    flowControlCanvas.removeEventListener("contextmenu", cancelConnectionLineDrawingListener);
                    return;
                } else {
                    isCreatingConnectionLine = true;
                    selectListener.selectLineListener.toggleLineSelection(false);

                    //创建一条连接线，并且设置这条连接线的开头（不管是左边还是右边开始画起）为所点击的连接器的中间
                    line = new ConnectionLine();
                    //刚开始作画的时候，targetConnector可以是logicalEnd, 也可以是logicalStart.换言之用户可能从尾部开始画，也可以从头开始画
                    //这里我先不管是逻辑开始还是逻辑结尾，不管是什么先用来当作画起点。等到真正画完的时候所有信息齐全了我再将作逻辑起点设置成作画
                    //起点，逻辑结尾设置成作画结尾。
                    line.startPoint.x = targetConnector.getConnectionLineEndPointPositionX();
                    line.startPoint.y = targetConnector.getConnectionLineEndPointPositionY();

                    if(targetConnector.type === LEFT_CONNECTOR){
                        line.logicalEnd = targetConnector;
                    } else {
                        line.logicalStart = targetConnector;
                    }

                    line.toggleCreatingLineOnCanvas(true);

                    flowControlCanvas.addEventListener("contextmenu", cancelConnectionLineDrawingListener);
                    return;
                }

            }
        }

        function cancelConnectionLineDrawingListener(e){
            //停止作画
            line.toggleCreatingLineOnCanvas(false);
            isCreatingConnectionLine = false;
            line = null;
            //在曲线集合中找到这个线并将其删除
            nodeConnectionLineCollection.pop();
            //重新将全部东西再画一次
            drawEverythingHahaEverything();

            //将自己（监听器）移除
            flowControlCanvas.removeEventListener("contextmenu", cancelConnectionLineDrawingListener);
            e.preventDefault();

            selectListener.selectLineListener.toggleLineSelection(true);
        }

        return {
            enableConnectionLineDrawingListener: enableConnectionLineDrawingListener
        };
    })();

    function drawEverythingHahaEverything(){
        //首先清除整个画面
        ctx.clearRect(0, 0, flowControlCanvas.width, flowControlCanvas.height);
        //画出整个背景
        paintBackground();
        //将所有的非移动的节点都重新画一遍（注意因为节点中间的HTML不用画，所以我们只需要画两个连接器就行了）
        nodeConnectionLineCollection.forEach(function(l){
            l.draw();
        });

        nodeCollection.forEach(function(n){
            n.drawConnectors();
        });
    }


    /*这里定义了选定节点和选定连接线，以及选定了这些东西用户所可以采取的各种动作*/
    var selectListener = (function enableSelectListener(){
        /*--enable selecting a node--*/
        var selectNodeListener = (function(){

            var selectedNode = null;
            var lastClickX = 0;
            var lastClickY = 0;

            function toggleNodeSelection(enable){

                if(enable){
                    canvasPositionCalculator.addEventListener("mousedown", mouseDownAction);
                } else {
                    canvasPositionCalculator.removeEventListener("mousedown", mouseDownAction);
                }

            }

            toggleNodeSelection(true);

            function mouseDownAction(e){
                if(testIfClickNode(e)){
                    lastClickX = canvasMouseX;
                    lastClickY = canvasMouseY;
                    canvasPositionCalculator.addEventListener("mouseup", mouseUpAction);
                    canvasPositionCalculator.addEventListener("mousemove",mouseMoveAction);
                    canvasPositionCalculator.addEventListener("contextmenu", rightClickAction);
                    drawEverythingWhenNodeSelected();
                }
            }

            function testIfClickNode(e){
                var isSelected = false;
                selectedNode = null;
                nodeCollection.forEach(function(n){
                    ctx.beginPath();
                    ctx.rect(n.x, n.y, n.outerWidth, n.outerHeight);
                    windowToCanvas(e);
                    if(ctx.isPointInPath(canvasMouseX, canvasMouseY)){
                        selectedNode = n;
                        isSelected = true;
                    }
                });
                return isSelected;
            }

            function mouseMoveAction(e){
                if(!selectedNode.isMoving){
                    selectedNode.$node.hide();
                    selectedNode.isMoving = true;
                }

                windowToCanvas(e);
                //update node position
                selectedNode.x = selectedNode.x + (canvasMouseX - lastClickX);
                selectedNode.y = selectedNode.y + (canvasMouseY - lastClickY);

                lastClickX = canvasMouseX;
                lastClickY = canvasMouseY;

                //update connectors position
                selectedNode.updateConnectorPositioin();
                //update related line end point position

                //draw everything when a node is selected
                drawEverythingWhenNodeSelected(true);
            }

            function rightClickAction(e){
                drawEverythingHahaEverything();
                selectedNode = null;
                e.preventDefault();
                canvasPositionCalculator.removeEventListener("contextmenu", rightClickAction);
            }

            function mouseUpAction(){
                canvasPositionCalculator.removeEventListener("mousemove",mouseMoveAction);
                canvasPositionCalculator.removeEventListener("mouseup", mouseUpAction);
                drawEverythingWhenNodeSelected(false);
            }

            function drawEverythingWhenNodeSelected(isMoving){
                ctx.clearRect(0, 0, 1100, 450);
                paintBackground();

                for(var idx in nodeConnectionLineCollection){
                    nodeConnectionLineCollection[idx].draw();
                }

                for(var idx2 in nodeCollection){
                    var node = nodeCollection[idx2];
                    if(node !== selectedNode){
                        node.drawConnectors();
                    } else {
                        if(isMoving){
                            ctx.save();
                            ctx.fillStyle = "lightgray";
                            ctx.strokeStyle = "lightgray";
                            node.drawFakeNode(node.x, node.y);
                            ctx.restore();
                        } else {
                            ctx.save();
                            ctx.fillStyle = "lightgray";
                            node.drawConnectors();
                            ctx.restore();

                            if(node.isMoving){
                                node.$node.css("top", node.y).css("left", node.x).show();
                                node.isMoving = false;
                            }
                        }
                    }
                }
            }

            function getSelectedNode(){
                return selectedNode;
            }

            return {
                toggleNodeSelection: toggleNodeSelection,
                getSelectedNode: getSelectedNode
            };
        })();


        /*--enable selecting a line--*/
        var selectLineListener = (function(){
            var line = null; //line selected.

            function toggleLineSelection(enable){
                if(enable){
                    flowControlCanvas.addEventListener("click", selectLineAction);
                } else {
                    flowControlCanvas.removeEventListener("click", selectLineAction);
                }
            }

            toggleLineSelection(true);

            function selectLineAction(e){
                //测试是否点击在线上
                for(var idx in nodeConnectionLineCollection){
                    var l = nodeConnectionLineCollection[idx];
                    l.drawPath();
                    bbox = flowControlCanvas.getBoundingClientRect(); //因为滑块滑来滑去所以我们要确保这个BBOX被重新计算过一次
                    windowToCanvas(e);
                    if(ctx.isPointInStroke(canvasMouseX, canvasMouseY)){
                        line = l;
                        drawEverythingWhenLineSelected();
                        //重复添加同一个监听器：如果已经有了一个监听器就不会再添加了。所以这里可以放心使用
                        toggleControlPointMove(true);//由于这条线已经选定了所以现在用户可以移动它的控制点
                        flowControlCanvas.addEventListener("contextmenu", cancelSelection);
                        break;
                    }
                }
            }

            function drawEverythingWhenLineSelected(){
                ctx.clearRect(0, 0, 1100, 450);
                paintBackground();

                nodeConnectionLineCollection.forEach(function(l){
                    if(l !== line){
                        l.draw();
                    }
                });

                //覆盖原来的颜色
                ctx.save();
                ctx.lineWidth = 3.5;
                ctx.strokeStyle = "lightgray";
                line.draw();
                line.drawControlPoints();
                ctx.restore();

                nodeCollection.forEach(function(n){
                    n.drawConnectors();
                });
            }

            function cancelSelection(e){
                e.preventDefault();
                line = null;
                drawEverythingHahaEverything();
                toggleControlPointMove(false);
                flowControlCanvas.removeEventListener("contextmenu", cancelSelection);
            }


            function testIfClickControlPoint(e){
                windowToCanvas(e);
                ctx.beginPath();
                ctx.arc(line.controlPointOne.x, line.controlPointOne.y, 5, 0, Math.PI * 2, false);
                if(ctx.isPointInPath(canvasMouseX, canvasMouseY)){
                    isDragging = true;
                    controlPointDragging = 1;
                    return;
                }

                ctx.beginPath();
                ctx.arc(line.controlPointTwo.x, line.controlPointTwo.y, 5, 0, Math.PI * 2, false);
                if(ctx.isPointInPath(canvasMouseX, canvasMouseY)){
                    controlPointDragging = 2;
                    isDragging = true;
                }
            }

            function controlPointMoveAction(e){
                if(isDragging) {
                    //那么用户现在正在拖拽
                    windowToCanvas(e);
                    if(controlPointDragging === 1){
                        line.controlPointOne.x = canvasMouseX;
                        line.controlPointOne.y = canvasMouseY;
                    } else {
                        line.controlPointTwo.x = canvasMouseX;
                        line.controlPointTwo.y = canvasMouseY;
                    }
                    drawEverythingWhenLineSelected();
                }
            }

            function stopDragging(){
                isDragging = false;
            }

            var isDragging = false;
            var controlPointDragging = 1; //1 for control point one, and 2 for control point two.
            function toggleControlPointMove(enable){
                if(enable){
                    flowControlCanvas.addEventListener("mousedown", testIfClickControlPoint);
                    flowControlCanvas.addEventListener("mousemove", controlPointMoveAction);
                    flowControlCanvas.addEventListener("mouseup", stopDragging);
                } else {
                    flowControlCanvas.removeEventListener("mousedown", testIfClickControlPoint);
                    flowControlCanvas.removeEventListener("mousemove", controlPointMoveAction);
                    flowControlCanvas.removeEventListener("mouseup", stopDragging);
                }



            }

            function getSelectedLine(){
                return line;
            }

            return {
                toggleLineSelection: toggleLineSelection,
                getSelectedLine: getSelectedLine
            };
        })();

        return {
            selectLineListener: selectLineListener,
            selectNodeListener: selectNodeListener
        };
    })();


    //对外提供创建节点的接口。附带以下功能：启动创建连接线的监听器.
    flowController.command = (function(){
        //启动创建连接线的监听器
        function enableConnectionLineDrawing(){
            flowControlCanvas.addEventListener("click",createConnectionLineDrawingListener.enableConnectionLineDrawingListener);
        }
        enableConnectionLineDrawing();
        //取消上述的监听器
        function disableConnectionLineDrawing(){
            flowControlCanvas.removeEventListener("click", createConnectionLineDrawingListener.enableConnectionLineDrawingListener);
        }

        //此为对外提供的接口，用以创建一个新的节点
        function createNewNode(content){
            disableConnectionLineDrawing();
            selectListener.selectNodeListener.toggleNodeSelection(false);

            function actionAfterNodeCreation(){
                flowController.set_all_command_buttons();
                menu_system.fly_in_button();
                enableConnectionLineDrawing();
                selectListener.selectNodeListener.toggleNodeSelection(true);
            }

            var node = new Node(content);
            node.startMovement(actionAfterNodeCreation);
        }
        return {createNewNode: createNewNode};
    })();

    flowController.buttonAction = (function(){

        function removeCriterion(){
            selectListener.selectNodeListener.getSelectedNode().remove();
            drawEverythingHahaEverything();
        }

        function removeLine(){
            selectListener.selectLineListener.getSelectedLine().remove();
            drawEverythingHahaEverything();
        }

        return {
            startConfiguringNodeContent: flow_control_configure_node_content.startConfiguringNodeContent,
            removeCriterion: removeCriterion,
            removeLine: removeLine
        }
    })();

});


/* ---------------- 这些是各种命令和导航按钮的设置方法 -----------------*/
flowController.set_all_command_buttons = function(){
    menu_system.configure_command_button("New Criterion", flowController.buttonAction.startConfiguringNodeContent);
    menu_system.configure_command_button("Edit Content", function(){alert(1)});
    menu_system.configure_command_button("Remove Criterion", flowController.buttonAction.removeCriterion);
    menu_system.configure_command_button("Remove Line", flowController.buttonAction.removeLine);
};


