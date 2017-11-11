let gameClock = setInterval(function(){
    if(!state._lost){
        //check condition events returns true if an event is run, so if !false (not ran) exec a random event, this is so three events dont get spammed at once
        if(!checkConditionEvents()){
            runEvent(selectRandomEvent());
        }
        drawState();

        state._age += 1;
    }
}, 8000);

document.addEventListener("DOMContentLoaded", function(event) { 
    drawState();
    setTimeout(function(){
        logger.log("Your manor stands before you");
    },1000);
});