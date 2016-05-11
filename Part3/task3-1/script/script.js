(function () {
    
    function popup(setting) {
        return new Popup(setting);
    }
    
    function Popup(setting) {
        this.setting = Object.create(this.defaultSetting);
        for(var key in setting) {
            this.setting[key] = setting[key];
        }
        this.init();
    }
    
    Popup.prototype.defaultSetting = {
        width: 500,
        height: 300,
        title: "这是一个标题",
        content: "这是弹出浮层",
        drag: true,
        okText: "确认",
        okCallback: function () {
            alert("点了确定");
            document.body.removeChild(this.node.mask);
        },
        cancelText: "取消",
        cancelCallback: function () {
            console.log("点了取消");
        }
    }
    
    Popup.prototype.init = function () {
        this.node = this.render();
        this.addEvent();
    }
    
    Popup.prototype.render = function () {
        
        var body = document.body;
        var mask = document.createElement("div"),
            popup = document.createElement("div"),
            title = document.createElement("p"),
            content = document.createElement("div"),
            buttonWrap = document.createElement("div"),
            okButton = document.createElement("button"),
            cancelButton = document.createElement("button");
        
        
        popup.style.width = this.setting.width + "px";
        popup.style.height = this.setting.height + "px";
        popup.style.marginLeft = -(this.setting.width / 2) + "px";
        popup.style.marginTop = -(this.setting.height / 2) + "px";
        
        title.style.width = popup.style.width;
        title.style.height = (this.setting.height / 5) + "px";
        title.style.lineHeight = title.style.height;
        
        okButton.value = "ok";
        cancelButton.value = "cancel";
        okButton.textContent = this.setting.okText;
        cancelButton.textContent = this.setting.cancelText;
        
        title.textContent = this.setting.title;
        content.textContent = this.setting.content;
        
        mask.classList.add("mask");
        popup.classList.add("popup");
        title.classList.add("popup-title");
        okButton.classList.add("button-style");
        okButton.classList.add("ok-button");
        cancelButton.classList.add("button-style");
        cancelButton.classList.add("cancel-button");
        buttonWrap.classList.add("button-wrap");
        content.classList.add("popup-content");
        
        
        popup.appendChild(title);
        popup.appendChild(content);
        buttonWrap.appendChild(okButton);
        buttonWrap.appendChild(cancelButton);
        popup.appendChild(buttonWrap);
        mask.appendChild(popup);
        
        
        body.appendChild(mask);
        return {
            mask: mask,
            popup: popup,
            title: title,
            content: content,
            okButton: okButton,
            cancelButton: cancelButton
        };
    };
    
    Popup.prototype.addEvent = function () {
        this.node.okButton.addEventListener("click", this.setting.okCallback.bind(this), false);
        this.node.cancelButton.addEventListener("click", this.setting.cancelCallback, false);
        if(this.setting.drag === true) {
            this.node.title.addEventListener("mousedown", this.drag.bind(this), false);
        }
    };
    
    Popup.prototype.drag = function (event){
        var moveX = event.clientX - this.node.popup.offsetLeft,
            moveY = event.clientY - this.node.popup.offsetTop;
        this.node.title.onmousemove = this.drag.move.bind(this, moveX, moveY);
    };
    
    Popup.prototype.drag.move = function (moveX, moveY) {
        this.node.popup.style.left = (event.clientX - moveX) + "px";
        this.node.popup.style.top = (event.clientY - moveY) + "px";
        this.node.popup.style.marginLeft = 0 + "px";
        this.node.popup.style.marginTop = 0 + "px";
        this.node.title.addEventListener("mouseup", this.drag.mouseUp.bind(this), false);
    };
    
    Popup.prototype.drag.mouseUp = function () {
        this.node.title.onmousemove = null;
        this.node.title.removeEventListener("mouseup", this.drag.mouseUp.bind(this), false);
    };
    
    
    var test = popup({
        width: 600,
        height: 300,
        title: "自定义标题",
        content: "这是弹出浮层",
        drag: true
    });
    
    
    function $(element) {
        return document.querySelector(element);
    }
    
    
})();