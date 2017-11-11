//jshint esversion:6
let state = {
    serfs: 5,
    stability: 5,
    food: 100,
    currency: 1000,
    happiness: 10,
    _lost: false,
    _age: 0,
};


let drawState = function(){
    let drawnHTML = "";
    let stateKeys = Object.keys(state);
    for(let i = 0; i < stateKeys.length; i++){
        if(stateKeys[i].substring(0,1) !== "_"){
            drawnHTML += "<p>" + stateKeys[i] + ": " + state[stateKeys[i]] + "</p>";      
        }
    }

    document.getElementById("stats").innerHTML = drawnHTML;
}