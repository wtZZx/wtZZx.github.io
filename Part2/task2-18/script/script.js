(function () {
    
    var inputBox = $("#name"),
        checkButton = $("#check-button"),
        checkTip = $("#name + p"),
        input = $("#wrap form").querySelectorAll("input");
        
        for(var i = 0; i < input.length; i++) {
            (function (i) {
                input[i].addEventListener("focus", function (event) {
                    var target = event.target;
                    target.nextElementSibling.style.opacity = 1;
                }, false);
                
                
                input[i].addEventListener("blur", function (event) {
                    var target = event.target;
                    var inputName = target.getAttribute("name");
                    checkInput[inputName](target, target.value);
                }, false);
            })(i);
        }
        
    
    checkButton.addEventListener("click", function () {
        var flag = true;
        for(var i = 0; i < input.length; i++) {
            (function (i) {
                var name = input[i].getAttribute("name");
                if(!checkInput[name](input[i], input[i].value)) {
                    flag = false;
                }
            })(i);
        }
        if(flag) {
            alert("提交成功");
        } else {
            alert("输入有误")
        }
    }, false);    
    
    
    var checkInput = {
        "name": function (target, inputValue) {
            if(inputValue.length === 0) {
                this.styleRender(target, "姓名不能为空", "red");
                return false;
            } else if(getLength(inputValue) > 4 && getLength(inputValue) < 16) {
                this.styleRender(target, "格式正确", "green");
                return true;
            } else {
                this.styleRender(target, "长度为4-16个字符", "#ccc");
                return false;
            }
            
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
        },
        
        "password": function (target, password) {
            var passPath = /^([A-Za-z0-9]{8,16})$/;
            if(passPath.test(password)) {
                this.styleRender(target, "格式正确", "green");
                return true;
            } else {
                this.styleRender(target, "格式错误", "red");
                return false;
            }
        },
        
        "repassword": function (target, repass) {
            var password = $("#password").value;
            var passPath = /^([A-Za-z0-9]{8,16})$/;
            if(passPath.test(repass) && password == repass) {
                this.styleRender(target, "两次密码相同", "green");
                return true;
            } else {
                this.styleRender(target, "两次密码不同", "red");
                return false;
            }
        },
        
        "email": function (target, email) {
            var emailPatt = /(\w+\.)*\w+@(\w+\.)+[A-Za-z]+/i;
                inputTip = target.nextElementSibling;
            if(emailPatt.test(email)) {
                this.styleRender(target, "格式正确", "green");
                return true;
            } else {
                this.styleRender(target, "格式错误", "red");
                return false;
            }
        },
        
        "phone": function (target, phone) {
            var phonePatt = /^1[3|5|8][0-9]\d{8}$/,
                inputTip = target.nextElementSibling;
            if(phonePatt.test(phone)) {
                this.styleRender(target, "格式正确", "green");
                return true;
            } else {
                this.styleRender(target, "格式错误", "red");
                return false;
            }
        },
        
        styleRender: function (node, tipText, color) {
            var tip = node.nextElementSibling;
            tip.style.opacity = 1;
            tip.textContent = tipText;
            tip.style.color = color;
            node.style.borderColor = color;
        }
    }
    
    function $(element) {
        return document.querySelector(element);
    }
    
})();