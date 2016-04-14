(function () {
    
    var shipBox = document.querySelector(".ship-box");
    var panel = document.querySelector(".panel");
    var consoleBox = document.querySelector(".console");
    
    // 太空
    var space = {
        trank: [false, false, false, false],
        ship: []
    };
    
    // 飞船
    var ship = function (state, trank) {
        // 创建时默认为不飞行
        this.state = state;
        // 飞船的跑道
        this.trank = trank;
        // 默认为满能量
        this.energy = 100;
        // 飞行的定时器变量
        this.flytimer = null;
        
        this.rotate = 0;
        
        this.createShip = (function (energy, trank) {
            var docfrag = document.createDocumentFragment(),
                shipElement = document.createElement("div"),
                trankClass = "trank-" + trank,
                energyText = document.createTextNode(energy + "%");
                
            shipElement.appendChild(energyText);
            shipElement.classList.add("ship");
            shipElement.classList.add(trankClass);
            
            docfrag.appendChild(shipElement);    
            shipBox.appendChild(docfrag);
            
            return shipElement;
        })(this.energy, this.trank);
    }
    
    // 能源系统
    ship.prototype.energySystem = (function () {
        
        return {
            // 耗能
            usePower: function () {
                var ship = this;
                var base = 0.5;
                var useEnergyTimer = setInterval(function () {
                    if(ship.energy > 1 && ship.state) {
                        ship.energy -= base;
                        ship.createShip.textContent = ship.energy + "%";
                    } else {
                        clearInterval(useEnergyTimer);
                        clearInterval(ship.flytimer);
                        ship.state = false;
                    }
                }, 1000);
            },
            
            // 充能
            solarPower: function () {
                console.log(this);
                var ship = this;
                var base = 2;
                var timer = setInterval(function () {
                    if(ship.energy < 99) {
                        ship.energy = ship.energy + base;
                        ship.createShip.textContent = ship.energy + "%";
                    } else {
                        clearInterval(timer);
                    }  
                }, 2000);
            }
        }
  
    })();
    
    // 动力系统
    ship.prototype.powerSystem = function (commond) {

        var ship = this;
        var base = 5;
        // 判断是否在飞
        if(this.state === false && commond === "start") {
            this.state = true;
            this.flytimer = setInterval(function () {
                if(ship.energy > 1) {
                    // 减电
                    ship.energySystem.usePower.call(ship);
                    ship.createShip.style.transform = "rotate(" + ship.rotate + "deg)";
                    ship.rotate = ship.rotate + base; 
                } else {
                    ship.energySystem.solarPower.call(ship);
                }
            }, 100);
            
        } else if(this.state === true && commond === "stop") {
            clearInterval(this.flytimer);
            this.state = false;
        }
        
    };
    
    // 信号系统
    ship.prototype.signalSystem = function (commond) {
        var flag = false;
        if(commond.id === this.trank) {
            flag = true;
        }
        return {
            flag: flag,
            trank: this.trank
        };
    };
    
    // 自我毁灭系统
    ship.prototype.selfDestructSystem = function () {
        shipBox.removeChild(this.createShip);
    };
    
    
    // 指挥官
    var commander = function (id) {
        return {
            create: {
                id: id,
                commond: "create"
            },
            
            stop: {
                id: id,
                commond: "stop"
            },
            
            start: {
                id: id,
                commond: "start"
            },
            
            destruct: {
                id: id,
                commond: "destruct"
            }
        }
    }
    
    
    // 介质
    var mediator = (function () {
        return {
            send: function (commond) {
                var randomNum =  Math.floor(Math.random() * 100);
                if(randomNum < 30) {
                    consolePanel("发送给 " + commond.id + " 号飞船的指令 "  + commond.commond + " 丢包了", false);
                    return false;
                } else {
                    consolePanel("发送给 " + commond.id + " 号飞船的指令 "  + commond.commond + " 成功了！", true);
                    return true;
                }
            }
        }
    })();
    
    
    // 控制台显示信息
    var consolePanel = function (message, flag) {
        var messageNode = document.createTextNode(message),
            pNode = document.createElement("p");
        
        if(!flag) {
            pNode.style.color = "red";
        } else {
            pNode.style.color = "green";
        } 
        pNode.appendChild(messageNode);
        consoleBox.appendChild(pNode);
    }
    
    //  操作飞船
    var setShip = (function () {
        return {
            createShip: function (trank) {
                if(!space.trank[parseInt(trank)]) {
                    space.ship[parseInt(trank)] = new ship(false, trank);
                    console.log(space.ship[parseInt(trank)]);
                    space.trank[trank] = true;
                } else {
                    console.log("has a ship in trank" + trank);
                }  
            },
            
            destructShip: function (commond) {
                space.ship.forEach(function(element, index) {
                    // 广播给每个飞船进行信号配对
                    if(element !== null && element.signalSystem(commond).flag === true) {
                        var trank = element.signalSystem(commond).trank;
                        space.ship[parseInt(trank)].selfDestructSystem.call(space.ship[parseInt(trank)]);
                        space.ship[parseInt(trank)] = null;
                        space.trank[trank] = false;
                    }
                }, this);
            },
            
            startShip: function (commond) {
                space.ship.forEach(function(element, index) {
                    // 广播给每个飞船进行信号配对
                    if(element !== null && element.signalSystem(commond).flag === true) {
                        var trank = element.signalSystem(commond).trank;
                        space.ship[parseInt(trank)].powerSystem.call(space.ship[parseInt(trank)], commond.commond);
                    }
                }, this);
            },
            
            stopShip: function (commond) {
                space.ship.forEach(function(element, index) {
                    // 广播给每个飞船进行信号配对
                    if(element !== null && element.signalSystem(commond).flag === true) {
                        var trank = element.signalSystem(commond).trank;
                        space.ship[parseInt(trank)].powerSystem.call(space.ship[parseInt(trank)], commond.commond);
                    }
                }, this);
            }
        }
    })();
    
    
    function getCommond (event) {
        var target = event.target;
        if(target.nodeName.toLowerCase() == "button") {
            var trank = target.getAttribute("value"),
                name = target.getAttribute("name"),
                commond = null;
            
            switch(name) {
                case "create" : {
                    commond = commander(parseInt(trank)).create;
                    if(mediator.send(commond)) {
                        setTimeout(setShip.createShip(commond.id), 100);
                    }
                } break;
                
                case "stop": {
                    commond = commander(parseInt(trank)).stop;
                    if(mediator.send(commond)) {
                        setTimeout(setShip.stopShip(commond), 100);
                    }
                } break;
                
                case "start": {
                    commond = commander(parseInt(trank)).start;
                    if(mediator.send(commond)) {
                        setTimeout(setShip.startShip(commond), 100);
                    }
                } break;
                
                case "destruct": {
                    commond = commander(parseInt(trank)).destruct;
                    if(mediator.send(commond)) {
                        setTimeout(setShip.destructShip(commond), 100);
                    }
                } break;
            }      
        }
    }
    
    panel.addEventListener("click", getCommond, false);

})();