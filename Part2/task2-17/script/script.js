(function () {
    
    var inputBox = $("#name"),
        checkButton = $("#check-button"),
        checkTip = $("#name + p");
        
    checkButton.addEventListener("click", function (event) {
        var inputValue = inputBox.value.trim();
        if(inputValue.length === 0) {
            checkTip.textContent = "姓名不能为空";
            checkTip.style.color = "red";
            inputBox.style.borderColor = "red";
        } else if(getLength(inputValue) > 4 && getLength(inputValue) < 16) {
            checkTip.textContent = "格式正确";
            checkTip.style.color = "green";
            inputBox.style.borderColor = "green";
        } else {
            checkTip.textContent = "长度为4-16个字符";
            checkTip.style.color = "#ccc";
            inputBox.style.borderColor = "#ccc";
        }
    }, false);
    
    function getLength(inputValue) {
        var length = 0;
        for(var i = 0; i < inputValue.length; i++) {
            if(inputValue.charCodeAt(i) > 0 && inputValue.charCodeAt(i) < 128) {
                length++;
            } else {
                length += 2;
            }
        }
        return length;
    }
    
    
    
    function $(element) {
        return document.querySelector(element);
    }
    
})();