(function() {
    var root = document.querySelector("#root"),
        arr = [],
        buttonList = document.querySelector("#buttonList"),
        searchValue = document.querySelector("#search-input").value.trim(),
        searchButton = document.querySelector("#search-button"),
        delButton = document.querySelector("#del-button"),
        newNodeButton = document.querySelector("#newNode-button");
        
    
    var BFT = {
        // 二叉树的中序遍历
        inOrderTraverse : function (root, callback) {
            inOrderTraverseNode(root, callback);
            
            function inOrderTraverseNode(node, callback) {
                if(node !== null) {
                    inOrderTraverseNode(node.firstElementChild, callback);
                    callback(node);
                    // 递归遍历下一个兄弟节点
                    if(node.firstElementChild) {
                        var temp = node.firstElementChild.nextElementSibling;
                        while(temp) {
                            var p = temp;
                            inOrderTraverseNode(temp, callback);
                            temp = p.nextElementSibling;
                        }
                    }
                }
            } 
        },
        
        // 二叉树的先序遍历
        preOrderTraverse : function (root, callback) {
            preOrderTraverseNode(root, callback);
            
            function preOrderTraverseNode(node, callback) {
                if(node !== null) {
                    callback(node);
                    preOrderTraverseNode(node.firstElementChild, callback);
                    if(node.firstElementChild) {
                        var temp = node.firstElementChild.nextElementSibling;
                        while(temp) {
                            var p = temp;
                            preOrderTraverseNode(temp, callback);
                            temp = p.nextElementSibling;
                        }
                    }
                }
            } 
        },
        
        // 二叉树的后序遍历
        postOrderTraverse : function (root, callback) {
            postOrderTraverseNode(root, callback);
            
            function postOrderTraverseNode(node, callback) {
                if(node != null) {
                    postOrderTraverseNode(node.firstElementChild, callback);
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
    
    function operation(node) {
        arr.push(node);
    }
    
    function removeClass (i) {
        arr[i - 1].classList.remove("active");
    }
    
    function selectOpt () {
        var target = event.target,
            opt = target.getAttribute("name");
        
        arr.length = 0; 
        
        if(opt === "inOrder") {
            BFT.inOrderTraverse(root, operation);
            traverseAnimation()
        } else if(opt === "preOrder") {
            BFT.preOrderTraverse(root, operation);
            traverseAnimation()
        } else if(opt === "postOrder") {
            BFT.postOrderTraverse(root, operation);
            traverseAnimation()
        } 
    }
    
    
    function traverseAnimation() {
        var i = 0;
        
        setInterval(function () {
            if( i < arr.length ) {
                arr[i].classList.add("active");
                // 查找
                var searchValue = document.querySelector("#search-input").value.trim();
                if(arr[i].childNodes[0].data.trim() == searchValue) {
                    arr[i].classList.add("find");
                }
                i++;
                setTimeout(function () {
                    removeClass(i);
                }, 500);
            }
        }, 1000);
        
    }
    
    function addActiveClass(event) {
        event.stopPropagation;
        var target = event.target;
        BFT.inOrderTraverse(root, removeActiveClass);
        target.classList.add("active");
        
        // 删除节点的事件绑定
        delButton.addEventListener("click", removeActiveNode.bind(null, target), false);
        
        // 添加节点的事件绑定
        newNodeButton.addEventListener("click", addChildNode.bind(null, target), false);
    }
    
    function removeActiveClass(node) {
        event.stopPropagation;
        node.classList.remove("active");
    }
    
    function removeActiveNode(target) {
        event.stopPropagation;
        if(target.parentNode) {
            target.parentNode.removeChild(target);
        }
    }
    
    function addChildNode (target) {
        event.stopPropagation;
        var  nodeValue = document.querySelector("#new-node-input").value.trim();
        if(nodeValue && target.classList.contains("active")) {
            var docfrag = document.createDocumentFragment(),
                node = document.createElement("div");
            
            node.textContent = nodeValue;
            docfrag.appendChild(node);
            target.appendChild(docfrag);
        }
    }
        
    
    
    function init () {
        buttonList.addEventListener("click", selectOpt, false);
        searchButton.addEventListener("click", selectOpt, false);
        
        root.addEventListener("click", addActiveClass, false);
    }
    
    init();
    
})();