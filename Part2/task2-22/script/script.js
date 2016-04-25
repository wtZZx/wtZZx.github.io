(function () {
    
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
        var div = document.createElement("div");
        var td = document.querySelectorAll("tr")[this.pointX].querySelectorAll("td");
        var destination = td[this.pointY];
        div.classList.add("square-style");
        div.style.transform = "rotate(" + this.rotateBase +"deg)";
        div.style.top = "0px";
        div.style.left = "0px";
        destination.appendChild(div);
        
        return div;
    }
    
    // 旋转
    Square.prototype.rotate = (function () {
        
        return {
            baseRotate: function (base, flag) {
                
                var preDeg = 5;
                var timer = setInterval(rotateAnimation.bind(this), 20);
                
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
            
            moveRotate: function (sign, trun) {
                var base = this.rotateBase;
                while(this.Sign !== sign) {
                    base += this.processCommond["TUN"].call(this);
                }
                            
                this.rotate.baseRotate.call(this, base);
                this.processCommond[trun].call(this);
            }
        }
        
    })();
    
    // 对指令的处理
    Square.prototype.processCommond = {
        
        "GO": function () {
            this.moveStrategies[this.Sign].call(this);
        },
        
        "TUN": function () {
            this.direction.push(this.direction.shift());
            this.Sign = this.direction[0];
            return  - 90;
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
            this.rotate.moveRotate.call(this, "left", "TRA LEF");
        },
        
        "MOV TOP": function (that) {
            this.rotate.moveRotate.call(this, "top", "TRA TOP");
        },
        
        "MOV RIG": function (that) {
            this.rotate.moveRotate.call(this, "right", "TRA RIG");
        },
        
        "MOV BOT": function (that) {
            this.rotate.moveRotate.call(this, "bottom", "TRA BOT");
        }
    }
    
    Square.prototype.moveRender = function (size, sign) {
        
        var base = 5;
        var timer = setInterval(moveAnimation.bind(this), 30);
        var bakSqu = this.squ;
        
        // 动画 让旧方块移动后移除在渲染新坐标新方块
        function moveAnimation() {
            if(size < 0) {
                base = -5;
            }

            var positionNum = parseInt((bakSqu.style[sign]).replace(/px/, ""));
            if(positionNum !== size) {
                bakSqu.style[sign] = (positionNum + base) + "px";
            } else {
                clearInterval(timer);
            }
        } 
        
        setTimeout(renderNewSqu.bind(this), 600);
        
        function renderNewSqu() {
            this.squ.parentElement.removeChild(this.squ);
        
            // 在新坐标绘制
            this.squ = this.initRender();
        }
        
    }
    
    Square.prototype.moveStrategies = {
        "top": function () {
            if(this.isOverstep(this.pointX - 1, this.pointY)) {
                this.pointX -= 1;
                this.moveRender(-50, "top");
            } else {
                console.log("越界");
            }
        },
        
        "left": function () {
            if(this.isOverstep(this.pointX, this.pointY - 1)) {
                this.pointY -= 1;
                this.moveRender(-50, "left");
            } else {
                console.log("越界");
            }
        },
        
        "bottom": function () {
            if(this.isOverstep(this.pointX + 1, this.pointY)) {
                this.pointX += 1;
                this.moveRender(50, "top");
            } else {
                console.log("越界");
            } 
        },
        
        "right": function () {
            if(this.isOverstep(this.pointX, this.pointY + 1)) {
                this.pointY += 1;
                this.moveRender(50, "left");
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
        
        var runButton = document.querySelector("#run");
        
        var squ = new Square(pointX, pointY);
        
        runButton.addEventListener("click", function () {
            var commond = document.querySelector("#command-input").value.trim();
            commond = commond.toUpperCase();
            squ.processCommond[commond].call(squ);
        }, false);
    }

    init();
    
})();