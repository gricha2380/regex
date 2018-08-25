let playerTimer = {
  "limit": 60 * 5,
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

  if (playerTimer.current <= 60) {
    console.log("less than 60 seconds")
    $('#timerWarning').show();
    $("#timerWarning .time").text(`${playerTimer.current}`);
  }

}

let timerCounter;

let timerTrigger = ()=> {
  $('#timerWarning').hide();
  clearInterval(timerCounter);
  console.log("timer reset");
  playerTimer.current = playerTimer.limit;
  timerCounter = setInterval(startTimer, 1000);
}