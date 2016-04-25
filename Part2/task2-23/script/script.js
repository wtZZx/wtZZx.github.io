(function () {
    
    // 小方块对象
    function Square(pointX, pointY) {
        this.pointX = pointX;
        this.pointY = pointY;
        
        this.squ = this.initRender();
        this.rotateBase = 0;
        // 方向集合
        this.direction = ["top", "left", "bottom", "right"];
        this.Sign = this.direction[0];
    }
    
    // 初始化渲染
    Square.prototype.initRender = function () {
        var div = document.createElement("div"),
            tableWrap = document.querySelector(".table-wrap");
            
        div.classList.add("square-style");
        div.style.transform = "rotate(" + this.rotateBase +"deg)";
        div.style.top = (this.pointX * 50) + "px";
        div.style.left = (this.pointY * 50) + "px";
        
        tableWrap.appendChild(div);
        return div;
    }
    
    // 旋转
    Square.prototype.rotate = (function () {
        
        return {
            baseRotate: function (base, flag) {  
                var preDeg = 5;
                var timer = setInterval(rotateAnimation.bind(this), 10);
                var rotateCount = 0;
                function rotateAnimation() {
                    if(this.rotateBase !== base) {
                        if(flag) {
                            this.rotateBase += preDeg;
                        } else {
                            this.rotateBase -= preDeg;
                        }
                        this.squ.style.transform = "rotate(" + this.rotateBase + "deg)";
                    } else {
                        clearInterval(timer);
                    }
                }
            },
            
            moveRotate: function (sign) {
                var base = 0;
                while(this.Sign !== sign) {
                    this.direction.unshift(this.direction.pop());
                    this.Sign = this.direction[0];
                    base += 90;
                }
                if(base !== 0) {
                    this.rotate.baseRotate.call(this, base + this.rotateBase, true);
                }
            }
        }
        
    })();
    
    // 处理指令
    Square.prototype.processCommond = {
        
        "GO": function () {
            this.moveStrategies[this.Sign].call(this);
        },
        
        "TUN LEF": function () {
            this.direction.push(this.direction.shift());
            this.Sign = this.direction[0];
            this.rotate.baseRotate.call(this, this.rotateBase - 90, false);
        },
            
        "TUN RIG": function (base) {
            this.direction.unshift(this.direction.pop());
            this.Sign = this.direction[0];
            this.rotate.baseRotate.call(this, this.rotateBase + 90, true);
        },
        
        "TUN BAC": function (base) {
            for(var i = 0; i < 2; i++) {
                this.direction.unshift(this.direction.pop());
            }
            this.Sign = this.direction[0];
            this.rotate.baseRotate.call(this, this.rotateBase + 180, true);
        },
        
        "TRA LEF": function () {
            this.moveStrategies["left"].call(this);
        },
        
        "TRA TOP": function () {
            this.moveStrategies["top"].call(this);
        },
        
        "TRA RIG": function () {
            this.moveStrategies["right"].call(this);
        },
        
        "TRA BOT": function () {
            this.moveStrategies["bottom"].call(this);
        },
        
        "MOV LEF": function () {
            this.rotate.moveRotate.call(this, "left");
            this.processCommond["GO"].call(this);
        },
        
        "MOV TOP": function (that) {
            this.rotate.moveRotate.call(this, "top");
            this.processCommond["GO"].call(this);
        },
        
        "MOV RIG": function (that) {
            this.rotate.moveRotate.call(this, "right");
            this.processCommond["GO"].call(this);
        },
        
        "MOV BOT": function (that) {
            this.rotate.moveRotate.call(this, "bottom");
            this.processCommond["GO"].call(this);
        }
    }
    
    Square.prototype.moveRender = function (size, sign, flag) {
        
        var base = 5;
        var timer = setInterval(moveAnimation.bind(this), 30);
        
        if(!flag) {
            base = -5;
        }
        
        // 动画
        function moveAnimation() {
            var positionNum = parseInt((this.squ.style[sign]).replace(/px/, ""));
            if(positionNum !== size) {
                this.squ.style[sign] = (positionNum + base) + "px";
            } else {
                clearInterval(timer);
            }
        }
    }
    
    Square.prototype.moveStrategies = {
        "top": function () {
            if(this.isOverstep(this.pointX - 1, this.pointY)) {
                this.pointX -= 1;
                this.moveRender(this.pointX * 50, "top", false);
            } else {
                console.log("越界");
            }
        },
        
        "left": function () {
            if(this.isOverstep(this.pointX, this.pointY - 1)) {
                this.pointY -= 1;
                this.moveRender(this.pointY * 50, "left", false);
            } else {
                console.log("越界");
            }
        },
        
        "bottom": function () {
            if(this.isOverstep(this.pointX + 1, this.pointY)) {
                this.pointX += 1;
                this.moveRender(this.pointX * 50, "top", true);
            } else {
                console.log("越界");
            } 
        },
        
        "right": function () {
            if(this.isOverstep(this.pointX, this.pointY + 1)) {
                this.pointY += 1;
                this.moveRender(this.pointY * 50, "left", true);
            } else {
                console.log("越界");
            }
        }
    }
    
    // 检验是否越界
    Square.prototype.isOverstep = function (pointX, pointY) {
        if(pointX >= 1 && pointX <= 10 && pointY >= 1 && pointY <= 10) {
            return true;
        } else {
            return false;
        }
    }
    
    
    function init() {
        var pointX = Math.floor(Math.random() * 9 + 1),
            pointY = Math.floor(Math.random() * 9 + 1);
        
        var runButton = document.querySelector("#run"),
            commondInput = document.querySelector("#command-input"),
            lineList = document.querySelector(".line-list"),
            lineNum = 1;
        
        var checkCommond = /^GO( \d){0,1}$|^TUN( LEF| RIG| BAC)$|^TRA (LEF|TOP|RIG|BOT)( \d){0,1}$|^MOV (LEF|TOP|RIG|BOT)( \d){0,1}$/i;
        
        // 初始化小方块
        var squ = new Square(pointX, pointY);
        
        // 添加侧边行数
        commondInput.addEventListener("keydown", function (event) {
            if(event.code === "Enter") {
                var li = document.createElement("li");
                li.textContent = ++lineNum;
                lineList.appendChild(li);
            }
        }, false);
        
        
        // 行号随文本框一同滚动
        commondInput.addEventListener("scroll", function () {
            lineList.scrollTop = event.target.scrollTop;
        });
        
        runButton.addEventListener("click", function () {
            var commond = commondInput.value.trim();
            commondArray = commond.split(/\n/g);
            var commondBak = commondArray;
            var i = 0;
            
            commondArray = processRepeat(commondArray);
            
            commondBak.forEach(function(element, index) {
                if(checkCommond.test(element)) {
                    lineList.querySelectorAll("li")[index].style.backgroundColor = "green";
                } else {
                    lineList.querySelectorAll("li")[index].style.backgroundColor = "red";
                }
            }, this);
            
            var timer = setInterval(function () {
                if(i < commondArray.length) {
                    commondArray[i] = commondArray[i].toUpperCase();
                    try {
                        squ.processCommond[commondArray[i]].call(squ);
                        i++;
                    } catch(e) {
                        console.log(e);
                        clearInterval(timer);
                    }
                } else {
                    clearInterval(timer);
                }
            }, 500);
           
        }, false);
    }
    
    // 处理带参数的指令
    function processRepeat (commondArray) {
        var findNum = /\d{1,}/;
        var noRepeatCommond = undefined;
        var repeatCount = undefined;
        var newArr = [];
        
        for(var i = 0; i < commondArray.length; i++) {
            if(findNum.test(commondArray[i])) {
                repeatCount = parseInt(commondArray[i].match(findNum)[0]);
                noRepeatCommond = commondArray[i].replace(findNum, "").trim();
                for(var j = 0; j < repeatCount; j++) {
                    newArr.push(noRepeatCommond);
                }
            } else {
                newArr.push(commondArray[i]);
            }
        }
        return newArr;
    }

    init();
    
})();