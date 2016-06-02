(function () {
    
    
    var Calendar = (function () {
        
        return {
            init: function (startTime, finishTime) {
                this.startTime = startTime;
                this.finishTime = finishTime;
                this.selectDateFrom = new Date(1970, 1, 1);  // 日历的最小可选时间
                this.selectDateTo = new Date(2020, 1, 1);    // 日历的最大可选时间
                this.toDay = new Date();
                this.initRender();
            },
            
            initRender: function () {
                // 日历的 wrap 须是 id 为 calendar-wrap 的元素
                this.wrap = document.querySelector("#calendar-wrap");
                var dateSelectPanel = document.createElement("div"),
                    yearSelect = document.createElement("select"),
                    monthSelect = document.createElement("select"),
                    dayTable = document.createElement("table"),
                    weekRow = document.createElement("tr");
                
                // 日历中的节点对象
                this.node = {
                    dayTable: dayTable,
                    yearSelect: yearSelect,
                    monthSelect: monthSelect,
                    weekRow: weekRow
                }
                
                dateSelectPanel.classList.add("date-select-panel");
                yearSelect.classList.add("select-style");
                monthSelect.classList.add("select-style");
                dayTable.classList.add("day-table");
                weekRow.classList.add("week-row");
                
                weekRow.innerHTML = "<td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td>";
                
                // 初始化年份选择框
                for(var i = 0, len = this.selectDateTo.getFullYear() - this.selectDateFrom.getFullYear(); i <= len; i++) {
                    var yearOption = new Option(this.selectDateFrom.getFullYear() + i, this.selectDateFrom.getFullYear() + i);
                    yearSelect.add(yearOption);
                    if(this.toDay.getFullYear() == yearOption.value) {
                        yearSelect.selectedIndex = i;
                    }
                }
                
                // 初始化月份选择框
                for(i = 1; i <= 12; i++) {
                    var monthOption = new Option(i, i);
                    monthSelect.add(monthOption);
                    if((this.toDay.getMonth() + 1) == monthOption.value) {
                        monthSelect.selectedIndex = i - 1;
                    }
                }
                
                // 调用日历表格渲染
                this.renderDayTable();

                dateSelectPanel.appendChild(yearSelect);
                dateSelectPanel.appendChild(monthSelect);
                this.wrap.appendChild(dateSelectPanel);
                this.wrap.appendChild(dayTable);
                this.addEvent();
            },
            
            renderDayTable: function () {
                // 置空表格
                removeNode(this.node.dayTable);
                this.node.dayTable.appendChild(this.node.weekRow);
                
                var yearSelect = this.node.yearSelect.options[this.node.yearSelect.selectedIndex].value,
                    monthSelect = this.node.monthSelect.options[this.node.monthSelect.selectedIndex].value;
                
                // 选择框中的日期
                var selectedDate = new Date(yearSelect, monthSelect-1, 1);
                // 月份指示 防止在当月日历输出下月时间
                var monthTip = selectedDate.getMonth();

                for(var i = 0; i < 6; i++) {
                    var dayRow = document.createElement("tr");
                    for(var j = 0; j < 7; j++) {
                        var dayTD = document.createElement("td");
                        if(selectedDate.getDay() == j && selectedDate.getMonth() == monthTip) {
                            dayTD.textContent = selectedDate.getDate();
                            if(selectedDate.getDate() == this.toDay.getDate()) {
                                dayTD.classList.add("toDay-select-style");
                                dayTD.style.color = "#fff";
                                this.node.lastSelect = dayTD;
                            } else if(selectedDate < this.toDay) {
                                dayTD.classList.add("past-date");
                                dayTD.style.color = "#ccc";
                            }
                            dayTD.addEventListener("mouseover", this.dayMouseOver.bind(this), false);
                            dayTD.addEventListener("click", this.selectDate.bind(this), false);
                            selectedDate.setDate(selectedDate.getDate() + 1);
                        }
                        dayRow.appendChild(dayTD);
                    }
                    this.node.dayTable.appendChild(dayRow);
                }
                
                function removeNode(parentNode) {
                    while(parentNode.firstChild) {
                        parentNode.removeChild(parentNode.firstChild);
                    }
                }
            },
            
            processEvent: function () {
                this.renderDayTable();
            },
            
            // 选择日期的事件处理
            selectDate: function () {
                var yearSelect = this.node.yearSelect.options[this.node.yearSelect.selectedIndex].value,
                    monthSelect = this.node.monthSelect.options[this.node.monthSelect.selectedIndex].value,
                    daySelect = event.target.textContent;
                    
                var selectDay = new Date(yearSelect, monthSelect-1, daySelect);
                // 最近一次选中的元素
                this.node.lastSelect.classList.remove("select-day");
                if(!event.target.classList.contains("past-date")) {
                    event.target.classList.add("select-day");
                    this.node.lastSelect = event.target;
                    this.renderSelectInput(selectDay);
                }
                
                this.getSelectDate(selectDay);
            },
            
            // 取得选中的日期
            getSelectDate: function (selectDay) {
                return selectDay;  
            },
            
            renderSelectInput: function (selectDay) {
                // 日期选择框须是 id 为 date-select 的元素
                var selectInput = document.querySelector("#date-select");
                selectInput.value = selectDay.toLocaleDateString();
            },
            
            dayMouseOver: function () {
                var target = event.target;
                target.classList.add("dayTD-mouseover");
                target.addEventListener("mouseout", function () {
                    var target = event.target;
                    target.classList.remove("dayTD-mouseover");
                })
            },
            
            addEvent: function () {
                this.node.yearSelect.addEventListener("change", this.processEvent.bind(this), false);
                this.node.monthSelect.addEventListener("change", this.processEvent.bind(this), false);
            }
        }

    })();
    
    
    Calendar.init();
    
})();