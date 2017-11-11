let logger = {
    log: function(msg){
        document.getElementById("log").innerHTML = "<p class='loggerMsg'> " + msg + "</p> " + document.getElementById("log").innerHTML;
    },
    red: function(msg){
        document.getElementById("log").innerHTML = "<p class='loggerMsg loggerRed'> " + msg + "</p> " + document.getElementById("log").innerHTML;
        
    }
}