//  pull top 20 values from local storage -->
// show score and dates -->
//  Have categories for game mode. only bother linking arcade for now -->
let savedSessions;
let currentmode = "arcade";
let categoryHeaders='';
let rows={};
let gameState = {};

let quote;
let number;
let randomName;

let loadGameState = ()=>{
    fetch("../game/data.json")
    .then((resp) => resp.json())
    .then( (res) => {
        gameState = res;
    }).then( res => {randomCaptions();})
}
loadGameState();


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

let listeners = ()=>{
    $(".achievementCategory").on("click",(event)=>{
        console.log("current mode is now", event.target.attributes.value.nodeValue)
        currentmode = event.target.attributes.value.nodeValue;
        loadScores();
        randomCaptions();
    })
}

let loadScores = () => {
    savedSessions[currentmode].sort((a,b)=> b.score - a.score);
    console.log("values after sort", savedSessions)
    
    if (savedSessions[currentmode].length < 1) {
        console.log("No sessions found!");
        $("#scoresBody .left").html(`No sessions found. <br><a href="battle.html"><button id="play" class="main button" >Start Playing!</button></a>`);
    }
    else {
        // dive into each category
        categoryHeaders='';
        for (category in savedSessions) {
            if (category == currentmode) {
                categoryHeaders+= `<div class="achievementCategory active" value="${category}">${category}</div>`;
            } else {
                categoryHeaders+= `<div class="achievementCategory" value="${category}">${category}</div>`;
            }
            rows[category] = '';
            console.log("current category is", category)
            for (let i = 0;i<savedSessions[category].length && i<20;i++) {
                rows[category] += `<div class="row"><div class="num">${i+1}.</div><div class="score">${savedSessions[category][i].score}</div><div class="date">${new Date(savedSessions[category][i].date).toLocaleDateString('en-US',{year:'numeric',day:'numeric',month:'long'})}</div></div>`;
            }
        }
        $("#scoresBody h1").text(`${currentmode} Mode`)
        $("#scoresBody .left").html(rows[currentmode]);
        $("#gameModes").html(categoryHeaders);
        listeners();
    }
    
    $(".nav div").on("click", (event)=>{
        console.log("this is the event", event.currentTarget.id);
        if (event.currentTarget.id === 'scores') {
            $(".nav div").removeClass("active")
            $("#scores").addClass("active");
            $("#scoresBody").show();
            $("#achievementsBody").hide();
        } else {
            $(".nav div").removeClass("active")
            $("#achievements").addClass("active");
            $("#scoresBody").hide();
            $("#achievementsBody").show();
        }
        randomCaptions();
    })
}
loadScores();


let randomCaptions = () => {
    // random image


    // random quote
    number = Math.floor(Math.random() * gameState.achievements.quotes.length);
    quote = gameState.achievements.quotes[number];

    if (quote.indexOf("***") !== -1) {
        randomName = Math.floor(Math.random() * gameState.achievements.names.length)
        $(".right h4").text(quote.replace("***", gameState.achievements.names[randomName].name));
        $(".right .image").html(`<img src="${gameState.achievements.names[number].image}" class="achievementImage">`);
    } else {
        $(".right h4").text(quote.name);
        $(".right .image").html(`<img src="${gameState.achievements.names[number].image}" class="achievementImage">`)
    }
}


// todo: generate list for each category...
// hard code sections for arcade, tutorial