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
        destination.appendChild(div);
        
        return div;
    }
    
    Square.prototype.rotate = function (commond) {
        // 处理旋转
        this.rotateBase = this.rotateStrategies[commond].call(this, this.rotateBase);
        this.squ.style.transform = "rotate(" + this.rotateBase +"deg)";
    }
    
    // 旋转的策略同时更新方向
    Square.prototype.rotateStrategies = {
        "TUN LEF": function (base) {
            this.direction.push(this.direction.shift());
            this.Sign = this.direction[0];
            return base - 90;
        },
            
        "TUN RIG": function (base) {
            this.direction.unshift(this.direction.pop());
            this.Sign = this.direction[0];
            return base + 90;
        },
        
        "TUN BAC": function (base) {
            for(var i = 0; i < 2; i++) {
                this.direction.unshift(this.direction.pop());
            }
            this.Sign = this.direction[0];
            return base + 180;
        }
    }
    
    Square.prototype.move = function () {
        this.moveStrategies[this.Sign].call(this);
    }
    
    Square.prototype.moveRender = function () {
        this.squ.parentElement.removeChild(this.squ);
        this.squ = this.initRender();
    }
    
    Square.prototype.moveStrategies = {
        "top": function () {
            if(this.isOverstep(this.pointX - 1, this.pointY)) {
                this.pointX -= 1;
            } else {
                console.log("越界");
            }
        },
        
        "left": function () {
            if(this.isOverstep(this.pointX, this.pointY - 1)) {
                this.pointY -= 1;
            } else {
                console.log("越界");
            }
        },
        
        "bottom": function () {
            if(this.isOverstep(this.pointX + 1, this.pointY)) {
                this.pointX += 1;
            } else {
                console.log("越界");
            } 
        },
        
        "right": function () {
            if(this.isOverstep(this.pointX, this.pointY + 1)) {
                this.pointY += 1;
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
            if(commond === "GO") {
                squ.move();
                squ.moveRender();
            } else {
                squ.rotate(commond);
            }
        }, false);
    }

    init();
    
})();