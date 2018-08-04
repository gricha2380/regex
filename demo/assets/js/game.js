let gameState = {};
let enemyData = {}, enemyArray;
let savedSessions = [];
let currentMode, currentLevel, currentWave;
let dialogue, counter;

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
    }).then(res => {
        // look in localstorge for current level
        // if present set gameState.current.level = localstorage
        // elsewhere... when level completed, add new level to localstorage
        findGameMode();
        if (window.localStorage.getItem('currentLevel')) {
            // currentLevel = window.localStorage.getItem('currentLevel');
            currentLevel = JSON.parse(window.localStorage.getItem('currentLevel'));
            console.log("I found a current level",currentLevel)
        }
        if (!currentLevel || currentLevel===0) {
            console.log("starting level fresh...")
            resetLevels();
            resetHealth();
            resetScore();
            gameState.current.timer.global.start = new Date();
            console.log("start timetamp",gameState.current.timer.global.start) // remove later   
            eraseSavedLevelProgress();
        }
        document.querySelector("#level .value").innerHTML = `${gameState.current.level.name}: ${gameState.current.level.description}`;
        tutorialText();
        dialogue = gameState.mode[currentMode].levels[currentLevel].tutorial.dialogue;
        counter = gameState.mode[currentMode].levels[currentLevel].tutorial.counter;

        if (gameState.current.mode == "arcade"){
            random();
        }
        else if (gameState.current.mode == "story"){
            currentWave = gameState.mode[gameState.current.mode].levels[currentLevel].currentWave;
            // load level specific words
            loadLevelEnemies();
        }

    })
}

let resetHealth = () => {
    gameState.current.health = 100;
    gameState.current.damage = 0;
    document.querySelector("#health .max").innerText = gameState.current.health;
    document.querySelector("#health .value").innerText = gameState.current.health - gameState.current.damage;
}

let resetScore = () => {
    gameState.current.score = 0;
    document.querySelector("#score .value").innerText = 0;
}

let increaseScore = (increase) => {
    gameState.current.score += increase;
    document.querySelector("#score .value").innerText = gameState.current.score;
}

let random = ()=>{
    document.querySelector('#enemies').innerText = '';
    let enemyTotal = Math.floor(Math.random()*2) + 1; // number of words between 1 & 3
    enemiesDefault = '';
    for (let i = 0; i < enemyTotal; i++) {
        enemiesDefault += Math.random().toString(36).slice(6)+" "; // 6 random alphanumeric characters per word
        // $("#enemies").append(Math.random().toString(36).slice(6)+" "); // 6 random alphanumeric characters per word
    }
    console.log("These are your enemies", enemiesDefault, enemiesDefault.length);
    
    let enemyImages = '';
    for (i=0;i<enemiesDefault.length;i++) {
        if (enemiesDefault[i] === " ") {
            console.log("current blank space", enemiesDefault[i])
            enemyImages += `<div class="enemyImageHolder blank"><span class="enemyImg blank"></span></div>`;
        }
        else if (!isNaN(enemiesDefault[i])) {
            console.log("current number", enemiesDefault[i])
            enemyImages += `<div class="enemyImageHolder"><img src="assets/images/numbers/${enemiesDefault[i]}.svg" class="enemyImg number ${enemiesDefault[i]}" data-value="${enemiesDefault[i]}" /></div>`
        }
        else if (enemiesDefault[i] === enemiesDefault[i].toUpperCase()) {
            console.log("current capital letter", enemiesDefault[i])
            enemyImages += `<div class="enemyImageHolder"><img src="assets/images/letters/uppercase/${enemiesDefault[i]}.svg" class="enemyImg upper letter ${enemiesDefault[i]}" data-value="${enemiesDefault[i]}"/></div>`
        }
        else if (enemiesDefault[i] === enemiesDefault[i].toLowerCase()) {
            console.log("current lowercase letter", enemiesDefault[i])
            enemyImages += `<div class="enemyImageHolder"><img src="assets/images/letters/lowercase/${enemiesDefault[i]}.svg" class="enemyImg lower letter ${enemiesDefault[i]}" data-value="${enemiesDefault[i]}"/></div>`
        }
        else {
            console.log("current symbol", enemiesDefault[i])
            enemyImages += `<div class="enemyImageHolder"><img src="assets/images/symbols/${enemiesDefault[i]}.svg" class="enemyImg symbol ${enemiesDefault[i]}" data-value="${enemiesDefault[i]}"/></div>`
        }
    }
    let enemyImageHolder = `<div id="enemyImageHolder">${enemyImages}</div>`;
    $("#enemies").append(enemyImageHolder);
    enemiesDefaultHTML = $("#enemies").html();
    inspectEnemyListener();
}

