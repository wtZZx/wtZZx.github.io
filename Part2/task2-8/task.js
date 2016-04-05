var inputBox = document.querySelector("#input-box"),
    queueList = document.querySelector("#Queue-list"),
    searchInput = document.querySelector("#search-input"),
    searchButton = document.querySelector("#search"),
    button = document.querySelector("fieldset");
        
var queue= new Queue();
var inputProcessResult = undefined;
    
    // 渲染列表的系列方法
    var render = {
        push: function (docfrag) {
            queueList.appendChild(docfrag);
        },
        
        pop: function () {
            queueList.removeChild(queueList.lastElementChild);
        },
        
        shift: function () {
            queueList.removeChild(queueList.firstElementChild);
        },
        
        unshift: function (docfrag) {
            queueList.insertBefore(docfrag, queueList.firstElementChild);
        },
        
        clickRemove: function removeList(event) {
            var target = event.target,
                Lists = document.querySelectorAll("#Queue-list li");
            for(var i = 0 ; i < Lists.length ; i++) {
                if(Lists[i] == target) {
                    queue.splice(i);
                    queueList.removeChild(target);
                } else {
                    console.log("fale");
                }
            }
            queue.print();
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
    
    // 处理输入 
    
    function inputProcess (event) {
        var inputValue = inputBox.value.trim(),
            patt = /[\t\r\n\v,，＼、 　 ]/g,
            target = event.target;
            targetName = target.getAttribute("name");
        if(targetName == "shift" || targetName == "pop") {
            selectOpt(target);
        } else {
            inputProcessResult = inputValue.split(patt);
            console.log(inputProcessResult); 
            selectOpt(target, inputProcessResult);
        }
    }
    
    // 模糊查询的处理
    
    function searchProcess () {
        var searchInputValue = searchInput.value.trim(),
            patt = new RegExp(searchInputValue, "i");
            lists = queueList.querySelectorAll("li");
        for(var i = 0 ; i < lists.length ; i++) {
            if(patt.exec(lists[i].textContent)) {
                console.log(lists[i]);
                lists[i].classList.add("find");
                lists[i].style.backgroundColor = "#999";
            } else {
                lists[i].classList.remove("find");
                lists[i].style.backgroundColor = "rgb(" + randomRGB() + "," + randomRGB() + "," + randomRGB() + ")";
                console.log(false, i);
            }
        }     
    }
    
    // 队列与方法
    function Queue() {
        var items = [];
        
        this.items = function () {
            return items;
        }
        
        this.push = function (element) {
            items.push(element);
            render.push(createList(element));
        };
        
        this.pop = function () {
            items.pop();
            render.pop();
        };
        
        this.shift = function () {
            items.shift()
            render.shift();
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
        }
    }
    
    // 判断队列的后续行为
    function selectOpt(target, inputValue) {
        var opt = target.getAttribute("name");
        if(inputValue) {
            for(var i = 0 ; i < inputValue.length ; i++) {
                queue[opt](inputValue[i]);
            }
        } else {
             queue[opt]();
        }
        
        queue.print();
    }
    
    // 事件绑定
    button.addEventListener("click", inputProcess, false);
    queueList.addEventListener("click", render.clickRemove, false);
    searchButton.addEventListener("click", searchProcess, false);
