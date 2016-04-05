window.onload = function () {
    var inputBox = document.querySelector("#input-box"),
        queueList = document.querySelector("#Queue-list"),
        tagList = document.querySelector("#tag-list"),
        searchInput = document.querySelector("#search-input"),
        searchButton = document.querySelector("#search"),
        tagInput = document.querySelector("#tag"),
        button = document.querySelector("fieldset");
    
    // 兴趣队列  
    var queue= new Queue();
    // tag 队列
    var tagQueue = new Queue();
    var inputProcessResult = undefined;
    
    // 队列与方法
    function Queue() {
        var items = [];
        
        this.items = function () {
            return items;
        }
        
        this.push = function (listElement, element) {
            items.push(element);
            render.push(listElement, createList(element));
        };
        
        this.pop = function (listElement) {
            items.pop();
            render.pop(listElement);
        };
        
        this.shift = function (listElement) {
            items.shift()
            render.shift(listElement);
        };
        
        this.unshift = function (element) {
            items.unshift(element);
            render.unshift(createList(element));
        };
        
        this.splice = function (pos) {
            items.splice(pos, 1);
        }
        
        this.size = function () {
            return items.length;
        };
        
        this.front = function () {
            return items[0];
        };
        
        this.print = function () {
            console.log(items.toString());
        };
        
        // 处理重复
        this.isInQueue = function (ele) {
            if(!Array.isArray(ele) && items.indexOf(ele) == -1) {
                return true;
            } else if(Array.isArray(ele)) {
                for(var i = 0 ; i < ele.length; i++) {
                    if(items.indexOf(ele[i]) != -1) {
                        ele.splice(i, 1);
                    }
                }
                return ele;
            }
        }
    }
    
    // 渲染列表
    var render = {
        push: function (listElement, docfrag) {
            listElement.appendChild(docfrag);
        },
        
        pop: function (listElement) {
            listElement.removeChild(listElement.lastElementChild);
        },
        
        shift: function (listElement) {
            listElement.removeChild(listElement.firstElementChild);
        },
        
        unshift: function (listElement, docfrag) {
            listElement.insertBefore(docfrag, listElement.firstElementChild);
        },
        
        // tag 的点击删除
        clickRemove: function removeList(event) {
            var target = event.target,
                Lists = tagList.querySelectorAll("li");
            for(var i = 0 ; i < Lists.length ; i++) {
                if(Lists[i] == target) {
                    tagQueue.splice(i);
                    tagList.removeChild(target);
                } else {
                    console.log("fale");
                }
            }
            tagQueue.print();
        }
    }
    
    // 随机颜色
    function randomRGB() {
        return Math.floor(Math.random() * 255);
    }
    
    // 创建节点
    function createList(value) {
        var docfrag = document.createDocumentFragment(),
            listElement = document.createElement("li");
        
        listElement.style.backgroundColor = "rgb(" + randomRGB() + "," + randomRGB() + "," + randomRGB() + ")";
        listElement.textContent = value;
        
        docfrag.appendChild(listElement);   
        return docfrag;   
    }
    
    
    // 检测输入的数据是否合法
    function checkInput (event) {
        var inputPatt = /^\d{1,}$/g,
            inputValue = inputBox.value.trim();
            target = event.target;
        if(inputPatt.test(inputValue)) {
            // 判断动作
            selectOpt(target, inputValue);
        } else {
            alert("只能输入数字");
        }
    }
    
    // 处理输入的兴趣 
    function inputProcess (event) {
        var inputValue = inputBox.value.trim(),
            patt = /[\t\r\n\v,，＼、 　 ]/g,
            target = event.target;
            targetName = target.getAttribute("name");
        if(targetName == "shift" || targetName == "pop") {
            selectOpt(target);
        } else {
            inputProcessResult = inputValue.split(patt);
            var tempArr = []
            for(var i = 0 ; i < inputProcessResult.length ; i++) {
                if(tempArr.indexOf(inputProcessResult[i]) == -1 ) {
                    tempArr.push(inputProcessResult[i]);
                }
            }
            inputProcessResult = tempArr;
            console.log(inputProcessResult); 
            selectOpt(target, inputProcessResult);
            inputBox.value = "";
        }
    }
    
    
    // 根据动作渲染队列
    function selectOpt(target, inputValue) {
        var opt = target.getAttribute("name");
        console.log("items：");
        queue.print()
        inputValue = queue.isInQueue(inputValue);
        if(inputValue) {
            for(var i = 0 ; i < inputValue.length ; i++) {
                if(isOverflow(queue)) {
                    queue.shift(queueList);
                }
                queue[opt](queueList , inputValue[i]);
            }
        } else {
             queue[opt]();
        }
        
        queue.print();
    }
    
    // tag 输入的处理
    function tagInputEventProcess (event) {
        var inputData = event.data;
        var patt = /[,|，| |\r]/;
        if(patt.test(inputData) || event.code == "Enter") {
            var inputValue = event.target.value;
            inputValue = inputValue.replace(/[，|,]/g, "").trim();
            // 去重
            if(tagQueue.isInQueue(inputValue) && inputValue != "") {
                if(isOverflow(tagQueue)) {
                    tagQueue.shift(tagList);
                }
                tagQueue.push(tagList, inputValue);
                event.target.value = "";
            } else {
                event.target.value = "";
            }
        }
    }
    
    // 判断是否超过 10 个
    function isOverflow(queue) {
        var size = queue.size();
        console.log(size);
        if(size >= 10) {
            return true;
        } else {
            return false;
        }
    }
    
    // 添加删除提示字
    function  addRemoveTip(event) {
        var target = event.target,
            targetValue = target.textContent.trim();
        if(event.type == "mouseover") {
            if(target.nodeName.toLowerCase() == "li" && target.textContent.substring(0,2) != "删除") {
                target.textContent = "删除" + targetValue;
                target.addEventListener("click", render.clickRemove, false);
            }
        } else if(event.type == "mouseout") {
            if(target.textContent.substring(0,2) == "删除") {
                target.textContent = target.textContent.substring(2,target.textContent.length);
            }
        }
        
    }
    
    
    function init() {
        button.addEventListener("click", inputProcess, false);
        queueList.addEventListener("click", render.clickRemove, false);
        tagInput.addEventListener("textInput", tagInputEventProcess, false);
        tagInput.addEventListener("keypress", tagInputEventProcess, false);
        tagList.addEventListener("mouseover", addRemoveTip, false);
        tagList.addEventListener("mouseout", addRemoveTip, false);
    }
    
    init();
    
}