let loadLevelEnemies = ()=>{
    enemyArray = gameState.mode[gameState.current.mode].levels[currentLevel].waves;
    console.log("these are your enemyArray opponents",enemyArray);
    document.querySelector('#enemies').innerText = ''; // clear previous enemies from screen
    enemiesDefault = '';

    
    // choose random enemy if toggle is on
    if (gameState.mode[gameState.current.mode].levels[currentLevel].randomizeEnemies) {
        enemiesDefault = enemyArray[currentWave].enemies[Math.floor((Math.random() * enemyArray.length) + 0)].enemy; 
        console.log("randomize is on. enemiesDefault", enemiesDefault)
    } else {
        enemiesDefault = enemyArray[currentWave].enemies[0].enemy;
        console.log("randomize is off. enemiesDefault", enemiesDefault)
    }

    console.log("enemiesDefault before loop",enemiesDefault);

    let enemyImages = '';

    for (i=0;i<enemiesDefault.length;i++) {
        if (enemiesDefault[i] === " ") {
            console.log("current blank space", enemiesDefault[i])
            enemyImages += `<div class="enemyImageHolder blank"><span class="enemyImg blank"></span></div>`;
        }
        else if (!isNaN(enemiesDefault[i])) {
            console.log("current number", enemiesDefault[i])
            enemyImages += `<div class="enemyImageHolder"><img src="assets/images/numbers/${enemiesDefault[i]}.svg" class="enemyImg number ${enemiesDefault[i]}" data-value="${enemiesDefault[i]}" /></div>`
        }
        else if (enemiesDefault[i] === enemiesDefault[i].toUpperCase()) {
            console.log("current capital letter", enemiesDefault[i])
            enemyImages += `<div class="enemyImageHolder"><img src="assets/images/letters/uppercase/${enemiesDefault[i]}.svg" class="enemyImg upper letter ${enemiesDefault[i]}" data-value="${enemiesDefault[i]}"/></div>`
        }
        else if (enemiesDefault[i] === enemiesDefault[i].toLowerCase()) {
            console.log("current lowercase letter", enemiesDefault[i])
            enemyImages += `<div class="enemyImageHolder"><img src="assets/images/letters/lowercase/${enemiesDefault[i]}.svg" class="enemyImg lower letter ${enemiesDefault[i]}" data-value="${enemiesDefault[i]}"/></div>`
        }
        else {
            console.log("current symbol", enemiesDefault[i])
            enemyImages += `<div class="enemyImageHolder"><img src="assets/images/symbols/${enemiesDefault[i]}.svg" class="enemyImg symbol ${enemiesDefault[i]}" data-value="${enemiesDefault[i]}"/></div>`
        }
    }
    let enemyImageHolder = `<div id="enemyImageHolder">${enemyImages}</div>`;
    $("#enemies").append(enemyImageHolder);
    enemiesDefaultHTML = $("#enemies").html();
    // console.log("HTML enemies",enemiesDefaultHTML);
    inspectEnemyListener();
}

let resetLevels = () => {
    currentLevel = 0;
    gameState.current.level = gameState.mode[gameState.current.mode].levels[0]; // restart from first level
}

let eraseSavedLevelProgress = ()=>{
    window.localStorage.removeItem('currentLevel');
}

let restartLevel = ()=> {
    //restart current level
}

let findGameMode = ()=> {
    if (window.localStorage.getItem('gameMode')) {
        gameState.current.mode = JSON.parse(window.localStorage.getItem('gameMode'));
        console.log('Found existing gameMode from localStorage.',gameState.current.mode);
    } 
    else {
        console.log('No game mode, defaulting to arcade.');
        gameState.current.mode = "arcade";
    }
    
    $(".gameType").text(`${gameState.current.mode} mode`);
}

