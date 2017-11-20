//jshint esversion:6
class event {
  constructor(name, execFn) {
    this.name = name;
    this.exec = function() {
      execFn();
    };
  }
}

class conditionEvent {
  constructor(name, conditions, execFn) {
    this.name = name;
    this.exec = function() {
      execFn();
    };
    this.conditionsMet = conditions;
  }
}

let diseaseImmunity = false;

//these are events that will be randomly triggered, that alter the gamestate

let events = [
  new event("Peasant Uprising", function() {
    logger.log("The serfs become unruly. -1 stability");
    state.stability -= 1;
  }),
  new event("Storehouse Raid", function() {
    let percent = Math.floor(state.food / 10);
    logger.log(
      "A pack of wolves have broken into your storehouse. -" + percent + " food"
    );
    state.food -= 20;
  }),
  new event("Influenza", function() {
    if(diseaseImmunity){
      logger.log("A disease runs rampant, but your medically trained serf provides his remedies. You lose nothing.");
      return true;
    }
    let deathCount = Math.floor(state.serfs * Math.random());
    logger.log(
      "A disease runs rampant through the manor, and you must hire a doctor. -100 currency, -" + deathCount + " serfs"
    );
    state.currency -= 100;
    state.serfs -= deathCount;
  }),
  new event("Harvest Overwhelming", function() {
    logger.log("The Harvest was incredibly successful. +500 food");
    state.food += 500;
  }),
  new event("Plentiful Harvest", function() {
    logger.log("The Harvest was successful. +200 food");
    state.food += 200;
  }),
  new event("Unfortunate Harvest", function() {
    logger.log("The harvest underperformed. +25 food");
    state.food += 25;
  }),
  new event("New Recruits", function() {
    let randomPartySize = Math.floor(Math.random() * 3 + 2);
    logger.log("A small band of serfs joins. +" + randomPartySize + " serfs");
    state.serfs += randomPartySize;
  }),
  new event("Leaky Ceilings", function() {
    logger.log(
      "A leak has sprung in the roof of the Serf Quarters. -1 happiness"
    );
    state.happiness -= 1;
  }),
  new event("Hunger", function() {
    let foodTotal = state.serfs * 10;
    logger.log("The serfs are hungry. -" + foodTotal + " food");
    state.food -= foodTotal;
  }),
  new event("Lordly Party", function() {
    logger.log(
      "You throw a great dance in the ballroom, and invite the local lords, charging an entry fee, but requiring food to feed them. +1000 currency, -300 food"
    );
    state.food -= 300;
    state.currency += 1000;
  }),
  new event("The Miracle of Birth", function(){
      logger.log("You and your wife have an adorable child. +5 happiness, +5 stability, -100 currency, -100 food");
      state.happiness += 5;
      state.stability += 5;
      state.currency -= 100;
      state.food -= 100;

  }),
  new event("Favoring Winds", function(){
    logger.log("A great tradeship arrives, offering great deals and workers. +5 serfs, +500 food, -500 currency");
    state.currency -= 500;
    state.food += 500;
    state.serfs += 5;
  }),
  new event("Scientific Breakthrough", function(){
    logger.log("You send one of your serfs to medical school, and they learn much. -1 serf, -200 currency, +10 stability, +10 happiness, +immunity to disease events");
    state.serfs -= 1;
    state.currency -= 200;
    state.stability += 10;
    state.happiness += 10;
    diseaseImmunity = true;
  }),
  new event("Plagued Crops", function(){
    logger.log("The crops are diseased, and cannot be harvested. -300 food");
    state.food -= 300;
  }),
  new event("Game Balance", function(){
    let foodAmt = Math.floor(Math.random() * state.food);
    logger.log("A leak in your storehouse ruins some food. -" + foodAmt + " food");
    state.food -= foodAmt;
  }),
  new event("Tax Man Cometh", function(){
    let dollarAmt = Math.ceil(0.5 * state.currency);
    logger.log("The tax man robs you. -" +  dollarAmt + " currency");
    state.currency -= dollarAmt;
  }),
  new event("The Pastor", function(){
    let minusStability = state.stability - 1;
    logger.log("A pastor from afar teaches your serfs new ideals. -" + minusStability + " stability.");
    state.stability -= minusStability;
  })
];

