(function() {
    var root = $("#root"),
        arr = [],
        testButton = $("#test"),
        delButton = $("#del-button");
         
    var BFT = {
        // 二叉树的后序遍历
        postOrderTraverse : function (root, callback) {
            postOrderTraverseNode(root, callback);
            
            function postOrderTraverseNode(node, callback) {
                if(node !== null) {
                    if(node.nodeName.toLowerCase() == "ul" || node.nodeName.toLowerCase() == "li") {
                        postOrderTraverseNode(node.firstElementChild, callback);               
                        // 递归遍历下一个兄弟节点
                        if(node.firstElementChild) {
                            var temp = node.firstElementChild.nextElementSibling;
                            while(temp) {
                                var p = temp;
                                postOrderTraverseNode(temp, callback);
                                temp = p.nextElementSibling;
                            }
                        }
                        callback(node);
                    }
                }
            } 
        }
    }
    
    function operation(node) {
        arr.push(node);
    }

    function processSearchButton () {
        var target = event.target,
            opt = target.getAttribute("name"); 
        // 置空 arr 
        arr = [];
        if(opt === "postOrder") {
            BFT.postOrderTraverse(root, operation);
            searchInTree();
        } else {
            console.log("Error");
        }
    }
    
    // 查找
    function searchInTree() {
        var searchValue = $("#search-input").value.trim();
        // 清空之前找到的样式
        arr.forEach(function (element) {
            element.querySelector("span").classList.remove("find");
        }, this);

        arr.forEach(function (element) {
            var dataValue = element.querySelector("span").textContent.trim();
            if(element.nodeName.toLowerCase() == "li") {
                if(dataValue === searchValue) {
                    openFloded(element);
                    element.querySelector("span").classList.add("find");
                }
            }
        }, this);
    }
    
    // 找到展开
    function openFloded (node) {
        var temp = node;
        if(!temp.firstElementChild.firstElementChild.classList.contains("fa-folder-open")) {
            processSwitchList(temp, "li");
        }
        while(temp.getAttribute("name") !== "root-child") {
            temp = temp.parentNode.parentNode;
            if(!temp.firstElementChild.firstElementChild.classList.contains("fa-folder-open")) {
                processSwitchList(temp, "li");
            }
        }
    }
    
    // 鼠标悬停样式
    function addActiveClass(event) {
        event.stopPropagation;
        var target = event.target;
        if(target.nodeName.toLowerCase() === "li") {
            BFT.postOrderTraverse(root, removeActiveClass);
            target.classList.add("active");
        }
    }
    
    function removeActiveClass(node) {
        node.classList.remove("active");
    }
    
    // 点击列表的折叠处理
    function processClickRoot (event) {
        var target = event.target,
            targetName = target.nodeName.toLowerCase();
        if(targetName == "li" || targetName == "span" || target.getAttribute("name") == "switch") {
            processSwitchList(target, targetName);
        } else if(target.getAttribute("name") == "del") {
            processDelList(target);
        } else if(target.getAttribute("name") == "add") {
            processAddList(target);
        }
    }
    
    // 节点的折叠
    function processSwitchList(node, nodeName) {
        if(nodeName === "li") {
            if(node.firstElementChild.nextElementSibling) {
                classSwitchProcesee(node.firstElementChild.nextElementSibling, "show", "hidden");
            }
            classSwitchProcesee(node.firstElementChild.firstElementChild, "fa-folder-open", "fa-folder");
        } else if(nodeName === "span") {
            if(node.nextElementSibling) {
                classSwitchProcesee(node.nextElementSibling, "show", "hidden");
            }
            classSwitchProcesee(node.firstElementChild, "fa-folder-open", "fa-folder");
        } else if(nodeName === "i") {
            if(node.parentNode.nextElementSibling) {
                classSwitchProcesee(node.parentNode.nextElementSibling, "show", "hidden");
            }
            classSwitchProcesee(node, "fa-folder-open", "fa-folder");
        }
    }
    
    // 处理删除
    function processDelList (node) {
        console.log(node.parentNode.parentNode.textContent.trim());
        var delTip = node.parentNode.parentNode.textContent.trim();
        if(confirm("确认删除{ " + delTip + " }？")) {
            var parentNode = node.parentNode.parentNode.parentNode;
            parentNode.removeChild(node.parentNode.parentNode);
        }
    }
    
    // 添加节点
    function processAddList (node) {
        var inputTip = node.parentNode.textContent.trim(),
            inputValue = prompt("将在 {" + inputTip + "} 下创建新节点", "随便来点喽？");
        if(inputValue) {
            if(node.parentNode.nextElementSibling) {
                node.parentNode.nextElementSibling.appendChild(createNodeFactor.createList(inputValue, true));
            } else {
                insertAfter(createNodeFactor.createList(inputValue, false), node.parentNode);
            }
        }
    } 
    
    // 切换样式方法
    function classSwitchProcesee (node, className1, className2) {
        node.classList.toggle(className1);
        node.classList.toggle(className2);
    }
    
    // 创建一个完整的节点
    var createNodeFactor = {
        
        createList: function (inputValue, flag) {
            var li = document.createElement("li"),
                span = document.createElement("span"),
                delI = document.createElement("i"),
                switchI = document.createElement("i"),
                addI = document.createElement("i"),
                textNode = document.createTextNode(inputValue);
            
            switchI.classList.add("fa");
            switchI.classList.add("fa-folder-open");
            switchI.setAttribute("name", "switch");
            
            delI.classList.add("fa");
            delI.classList.add("fa-times");
            delI.setAttribute("name", "del");
            
            addI.classList.add("fa");
            addI.classList.add("fa-plus");
            addI.setAttribute("name", "add");
            
            span.appendChild(switchI);
            span.appendChild(delI);
            span.appendChild(addI);
            span.appendChild(textNode);
            li.appendChild(span);
            
            if(flag) {
                return li;
            } else {
                var ul = document.createElement("ul");
                ul.classList.add("show");
                ul.appendChild(li);
                return ul;
            }
        }
    }
    
    // insertAfter 方法
    function insertAfter (newNode, referenceNode) {
        var parent = referenceNode.parentNode;
        if(parent.lastElementChild === referenceNode) {
            parent.appendChild(newNode);
        } else {
            parent.insertBefore(newNode, referenceNode.nextElementSibling);
        }
    }
    
    
    // 选择器
    function $(element) {
        return document.querySelector(element);
    }
    
    function $$(element) {
        return document.querySelectorAll(element);
    }
    
    function init () {
        testButton.addEventListener("click", processSearchButton, false);
        root.addEventListener("mouseover", addActiveClass, false);
        root.addEventListener("click", processClickRoot, false);
    }
    
    init();
    
})();