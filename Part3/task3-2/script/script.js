(function () {
    
    var sortTable = (function () {
        
        return {
            // 初始化
            init: function (thead, tdata) {
                this.thead = thead;
                this.tdata = tdata;
                this.flag = true;
                this.wrap = document.querySelector(".table-wrap");
                this.renderTable();
            },
            
            // 首次渲染表格
            renderTable: function () {
                var rowNum = this.tdata.length + 1,
                    colNum = this.thead.length;
                
                var table = document.createElement("table");
                
                for(var i = 0, k = -1; i < rowNum; i++) {
                    var tr = document.createElement("tr");
                    for(var j = 0; j < colNum; j++) {
                        if(i === 0) {
                            var th = document.createElement("th");
                            th.textContent = this.thead[j];
                            if(j !== 0) {
                                var faSort = document.createElement("i");
                                faSort.classList.add("fa");
                                faSort.classList.add("fa-sort");
                                faSort.setAttribute("aria-hidden", true);
                                faSort.setAttribute("colNum", j);
                                // 给 sort icon 绑定事件
                                faSort.addEventListener("click", this.sort.bind(this), false);
                                th.appendChild(faSort);
                            }
                            tr.appendChild(th);
                        } else {
                            var td = document.createElement("td");
                            if(this.tdata[k]) {
                                td.textContent = this.tdata[k][j];
                                tr.appendChild(td);
                            }
                        }
                    }
                    k++;
                    table.appendChild(tr);
                }
                this.wrap.appendChild(table);
                this.table = table;
            },
            
            // 排序
            sort: function () {
                var target = event.target,
                    colNum = target.getAttribute("colNum");
                if(this.flag) {
                    this.tdata.sort(function (row1, row2) {
                        return row1[colNum] - row2[colNum];
                    });
                } else {
                    this.tdata.sort(function (row1, row2) {
                        return row2[colNum] - row1[colNum];
                    });
                }
                
                this.flag = !this.flag;
                this.reRender();
            },
            
            // 重绘
            reRender: function () {
                this.wrap.removeChild(this.table);
                this.renderTable(this.wrap);
            }
        }
        
    })();
    
    function init() {
        var thead = ["姓名", "语文", "数学", "英语", "总分"],
            tdata = [
                ["小明", 80, 90, 70, 240],
                ["小红", 90, 60, 90, 240],
                ["小亮", 60, 100, 70, 230],
                ["小黑", 50, 50, 50, 150],
                ["小张", 80, 100, 90, 270],
            ];
        sortTable.init(thead, tdata);
    }
    
    init();
    
})();