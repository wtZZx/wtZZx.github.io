(function () {
    var schoolDate = {
        "北京": {
            "北京大学": "北京大学",
            "清华大学": "清华大学",
            "北京航空航天大学": "北京航空航天大学",
            "中国人民大学": "中国人民大学",
            "中央民族大学": "中央民族大学"
        },
        
        "南京": {
            "南京大学": "南京大学",
            "东南大学": "东南大学",
            "南京师范大学": "南京师范大学",
            "南京农业大学": "南京农业大学",
            "南京理工大学": "南京理工大学",
            "南京航空航天大学": "南京航空航天大学"
        },
        
        "苏州": {
            "苏州大学": "苏州大学",
            "苏州科技大学": "苏州科技大学"
        },
        
        "杭州": {
            "杭州大学": "杭州大学",
            "杭州电子科技大学": "杭州电子科技大学",
            "浙江工业大学": "浙江工业大学"
        },
        
        "成都": {
            "四川大学": "四川大学",
            "电子科技大学": "电子科技大学",
            "西南交通大学": "西南交通大学",
            "西南财经大学": "西南财经大学"
        }
    };
    
    var identity = document.querySelector("#identity"),
        citySelect = document.querySelector("#city-choise"),
        selectWrap = document.querySelector("#select-wrap"),
        schoolSelect = document.querySelector("#school-choise");
    
    
    var getSingle = function (fn) {
        var result = null;
        return function () {
            if(result === null) {
                result = fn.apply(this, arguments);
            }
            return result;
        }
    }
    
    var createWorkplace = function () {
        var label = document.createElement("label"),
            input = document.createElement("input");
        
        label.textContent = "就业单位：";
        input.setAttribute("type", "text");
        input.setAttribute("name", "workplace");
        input.classList.add("workplace");
        
        label.appendChild(input);
        return label;
    }
    
    var createSingleWorkplace = getSingle(createWorkplace);
    
    // 身份单选的事件监听
    identity.addEventListener("click", function (event) {
        var target = event.target;
        if(target.nodeName.toLowerCase() === "input") {
            if(target.value === "non-student") {
                var workplace = createSingleWorkplace();
                
                selectWrap.removeChild(selectWrap.firstElementChild);
                selectWrap.appendChild(workplace);
            } else {
                selectWrap.removeChild(selectWrap.firstElementChild);
                selectWrap.appendChild(citySelect.parentElement);
            }
        }
    }, false);

    
    // 渲染选择框
    var renderSelect = (function () {
        var firstCity = null;
        
        return {
            // 选择框数据初始化
            initRender: function () {
                for(var cityKey in schoolDate) {
                    var newCityOpt = new Option(cityKey, cityKey.toString());
                    citySelect.add(newCityOpt);
                    if(firstCity === null) {
                        firstCity = cityKey;
                    }
                }
                
                this.renderSchool(firstCity);
            },
            
            // 渲染学校数据
            renderSchool: function (city) {
                for(var schoolKey in schoolDate[city]) {
                    var newSchoolOpt = new Option(schoolKey, schoolKey.toString());
                    schoolSelect.add(newSchoolOpt);
                }
            },
            
            // 移除所有选项
            removeOptions: function (selectBox) {
                for(var i = 0, len = selectBox.options.length; i < len; i++) {
                    selectBox.remove(0);
                }
            }
        }
    })();
    
    // 选择框事件监听
    citySelect.addEventListener("change", function (event) {
        
        var selectedIndex = citySelect.selectedIndex;
        var selectedOption = citySelect.options[citySelect.selectedIndex];
        
        renderSelect.removeOptions(schoolSelect);
        renderSelect.renderSchool(selectedOption.text);
        
    }, false);
    
    function init() {
        renderSelect.initRender();
    }
    
    init();
    
})();