window.onload = function () {
    
    var aqiTable = document.querySelector("#aqi-table");
    
    /**
     *  aqiData,存储用户输入的空气指数数据
     *  示例格式：
     *  aqiData = {
     *     "北京": 90,
     *     "上海": 40
     *  };
     */

    var aqiData = {};
    
    /**
     * 从用户输入中获取数据，向aqiData中增加一条数据
     * 然后渲染aqi-list列表，增加新增的数据
     */

    function addAqiData(aqiCityInput, aqiValueInput) {
        aqiData[aqiCityInput] = aqiValueInput;
        console.log(aqiData);
        renderAqiList();
    }
    
    
    /**
     * 渲染aqi-table表格
     */
    
    function removeNode(parentNode) {
        while(parentNode.firstChild) {
            parentNode.removeChild(parentNode.firstChild);
        }
    }
    
    function renderAqiList() {
        
        removeNode(aqiTable);
        var docfrag = document.createDocumentFragment();
        var th = document.createElement("tr");
        th.innerHTML = "<td>" + "城市" + "</td>" + "<td>" + "空气质量" + "</td>" + "<td>" + "操作" + "</td>";
        docfrag.appendChild(th);
        
        for(var key in aqiData) {
            var tr = document.createElement("tr");
            tr.innerHTML = "<td>" + key + "</td>" + "<td>" + aqiData[key] + "</td>" + "<td>" + "<button name=" + key + ">" + "删除" + "</button>" + "</td>";
            docfrag.appendChild(tr);
        }
        
        aqiTable.appendChild(docfrag);
        
    }

    /**
     *  点击add-btn时的处理逻辑
     *  获取用户输入，更新数据，并进行页面呈现更新
     */

    function addBtnHandle() {
        var aqiCityInput = document.querySelector("#aqi-city-input").value.trim(),
            aqiValueInput = document.querySelector("#aqi-value-input").value.trim();
        
        var regCity = /[\u4e00-\u9fa5]|[a-zA-z]/g;
        var regValue = /\d{1,}/g
        
        if(regCity.test(aqiCityInput) && regValue.test(aqiValueInput)) {
            console.log(aqiCityInput, aqiValueInput);
            addAqiData(aqiCityInput, aqiValueInput);
        } else {
            alert("input error");
        }
    }

    /**
     * 点击各个删除按键的时候的处理逻辑
     * 获取哪个城市数据被删除，删除数据，更新表格显示
     */

    function delBtnHandle(event) {
        // do sth.
        var target = event.target;
        console.log(target.parentNode.parentNode);
        if(target.nodeName.toLowerCase() == "button") {
            delete aqiData[target.getAttribute("name").trim()];
            renderAqiList();
        } else {
            console.log("false");
        }
    }

    function init() {
        // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
        var addBtn = document.querySelector("#add-btn");
        addBtn.addEventListener("click", addBtnHandle, false);
        
        // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
        
        aqiTable.addEventListener("click", delBtnHandle, false);

    }
    
    init();
     
}