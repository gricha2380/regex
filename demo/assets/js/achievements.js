//  pull top 20 values from local storage -->
// show score and dates -->
//  Have categories for game mode. only bother linking arcade for now -->
let savedSessions;

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

let rows='';

savedSessions.sort((a,b)=> b.score - a.score);
console.log("values after sort", savedSessions)

for (let i = 0;i<savedSessions.length && i<20;i++) {
    rows += `<div class="row"><div class="num">${i+1}.</div><div class="score">${savedSessions[i].score}</div><div class="date">${new Date(savedSessions[i].date).toLocaleDateString('en-US',{year:'numeric',day:'numeric',month:'long'})}</div></div>`;
}
$("#scoresBody .left").html(rows);

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