//these events run when conditions are met, and immediately run.
let conditionEvents = [
  new conditionEvent(
    "Famine",
    function() {
      if (state.food <= 0 && state.currency <= 0) {
        return true;
      }
      return false;
    },
    function() {
      logger.red(
        "Your manor no longer has food, nor the means to purchase more. You have perished, and your serfs have abandoned you."
      );
      state._lost = true;
      setTimeout(function(){
        // window.location.reload();
      }, 10000);
    }
  ),
  new conditionEvent(
    "Food Shortage",
    function() {
      if (state.food <= 0) {
        return true;
      }
    },
    function() {
      logger.log(
        "You are out of food, and must purchase more. +100 food, -200 currency"
      );
      state.food += 100;
      state.currency -= 200;
    }
  ),
  new conditionEvent(
    "Poverty",
    function() {
      if (state.currency <= 0) {
        return true;
      }
    },
    function() {
      logger.log(
        "You are out of currency, and must sell some food to regain financial stability. -100 food, +200 currency"
      );
      state.food -= 100;
      state.currency += 100;
    }
  ),
  new conditionEvent(
    "Depression",
    function() {
      if (state.happiness <= 0) {
        return true;
      }
    },
    function() {
      logger.log(
        "Your serfs have fallen in a deep depression, and you must fix their quarters to mend this. +10 happiness, -500 currency"
      );
      state.happiness += 10;
      state.currency -= 500;
    }
  ),
  new conditionEvent(
    "Coup",
    function() {
      if (state.stability < 0) {
        return true;
      }
    },
    function() {
      logger.log(
        "Your serfs have plotted a coup, but have not succeeded, and you put them in their place, but kill a few in the process. -3 serfs, +10 stability, -1 happiness"
      );
      state.serfs -= 3;
      state.stability += 10;
      state.happiness -= 1;
    }
  ),
  new conditionEvent(
    "Serfdom Shortage",
    function() {
      if (state.serfs === 0 && state.currency <= 199) {
        return true;
      }
    },
    function() {
      logger.red(
        "You have no serfs, and no money to purchase more. You no longer have workers, and have lost."
      );
      state._lost = true;
    }
  ),
  new conditionEvent(
    "Low On Labor",
    function() {
      if (state.serfs <= 0 && state.currency > 200) {
        return true;
      }
    },
    function() {
      logger.log(
        "You are out of serfs, and must purchase some nearby land to accquire some more. -200 currency, +10 serfs"
      );
      state.serfs += 10;
      state.currency -= 200;
    }
  ),
  new conditionEvent(
    "Old Age",
    function(){
      if(state._age === 80){
        return true;
      }
    },
    function(){
      logger.log("You grow old...");
    }
  ), 
  new conditionEvent(
    "Older Age",
    function(){
      if(state._age === 100){
        return true;
      }
    },
    function(){
      logger.log("You grow older...");
    }
  ),
  new conditionEvent(
    "Older Age",
    function(){
      if(state._age === 120){
        return true;
      }
    },
    function(){
      logger.red("You have succumbed to the ages. You have peacefully died of old age. Your manor has been transferred to your son.");
      logger.log("Congratulations, your manor has lasted a lifetime - an achievement not frequently obtained.");
      state._lost = true;
    }
  )
];

let runEvent = function(e) {
  e.exec();
};

let selectRandomEvent = function() {
  let sel = events[Math.floor(Math.random() * events.length)];
  console.log(sel);
  return sel;
};

let checkConditionEvents = function() {
  for (let i = 0; i < conditionEvents.length; i++) {
    if (conditionEvents[i].conditionsMet()) {
      conditionEvents[i].exec();
      return true;
    }
  }
};
