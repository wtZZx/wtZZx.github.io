(function () {
    
    // 配置1 
    var setting = {
        label: "名字",
        type: "text",
        validator: function (inputValue) {
            var patt = /^[\u4e00-\u9fa5]{2,4}$/;
            if(inputValue !== "" && patt.test(inputValue)) {
                return true;
            } else {
                return false;
            }
        },
        rules: "必填，需为2-4个中文字符",
        success: "格式正确",
        fail: "格式错误"
    };
    
    // 配置2 
    var setting2 = {
        label: "密码",
        type: "password",
        validator: function (inputValue) {
            var patt = /^\w{4,16}$/;
            if(inputValue !== "" && patt.test(inputValue)) {
                return true;
            } else {
                return false;
            }
        },
        rules: "必填，长度为4-16个字符",
        success: "格式正确",
        fail: "格式错误"
    };
    

    var formFactory = (function () {

        return {
            getElement: {
                label: function (text) {
                    var label = document.createElement("label");
                    label.textContent = text;
                    return label;
                },
                    
                type: function (typeText) {
                    var input = document.createElement("input");
                    input.setAttribute("type", typeText);
                    return input;
                },
                    
                validator: function (fn) {
                    return fn;
                },
                    
                rules: function (text) {
                    return this.formTip(text);
                },
                
                formTip: function (text) {
                    var span = document.createElement("span");
                    span.textContent = text;
                    return span;
                }
            },
            
            getForm: function (setting) {
                var form = document.createElement("form"),
                    label = this.getElement.label(setting.label),
                    input = this.getElement.type(setting.type),
                    inputTip = this.getElement.rules(setting.rules);
                    
                 label.appendChild(input);
                 form.appendChild(label);
                 form.appendChild(inputTip);
                 
                 return {
                     form: form,
                     input: input,
                     inputTip: inputTip
                 };
            },
            
            bindEvent: function (node, tip, eventName, setting) {
                node.addEventListener(eventName, this.check.bind(tip, setting), false);
            },
            
            check: function (setting) {
                var target = event.target;
                if(setting.validator(target.value)) {
                    this.textContent = setting.success;
                    this.classList.remove("fail");
                    this.classList.add("success");
                } else {
                    this.textContent = setting.fail;
                    this.classList.remove("success");
                    this.classList.add("fail");
                }
            }
        }
    })();
    
    
    var wrap = document.querySelector("#wrap");
    var form = formFactory.getForm(setting);
    var form2 = formFactory.getForm(setting2);
    
    wrap.appendChild(form.form);
    wrap.appendChild(form2.form);
    
    formFactory.bindEvent(form.input, form.inputTip, "blur", setting);
    formFactory.bindEvent(form2.input, form2.inputTip, "blur", setting2);
    
})();