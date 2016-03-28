window.onload = function () {
    /* 数据格式演示
    var aqiSourceData = {
        "北京": {
            "2016-01-01": 10,
            "2016-01-02": 10,
            "2016-01-03": 10,
            "2016-01-04": 10
        }
    };
    */
    
    var citySelect = document.querySelector("#city-select"),
        graTime = document.querySelector("#form-gra-time"),
        aqiWrap = document.querySelector(".aqi-chart-wrap");
    
    // 以下两个函数用于随机模拟生成测试数据
    
    function getDataStr(dat) {
        var y = dat.getFullYear();
        var m = dat.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = dat.getDate();
        d = d < 10 ? "0" + d : d;
        return y + "-" + m + "-" + d;
    }
    
    
    function randomBuildData(seed) {
        var returnData = {};
        var dat = new Date("2016-01-01");
        var datStr = "";
        for(var i = 1; i < 92; i++) {
            datStr = getDataStr(dat);
            returnData[datStr] = Math.ceil(Math.random() * seed);
            dat.setDate(dat.getDate() + 1);
        }
        return returnData;
    }
    
    var aqiSourceData = {
        "北京": randomBuildData(500),
        "上海": randomBuildData(300),
        "广州": randomBuildData(200),
        "深圳": randomBuildData(100),
        "成都": randomBuildData(300),
        "西安": randomBuildData(500),
        "福州": randomBuildData(100),
        "厦门": randomBuildData(100),
        "沈阳": randomBuildData(500)
    };
    
    console.log(aqiSourceData);
    
    // 用于渲染图表的数据
    var charData = {
        
    };
    

    
    // 记录当前页面的表单选项
    
    var pageState = {
        nowSelectCity: "北京",
        nowGraTime: "day"
    }
    
    /**
     * 渲染图表
     */
    
    function randomRGB() {
        return Math.floor(Math.random() * 255);
    }
    
    
    function removeNode(parentNode) {
        while(parentNode.firstChild) {
            parentNode.removeChild(parentNode.firstChild);
        }
    }
    
    function renderChart() {
        var docfrag = document.createDocumentFragment();
        removeNode(aqiWrap);
        
        for(var aqi in charData[pageState.nowSelectCity][pageState.nowGraTime]) {
            var divLine = document.createElement("div");
            divLine.style.height = charData[pageState.nowSelectCity][pageState.nowGraTime][aqi] + "px";
            setStyle(pageState.nowGraTime, divLine);
            docfrag.appendChild(divLine);
        }
        aqiWrap.appendChild(docfrag);
        
        aqiWrap.addEventListener("mouseover", aqiTip, false);
    }
    
    function setStyle(nowGraTime, divLine) {
        var rgbColor = "rgb(" + randomRGB() + "," + randomRGB() + "," + randomRGB() + ")";
        divLine.style.backgroundColor = rgbColor;
        if(nowGraTime == "day") {
            divLine.classList.add("day-style");
        } else if(nowGraTime == "week") {
            divLine.classList.add("week-style");
        } else {
            divLine.classList.add("month-style");
        }
    }
    
    function aqiTip(event) {
        var target = event.target,
            aqiNum = target.style.height.replace(/px/, "");
        target.setAttribute("title", aqiNum);
    }
    
    /**
     * 日，周，月的radio事件点击时的处理函数
     */
    
    function graTimeChange(event) {
        // 确定是否选项发生了变化
        // 设置对应数据
        // 调用图表渲染函数
        
        var target = event.target;
        if(target.nodeName.toLowerCase() == "input") {
            if(pageState.nowGraTime !== target.value.trim()) {
                pageState.nowGraTime = target.value.trim();
                renderChart();
            }
        }
        
    }
    
    
    /**
     * select 发生变化时的处理函数
     */
    
    function citySelectChange(event) {
        
        // 确定是否选项发生了变化
        // 设置对应数据
        // 调用图表渲染函数
        
        var target = event.target;
        console.log(target.value.trim());
        if(pageState.nowSelectCity != target.value.trim()) {
             pageState.nowSelectCity = target.value.trim();
             renderChart();
        }
    }
   
    
    /**
     * 初始化日，周，月的 radio 事件 当点击时 调用函数 graTimeChange
     */
    
    function initGraTimeForm() {
        graTime.addEventListener("click", graTimeChange, false); 
    }
    
    
    /**
     *  初始化城市 Select 下拉选择框中的选项
     */
    
    function initCitySelector() {
        // 读取 aqiSourceData中的城市 ，然后设置 id 为 city-select 的下拉列表中的选项
        
        var docfrag = document.createDocumentFragment();
        
        for(var key in aqiSourceData) {
            var newOption = document.createElement("option");
            newOption.textContent = key;
            docfrag.appendChild(newOption);
        }
        
        citySelect.appendChild(docfrag);

        // 给select设置事件，当选项发生变化时调用函数citySelectChange
        citySelect.addEventListener("change", citySelectChange, false);
    }
    
    /**
     * 初始化图表需要的数据格式
     */
    
    function initAqiChartData() {
        // 将原始的源数据处理城图表需要的数据格式
        // 处理好的数据存到 charData 中
        
        for(var key in aqiSourceData) {
            charData[key] = {"day": {}, "week": {}, "month": {"1": 0, "2": 0, "3": 0}};
            
            // 将 天 放进 charData
            charData[key].day = aqiSourceData[key];
            var week = 1,
                weekSum = 0,
                weekCount = 0,
                monthFlag = 0;
                
            var dat = new Date("2016-01-01");
             
            // 处理月
                
            for(var i = 1 ; i <= 3 ; i++) {
                var monthReg = new RegExp("2016-0" + i + "-\\d{2}"),
                    monthSum = 0,
                    count = 0;
                
                for(var dayKey in charData[key].day) {
                    
                    if(monthReg.test(dayKey)) {
                        monthSum += charData[key].day[dayKey];
                        count++;    
                    }

                }
                charData[key].month[i] = Math.ceil(monthSum/count);
            }
                
            // 处理周
            
            for(var dayKey in charData[key].day) {
                
                var tomorrow = new Date();
                tomorrow.setDate(dat.getDate() + 1);
                
                if(dat.getDay() !== 1 && tomorrow.getDate() != 1) {
                    weekCount++;
                    weekSum += charData[key].day[dayKey];
                } else {
                    charData[key].week[week++] = Math.ceil(weekSum/weekCount);
                    weekCount = 0;
                    weekSum = 0;
                    weekCount++;
                    weekSum += charData[key].day[dayKey];
                }
                dat.setDate(dat.getDate() + 1);
            } 
        }
    }
    
    /**
     * 初始化函数
     */
    
    function init() {
        initGraTimeForm();
        initCitySelector();
        initAqiChartData();
        renderChart();
    }
    
    init();
    console.log(charData);
}

