(function () {
    
    var shipBox = $(".ship-box");
    var panel = $(".panel");
    var consoleBox = $(".console");
    
    // 太空
    var space = {
        trank: [false, false, false, false],
        ship: []
    };
    
    // 飞船
    var ship = function (state, trank, type) {
        // 创建时默认为不飞行
        this.state = state;
        // 飞船的跑道
        this.trank = trank;
        // 默认为满能量
        this.energy = 100;
        // 飞行的定时器变量
        this.flytimer = null;
        
        this.rotate = 0;
        
        this.type = type;
        
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
                var base = (this.type.powerType.usePower / 10).toFixed(1);
                var useEnergyTimer = setInterval(function () {
                    if(ship.energy > 1 && ship.state) {
                        ship.energy -= base;
                        ship.createShip.textContent = Math.round(ship.energy) + "%";
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
                var base = this.type.energyType.solarPower;
                var timer = setInterval(function () {
                    if(ship.energy < 99) {
                        ship.energy = ship.energy + base;
                        ship.createShip.textContent = Math.round(ship.energy) + "%";
                    } else {
                        clearInterval(timer);
                    }  
                }, 2000);
            }
        }
  
    })();
    
    // 动力系统
    ship.prototype.powerSystem = (function (commond) {

        return {
            start: function () {
                var ship = this;
                var speed = this.type.powerType.speed;
                if(this.state === false && this.energy > 1) {
                    this.state = true;
                    this.flytimer = setInterval(function () {
                        if(ship.energy > 1) {
                            ship.energySystem.usePower.call(ship);
                            ship.createShip.style.transform = "rotate(" + ship.rotate + "deg)";
                            ship.rotate = ship.rotate + speed;
                        } else {
                            ship.energySystem.solarPower.call(ship);
                        }
                    }, 100);
                } else if(this.energy <= 1) {
                    ship.energySystem.solarPower.call(ship);
                }
            },
            
            stop: function () {
                if(this.state === true) {
                    clearInterval(this.flytimer);
                    this.state = false;
                }
            }
        }
        
    })();
    
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
    
    
    // 飞船的解码
    ship.prototype.adapter = (function() {

        return {
            shipID: (function() {
                return {
                    "0001" : function() {
                        return 1;
                    },

                    "0010" : function() {
                        return 2;
                    },

                    "0011" : function() {
                        return 3;
                    },

                    "0100" : function() {
                        return 4;
                    }
                }
            })(),
            
            commond: (function() {
                return {
                    "0000": function () {
                        return "create";
                    },
                    
                    "0001": function() {
                        return "start";
                    },

                    "0010": function() {
                        return "stop";
                    },

                    "0011": function() {
                        return "destruct";
                    }
                }
            })(),
            
            getCommond: function (code) {
                var shipCode = code.substring(0, 4),
                    commondCode = code.substring(4);
                return {
                    id: this.shipID[shipCode](),
                    commond: this.commond[commondCode]()
                }
            }
        }

    })();
    
    
    // 类型配置
    var settingType = {
        powerType: [{speed: 3, usePower: 5}, {speed: 5, usePower: 7}, {speed: 8, usePower: 9}],
        energyType: [{solarPower: 2}, {solarPower: 3}, {solarPower: 4}]
    }
    
    // 默认配置
    var shipType = {powerType: settingType.powerType[0], energyType: settingType.energyType[0]}
    
    var settingShip  = (function () {
           
         return {
             getPowerConfig: function (event) {
                var key = 0;
                var configRadio = $(".power-config").querySelectorAll("input[type=radio]");
                var target = event.target;
                if(target.nodeName.toLowerCase() == "input") {
                    for(var i = 0; i < configRadio.length; i++) {
                        if(target == configRadio[i]) {
                            key = i;
                            break;
                        }
                    }
                    // 获得动力配置
                    shipType.powerType = settingType.powerType[key];
                    console.log(shipType);
                    return key;
                } else {
                    console.log("false");
                    return false;
                }
            },
            
            getEnergyConfig: function () {
                var key = 0;
                var energyRadio = $(".energy-config").querySelectorAll("input[type=radio]");
                var target = event.target;
                if(target.nodeName.toLowerCase() == "input") {
                    for(var i = 0; i < energyRadio.length; i++) {
                        if(target == energyRadio[i]) {
                            key = i;
                            break;
                        }
                    }
                    // 获得能源配置
                    shipType.energyType = settingType.energyType[key];
                    console.log(shipType.energyType);
                    return key;
                } else {
                    console.log("false");
                    return false;
                }
            }
            
         }
            
    })();
    
    
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

    // BUS 
    var BUS = (function () {
        return {
            send: function (commond) {
                var randomNum = Math.floor(Math.random() * 100);
                while(randomNum < 10) {
                    consolePanel("发送的 " + commond + "指令丢包了, 正在重试...", false);
                    randomNum = Math.floor(Math.random() * 100);
                }
                consolePanel("发送的 " + commond + "指令成功了", true);
                return true;
            }
        }
    })();
    
    
    // Adapter 编码
    var Adapter = (function() {

        return {
            shipID: (function() {
                return {
                    1 : function() {
                        return "0001";
                    },

                    2 : function() {
                        return "0010";
                    },

                    3 : function() {
                        return "0011";
                    },

                    4 : function() {
                        return "0100";
                    }
                }
            })(),
            commond: (function() {
                return {
                    
                    create: function () {
                        return "0000";
                    },
                    
                    start: function() {
                        return "0001";
                    },

                    stop: function() {
                        return "0010";
                    },

                    destruct: function() {
                        return "0011";
                    }
                }
            })()
        }

    })();
    
    
    var getCode = function (commond) {
        return Adapter.shipID[commond.id]() + Adapter.commond[commond.commond]();
    }
    
    
    //  操作飞船
    var setShip = (function () {
        return {
            createShip: function (trank) {
                if(!space.trank[parseInt(trank)]) {
                    space.ship[parseInt(trank)] = new ship(false, trank, shipType);
                    console.log(space.ship[parseInt(trank)]);
                    space.trank[trank] = true;
                } else {
                    console.log("has a ship in trank" + trank);
                }  
            },
            
            destructShip: function (commondCode) {
                space.ship.forEach(function(element, index) {
                    // 广播给每个飞船进行信号配对
                    var commond = element.adapter.getCommond(commondCode);
                    if(element !== null && element.signalSystem(commond).flag === true) {
                        var trank = element.signalSystem(commond).trank;
                        space.ship[parseInt(trank)].selfDestructSystem.call(space.ship[parseInt(trank)]);
                        space.ship[parseInt(trank)] = null;
                        space.trank[trank] = false;
                    }
                }, this);
            },
            
            startShip: function (commondCode) {
                space.ship.forEach(function(element, index) {
                    // 广播给每个飞船进行信号配对
                    var commond = element.adapter.getCommond(commondCode);
                    if(element !== null && element.signalSystem(commond).flag === true) {
                        var trank = element.signalSystem(commond).trank;
                        // space.ship[parseInt(trank)].powerSystem.call(space.ship[parseInt(trank)], commond.commond);
                        space.ship[parseInt(trank)].powerSystem.start.call(space.ship[parseInt(trank)]);
                    }
                }, this);
            },
            
            stopShip: function (commondCode) {
                space.ship.forEach(function(element, index) {
                    // 广播给每个飞船进行信号配对
                    var commond = element.adapter.getCommond(commondCode);
                    if(element !== null && element.signalSystem(commond).flag === true) {
                        var trank = element.signalSystem(commond).trank;
                        // space.ship[parseInt(trank)].powerSystem.call(space.ship[parseInt(trank)], commond.commond);
                        space.ship[parseInt(trank)].powerSystem.stop.call(space.ship[parseInt(trank)]);
                    }
                }, this);
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
    

    // 事件处理函数 获取指令
    function getCommond (event) {
        var target = event.target;
        if(target.nodeName.toLowerCase() == "button") {
            var trank = target.getAttribute("value"),
                name = target.getAttribute("name"),
                commond = null;

            switch(name) {
                case "create" : {
                    commond = commander(parseInt(trank)).create;
                    var commondCode = getCode(commond);
                    if(BUS.send(commondCode)) {
                        setTimeout(setShip.createShip(commond.id), 100);
                    }
                } break;
                
                case "stop": {
                    commond = commander(parseInt(trank)).stop;
                    var commondCode = getCode(commond);
                    if(BUS.send(commondCode)) {
                        setTimeout(setShip.stopShip(commondCode), 100);
                    }
                } break;
                
                case "start": {
                    commond = commander(parseInt(trank)).start;
                    var commondCode = getCode(commond);
                    if(BUS.send(commondCode)) {
                        setTimeout(setShip.startShip(commondCode), 100);
                    }
                } break;
                
                case "destruct": {
                    commond = commander(parseInt(trank)).destruct;
                    var commondCode = getCode(commond);
                    if(BUS.send(commondCode)) {
                        setTimeout(setShip.destructShip(commondCode), 100);
                    }
                } break;
            }      
        }
    }
    
    
    $(".power-config").addEventListener("click", settingShip.getPowerConfig, false);
    $(".energy-config").addEventListener("click", settingShip.getEnergyConfig, false);
    panel.addEventListener("click", getCommond, false);
    
    
    function $(element) {
        return document.querySelector(element);
    }
    
    function $$(element) {
        return document.querySelectorAll(element);
    }

})();