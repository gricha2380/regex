//  pull top 20 values from local storage -->
// show score and dates -->
//  Have categories for game mode. only bother linking arcade for now -->
let savedSessions;
let currentmode = "arcade";

// if saved game data exits, load it
if (window.localStorage.getItem('savedSessions')) {
    savedSessions = JSON.parse(window.localStorage.getItem('savedSessions'));
    console.log('Found existing localstorage values.',savedSessions);
  } 
// otherwise make a blank array
else {
    console.log('No local storage, starting fresh.');
    savedSessions = [];
}

let rows={};

savedSessions[currentmode].sort((a,b)=> b.score - a.score);
console.log("values after sort", savedSessions)

if (savedSessions[currentmode].length < 1) {
    console.log("No sessions found!");
    $("#scoresBody .left").html(`No sessions found. <br><a href="battle.html"><button id="play" class="main button" >Start Playing!</button></a>`);
}
else {
    // dive into each category
    for (category in savedSessions) {
        rows[category] = '';
        console.log("current category is", category)
        for (let i = 0;i<savedSessions[category].length && i<20;i++) {
            rows[category] += `<div class="row"><div class="num">${i+1}.</div><div class="score">${savedSessions[category][i].score}</div><div class="date">${new Date(savedSessions[category][i].date).toLocaleDateString('en-US',{year:'numeric',day:'numeric',month:'long'})}</div></div>`;
        }
    }
    $(".right h3").text(`${currentmode} Mode`)
    $("#scoresBody .left").html(rows[currentmode]);
}

$(".nav div").on("click", (event)=>{
    console.log("this is the event", event.currentTarget.id);
    if (event.currentTarget.id === 'scores') {
        $("#scoresBody").show();
        $("#achievementsBody").hide();
    } else {
        $("#scoresBody").hide();
        $("#achievementsBody").show();
    }
})

// todo: generate list for each category...
// hard code sections for arcade, tutorial