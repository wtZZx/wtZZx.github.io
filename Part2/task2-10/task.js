(function() {
    var root = document.querySelector("#root");
    var arr = [];

    var BFT = {
        inOrderTraverse : function (root, callback) {
            inOrderTraverseNode(root, callback);
            
            function inOrderTraverseNode(node, callback) {
                if(node !== null) {
                    inOrderTraverseNode(node.firstElementChild, callback);
                    operation(node);
                    inOrderTraverseNode(node.lastElementChild, callback);
                }
            } 
        },
        
        preOrderTraverse : function (root, callback) {
            preOrderTraverseNode(root, callback);
            
            function preOrderTraverseNode(node, callback) {
                if(node !== null) {
                    operation(node);
                    preOrderTraverseNode(node.firstElementChild, callback);
                    preOrderTraverseNode(node.lastElementChild, callback);
                }
            } 
        },
        
        postOrderTraverse : function (root, callback) {
            postOrderTraverseNode(root, callback);
            
            function postOrderTraverseNode(node, callback) {
                if(node != null) {
                    postOrderTraverseNode(node.firstElementChild, callback);
                    postOrderTraverseNode(node.lastElementChild, callback);
                    operation(node);
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
    
    var buttonList = document.querySelector("#buttonList");
    
    buttonList.addEventListener("click", function () {
        
        var target = event.target,
            opt = target.getAttribute("name"),
            i = 0;
        
        arr.length = 0;    
        
        if(opt === "inOrder") {
            BFT.inOrderTraverse(root, operation);
        } else if(opt === "preOrder") {
            BFT.preOrderTraverse(root, operation);
        } else if(opt === "postOrder") {
            BFT.postOrderTraverse(root, operation);
        }
        
        setInterval(function () {
            if( i < arr.length ) {
                arr[i++].classList.add("active");
                setTimeout(function () {
                    removeClass(i);
                }, 500);
            }
        }, 1000);
        
    }, false);
    
})();