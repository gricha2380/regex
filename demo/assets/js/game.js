let gameState = {};
let enemyData = {};
let savedSessions = [];

fetch("../enemies/data.json")
.then((resp) => resp.json())
.then( (res) => {
    enemyData = res;
    console.log("enemyData here", enemyData);
})

let loadGameState = ()=>{
    fetch("../game/data.json")
    .then((resp) => resp.json())
    .then( (res) => {
        gameState = res;
        console.log("gameState here", enemyData);
        resetLevels();
    }).then(res => {
        resetHealth();
        resetScore();
        gameState.current.timer.global.start = new Date();
            console.log("start timetamp",gameState.current.timer.global.start) // remove later
        random();
    })
}
loadGameState();

let resetHealth = () => {
    gameState.current.health = 100;
    gameState.current.damage = 0;
    document.querySelector("#health .max").innerText = gameState.current.health;
    document.querySelector("#health .value").innerText = gameState.current.health - gameState.current.damage;
}

let resetScore = () => {
    gameState.current.score = 0;
    // gameState.current.level = 0;
    document.querySelector("#score .value").innerText = 0;
}

let increaseScore = (increase) => {
    gameState.current.score += increase;
    document.querySelector("#score .value").innerText = gameState.current.score;
}

let random = ()=>{
    document.querySelector('#enemies').innerText = '';
    let enemyTotal = Math.floor(Math.random()*2) + 1; // number of words between 1 & 3
    for (let i = 0; i < enemyTotal; i++) {
        $("#enemies").append(Math.random().toString(36).slice(6)+" "); // 6 random alphanumeric characters per word
    }
    enemiesDefault = document.querySelector('#enemies').innerText;
}

let resetLevels = () => {
    // restart from first level
    gameState.current.mode = "tutorial"; //TODO: Let user pick mode from start screen
    gameState.current.level = gameState.mode[gameState.current.mode].levels[0];
    document.querySelector("#level .value").innerHTML = `${gameState.current.level.name}: ${gameState.current.level.description}`;
}

let restartLevel = ()=> {
    //restart current level
}

let beatLevel = ()=> {
    //level cleared
    console.log("level cleared!");

    gameState.current.timer.global.end = new Date();
    console.log("end time", gameState.current.timer.global.end);

    let newDiv = document.createElement('div');
    newDiv.id = "beatLevel";
    newDiv.classList.add("modal");
    newDiv.innerHTML =
        `<div class="inner">
            <div class="title">Level ${gameState.current.level.number+1} Cleared!</div>
            <div class="row" id="timeModal">
                <label>Time Spent</label>
                <div class="holder">
                    <div class="value">${calculateTime(gameState.current.timer.global.start,gameState.current.timer.global.end,"pretty")}</div>
                    <span class="record">New Record!</span>
                </div>
            </div>
            <div class="row" id="scoreModal">
                <label>Score</label>
                <div class="holder">
                    <div class="value">${gameState.current.score}</div>
                    <span class="record">New Record!</span>
                </div>
            </div>
            <div class="actions">
                <a href="battle.html"><button id="continueGameModal">Continue</button></a>
                <a href="index.html"><button id="goHomeModal">End Game</button></a>
            </div>
        </div>`
    document.querySelector(".container").appendChild(newDiv);
    document.querySelector("#continueGameModal").addEventListener("click", (event)=>{
        console.log("continue game...");
        event.preventDefault();
        newGame();
        document.querySelector('.container').removeChild(document.querySelector("#beatLevel"));
    })
    document.querySelector("#goHomeModal").addEventListener("click", (event)=>{
        console.log("going home");
        event.preventDefault();
        saveSession();
        window.location.href = "index.html";
    })
}

let nextLevel = ()=> {
    gameState.current.level = gameState.mode[gameState.mode].levels[gameState.current.level.number+1];
    document.querySelector("#level .value").innerText = gameState.current.level.name;
}

let newGame = ()=> {
    loadGameState();
}
newGame();


