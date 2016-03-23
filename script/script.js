window.onload = function() {
    var review = document.querySelectorAll(".review-page");
    
    for(var i=0; i<review.length; i++) {
        (function(i) {
            review[i].onclick = function(event) {
                var message = document.getElementsByTagName("textarea")[0];
                var taskNum = review[i].getAttribute("task");
                console.log(message.getAttribute("placeholder"));
                message.setAttribute("placeholder", "review task " + taskNum);
                message.focus();
            }
        })(i);
    }
}