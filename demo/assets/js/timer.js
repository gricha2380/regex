let warningAtTime = 60; //60 standard
let timerCounter;
let playerTimer = {
  "limit": 60 * 5, //60 * 5 standard
  "current":0
}; 

playerTimer.current = playerTimer.limit;

let startTimer = () => {

  playerTimer.current = playerTimer.current - 1;

  if (playerTimer.current <= 0) {
    console.log("time's up!");
    $("#timerWarning").hide();
    clearInterval(timerCounter);
    endTurn();
    return;
  }

  if (playerTimer.current <= warningAtTime) {
    console.log(`less than ${warningAtTime} seconds`);
    $('#timerWarning').show();
    $("#timerWarning .time").text(`${playerTimer.current}`);
  }

}

let timerTrigger = ()=> {
  $('#timerWarning').hide();
  clearInterval(timerCounter);
  console.log("timer reset");
  playerTimer.current = playerTimer.limit;
  timerCounter = setInterval(startTimer, 1000);
}

let timerTriggerStop = ()=> {
  $('#timerWarning').hide();
  clearInterval(timerCounter);
  console.log("timer is stopped");
}

let clearAllIntervals = ()=>{
  console.log("loop to clear inervals")
  for (var i = 1; i < 50; i++) {
    console.log("interval loop # "+i);
    window.clearInterval(i);
    clearInterval(timerCounter);
  }
}

let checkHealthSetTimer = () => {
  console.log("inside check health timer");
  if (gameState.current.damage <= gameState.current.health) {
    console.log("heath is okay, triggering timer")
    timerTrigger();
  } else {
      console.log("no health left. ending timer");
      clearInterval(timerCounter);
  }
}