//level cleared
let beatLevel = ()=> {
    $("#tutorial").hide();
    console.log("level cleared!");

    gameState.current.timer.global.end = new Date();
    console.log("end time", gameState.current.timer.global.end);

    let newDiv = document.createElement('div');
    newDiv.id = "beatLevel";
    newDiv.classList.add("modal");
    newDiv.innerHTML =
        `<div class="inner center">
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
    document.querySelector("body").appendChild(newDiv);
    document.querySelector("#continueGameModal").addEventListener("click", (event)=>{
        console.log("continue game...");
        event.preventDefault();
        newGame();
        document.querySelector('body').removeChild(document.querySelector("#beatLevel"));
    })
    document.querySelector("#goHomeModal").addEventListener("click", (event)=>{
        console.log("going home");
        event.preventDefault();
        // saveSession(); TODO: Replace with a version that saves info without resetting
        continueSession();
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
    $("#tutorial").hide();
    console.log("game over!");
    saveSession();
    let newDiv = document.createElement('div');
    newDiv.id = "gameOver";
    newDiv.classList.add("modal");
    newDiv.innerHTML =
        `<div class="inner center">
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
    document.querySelector("body").appendChild(newDiv);
    document.querySelector("#newGameModal").addEventListener("click", ()=>{
        console.log("new game");
        event.preventDefault();
        saveSession();
        document.querySelector('body').removeChild(document.querySelector("#gameOver"));
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
    eraseSavedLevelProgress();
}

let continueSession = ()=>{
    currentLevel++;
    window.localStorage.setItem('currentLevel',JSON.stringify([gameState.current.level]+1));
}

let tutorialText = () => {
    currentMode = gameState.current.mode;
    currentLevel = gameState.current.level.number;
    console.log("current level",currentLevel)
    console.log("current mode is", currentMode,gameState.mode[currentMode]);
    dialogue = gameState.mode[currentMode].levels[currentLevel].tutorial.dialogue;
    counter = gameState.mode[currentMode].levels[currentLevel].tutorial.counter;
    enabled = gameState.mode[currentMode].levels[currentLevel].tutorial.enabled;
    // console.log("dialouge length", dialogue, dialogue.length)
    if (dialogue.length && enabled == true) {
        $("#tutorial").show();
        tutorialToggle();
        let dots = '';
        for (let i=0;i<dialogue.length;i++) {
            i == counter ? dots += `<span class="active">&#8226; </span>` : dots += `&#8226; `;
        }
        // console.log("all of dots", dots)
        $("#tutorial .pagination").html(dots)
        $("#tutorial .message").text(dialogue[counter]);
        $("#tutorial .container").removeClass("auto");
    }
}

let autoText = (message) => {
    $("#tutorial .container").addClass("auto");
    $("#tutorial .pagination").html(``);
    $("#tutorial .message").text(message);
}

$("#tutorial .container").on("click touchstart", ()=>{
    currentMode = gameState.current.mode;
    currentLevel = gameState.current.level.number;
    counter++
    if (counter >= dialogue.length) {
        console.log(`counter ${counter} greater or equal to dialouge length ${dialogue.length}`)
        console.log("counter value before change", counter)
        counter = 0
        console.log("counter value after change", counter)
    } else {
        console.log(`counter ${counter} less than dialouge length ${dialogue.length}`)
        console.log("counter value before change", counter)
        console.log("counter value after change", counter)
    }
    let dots = '';
    for (let i=0;i<dialogue.length;i++) {
        i == counter ? dots += `<span class="active">&#8226; </span>` : dots += `&#8226; `;
    }
    $("#tutorial .pagination").html(dots)
    $("#tutorial .message").text(dialogue[counter]);
})

let tutorialToggle = ()=>{
    console.log("tutoriaToggle activated")
    $("#tutorialToggle,.closeButton").on("click touchstart", ()=>{
        console.log("you clicked tutorial toggle")
        $("#tutorial").toggle();
    })
}
// tutorialToggle();

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

let bobRoss = ()=> {
    let set = [
        "Let that brush dance around there and play. Clouds are free they come and go as they please. Isn't that fantastic?",
        "Let's give him a friend too. Everybody needs a friend. Let's put some happy little clouds in our world.",
        "All you need to paint is a few tools, a little instruction, and a vision in your mind. You need the dark in order to show the light. The light is your friend. Preserve it.",
        "Trees cover up a multitude of sins. Just make little strokes like that. There comes a nice little fluffer.",
        "Every highlight needs it's own personal shadow. This is gonna be a happy little seascape. The more we do this - the more it will do good things to our heart.",
        "You have freedom here. The only guide is your heart.",
        "It is a lot of fun. This is your world. Just relax and let it flow. That easy.",
        "The only prerequisite is that it makes you happy. If it makes you happy then it's good.",
        "It's a very cold picture, I may have to go get my coat. It’s about to freeze me to death.",
        "You want your tree to have some character. Make it special."
    ]
    return set[Math.floor(Math.random()*set.length) + 1];
}