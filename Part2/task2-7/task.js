window.onload = function () {
    
    var inputBox = document.querySelector("#input-box"),
        queueList = document.querySelector("#Queue-list"),
        sortButton = document.querySelector("#sort"),
        random = document.querySelector("#random"),
        button = document.querySelector("fieldset");
        
    var queue= new Queue();
    
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
        },
        
        sort: function () {
            var lists = queueList.querySelectorAll("li");
            var arrayList = [];
            for(var i = 0 ; i < lists.length; i++) {
                arrayList[i] = parseInt(lists[i].textContent);
                for(var j = 0 ; j < lists.length - 1 - i ; j++) {
                    if(parseInt(lists[j].textContent) > parseInt(lists[j+1].textContent)) {
                        swap(lists[j], lists[j + 1]);
                    }
                }
            }
            
            function swap(listsJ, listJPlus) {
                var tempNode = queueList.removeChild(listsJ);
                queueList.insertBefore(tempNode, listJPlus.nextSlibing);
            }
            
            return arrayList;
            
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
        listElement.style.height = value + "px";
        
        docfrag.appendChild(listElement);   
        return docfrag;   
    }
    
    
    // 检测输入的数据是否合法
    function checkInput (event) {
        event.stopPropagation();
        var inputPatt = /^\d{1,}$/g,
            inputValue = inputBox.value.trim();
            target = event.target;
        if(inputPatt.test(inputValue) && (parseInt(inputValue) > 10 && parseInt(inputValue) < 100) && (queue.size() < 60)) {
            // 判断动作
            selectOpt(target, inputValue);
        } else {
            alert("只能输入数字且为 10 ~ 100 || 点到空了");
        }
    }
    
    // 队列与方法
    function Queue() {
        var items = [];
        
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
        };
        
        this.sort = function () {
            items.sort(function (a, b) {
                return a - b;
            });
            return items;
        };
        
        
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
        queue[opt](inputValue);
        queue.print();
    }
    
    function sortTimer(event) {
        event.stopPropagation();
        var array = queue.sort();
                
        (function () {
            var timer = setInterval ( function () {
                var arrayList = render.sort();
                canStop();
                function canStop() {
                    var flag = true;
                    for(var i = 0 ; i < array.length ; i++) {
                        if(array [i] != arrayList[i]) {
                            flag = false;
                            break;
                        }
                    }
                    if(flag) {
                        clearInterval(timer);
                        console.log("clear");
                    }
                }
           }, 100)
       })();

    }
    
    function randomNum(event) {
        event.stopPropagation();
        var ranNum = undefined;
        for(var i = 0 ; i < 20 ; i++) {
            ranNum = Math.floor(Math.random() * 190 + 10);
            queue.push(ranNum);
        }
        queue.print();
    }
    
    // 事件绑定
    button.addEventListener("click", checkInput, false);
    queueList.addEventListener("click", render.clickRemove, false);
    sortButton.addEventListener("click", sortTimer, false);
    random.addEventListener("click", randomNum, false);
};