let gameOver = ()=> {
    console.log("game over!");
    saveSession();
    let newDiv = document.createElement('div');
    newDiv.id = "gameOver";
    newDiv.classList.add("modal");
    newDiv.innerHTML =
        `<div class="inner">
            <div class="title">Game Over!</div>
            <div class="row" id="levelsModal">
                <label>Levels Completed</label>
                <div class="holder">
                    <div class="value">${gameState.current.level.number}</div>
                    <span class="record">New Record!</span>
                </div>
            </div>
            <div class="row" id="timeModal">
                <label>Time Spent</label>
                <div class="holder">
                    <div class="value">${calculateTime(gameState.current.timer.global.start,gameState.current.timer.global.end,"pretty")}</div>
                    <span class="record">New Record!</span>
                </div>
            </div>
            <div class="row" id="scoreModal">
                <label>Score</label>
                <div class="holder">
                    <div class="value">${gameState.current.score}</div>
                    <span class="record">New Record!</span>
                </div>
            </div>
            <a><button id="newGameModal">New Game</button></a>
            <a><button id="goHomeModal">Home</button></a>
        </div>`
    document.querySelector(".container").appendChild(newDiv);
    document.querySelector("#newGameModal").addEventListener("click", ()=>{
        console.log("new game");
        event.preventDefault();
        saveSession();
        document.querySelector('.container').removeChild(document.querySelector("#gameOver"));
        newGame();
    })
    document.querySelector("#goHomeModal").addEventListener("click", (event)=>{
        console.log("going home");
        event.preventDefault();
        saveSession();
        window.location.href = "index.html";
    });
    // give oh no message
    // showScoreScreen()
    // save score data
    // return to main menu
}

let restart = ()=> {
    resetHealth();
    random();
    score();
    //TODO: NEW Game(); // make new game prprotype
}


// if saved game data exits, load it
if (window.localStorage.getItem('savedSessions')) {
    savedSessions = JSON.parse(window.localStorage.getItem('savedSessions'));
    console.log('Found existing localstorage values.',savedSessions);
  } 
// otherwise make a blank array
else {
    console.log('No local storage, starting fresh.');
    savedSessions = {};
}


let saveSession = () => {
    console.log("saving game data");
    
    // gameState.current.timer.global.end = new Date();
    // console.log("end time", gameState.current.timer.global.end)

    // calculate game duration
    
    // look for game mode inside savedSessions
    console.log("is there a savedsession for category?", gameState.current.mode,savedSessions,typeof savedSessions, savedSessions[gameState.current.mode], typeof savedSessions[gameState.current.mode])
    if (!savedSessions[gameState.current.mode]) {
        console.log("no element exists. making one now for this mode",gameState.current.mode)
        savedSessions[gameState.current.mode] = [];
        console.log("now this exists", savedSessions[gameState.current.mode])
    }
    savedSessions[gameState.current.mode].push(
        {
            "score":gameState.current.score,
            "date":gameState.current.timer.global.start,
            "time":calculateTime(gameState.current.timer.global.start, gameState.current.timer.global.end),
            "enemies":gameState.current.counter.enemies,
            "patterns":gameState.current.counter.patterns,
            "mode":gameState.current.mode,
            "level":gameState.current.level.number,
        }
    )
    window.localStorage.setItem('savedSessions', JSON.stringify(savedSessions));
}


/* Utilities */
let calculateTime = (start, end, pretty) => {
    // subtract unix time stamps
    // convert result
    if (pretty) {
        let difference = new Date(end - start);
        console.log("here's the diffrernce calc", difference)
        return `${addZero(difference.getUTCHours())}:${addZero(difference.getUTCMinutes())}:${addZero(difference.getUTCSeconds())}`;
    }
    else return new Date(end - start);
}

let addZero = (x)=> {
    if (x < 10) {
        x = "0" + x;
    }
    return x;
}

let goHome = () => {
    // window.location.href = "index.html";
}