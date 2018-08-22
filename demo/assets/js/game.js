let gameState = {};
let enemyData = {}, enemyArray;
let savedSessions = [];
let currentMode, currentLevel, currentWave, currentGoal;
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
            console.log("I found a current level",currentLevel, typeof currentLevel)
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
        if (gameState.current.mode == "arcade"){
            currentMode = gameState.current.mode;
            document.querySelector("#level .value").innerText = currentLevel+1;
            random();
        }
        else if (gameState.current.mode == "story"){
            tipText();
            dialogue = gameState.mode[currentMode].levels[currentLevel].tip.dialogue;
            counter = gameState.mode[currentMode].levels[currentLevel].tip.counter;
            currentWave = gameState.mode[gameState.current.mode].levels[currentLevel].currentWave;
            checkForCutScene();
            loadLevelEnemies(); // load level specific words
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
    document.querySelector("#attack").disabled = true; // disable end turn button
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
    enemyArray = gameState.mode[currentMode].levels[currentLevel].waves;
    console.log("these are your enemyArray opponents",enemyArray);
    document.querySelector('#enemies').innerText = ''; // clear previous enemies from screen
    enemiesDefault = '';

    
    // choose random enemy if toggle is on
    if (gameState.mode[currentMode].levels[currentLevel].randomizeEnemies) {
        let randomNumber = Math.floor((Math.random() * enemyArray.length) + 0);
        enemiesDefault = enemyArray[currentWave].enemies[randomNumber].enemy;
        currentGoal =  enemyArray[currentWave].enemies[randomNumber].goal;
        console.log("randomize is on. enemiesDefault", enemiesDefault);
        console.log("current goal", currentGoal);
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

let checkForCutScene = ()=> {
    console.log("checking for cut scene...")
    console.log("level current body", gameState.current.level);
    let counter = 0;
    let dialogue;
    
    let loadScene = ()=>{
        if (counter < dialogue.length) {
            let background = dialogue[counter].background;
            let backgroundChar = dialogue[counter].backgroundChar;
            let description = dialogue[counter].description;
            let foregroundChar = dialogue[counter].foregroundChar;
            let title = dialogue[counter].title;
            let div = 
            `<div id="cutScene" style="background-image:url(assets/images/backgrounds/${background});">
                <div id="cutSceneForegroundChar" style="background-image:url(assets/images/characters/${foregroundChar});"></div>
                <div id="cutSceneBackgroundChar" style="background-image:url(assets/images/characters/${backgroundChar});"></div>
                <div id="cutSceneDescription">
                    <div id="cutSceneTitle">${title}</div> 
                    <div class="descriptionText">${description}</div>
                </div>
            </div>`;
            $("body").prepend(div);
            $("#cutScene").on("click", function(){
                console.log("cutscene clicked...");
                counter++;
                $(this).remove();
                loadScene();
            });    
        } else if ($("#cutScene")){
            console.log("last cut scene shown. Now removing")
            $("#cutScene").remove();
            checkForTutorial();
        }
    }

    // look to gameState.current... if cutScene.enabled == true
    if (gameState.current.level.cutScene.enabled == true){
        dialogue = gameState.current.level.cutScene.dialogue;
        console.log("there's a cut scene!", dialogue);
        loadScene(); //
    }
    else {
        console.log("cutScenes are disabled");
    }
}


let checkForTutorial = ()=>{
    // 
    console.log("checking for tutorial scene...")
    console.log("level current body", gameState.current.level);
    let counter = 0;
    let dialogue;

    // adapated from loadCutScene. nEed to change code
    let loadTutorial = ()=>{
        if (counter < dialogue.length) {
            // will be standard looking modal
            // but will have arrow images to point to things
            let arrow = dialogue[counter].arrow.direction;
            let description = dialogue[counter].task;
            let positionX = dialogue[counter].arrow.positionX;
            let positionY = dialogue[counter].arrow.positionY;
            let animation = dialogue[counter].animation;
            let div = 
            `<div id="tutorialOverlay">
                <div id="tutorialDescription">${description}</div>
            </div>`;
            $("body").prepend(div);

            if (arrow && dialogue[counter].arrow.enabled) {
                console.log("showing arrow");
                $("#tutorialOverlay").append(`<div id="tutorialArrow" class="${arrow}Arrow" style="top:${positionY}%;left:${positionX}%"></div>`);
            }
            
            if (animation) {
                console.log("showing tutorial animation");
                $("#tutorialOverlay").append(`<div id="tutorialAnimation"><img src="assets/images/tutorials/${animation}"></div>`);
            }

            $("#tutorialOverlay").on("click", function(){
                console.log("tutorial clicked...");
                counter++;
                $(this).remove();
                loadTutorial();
            });    
        } else if ($("#tutorialOverlay")){
            console.log("last tutorial shown. Now removing")
            $("#tutorialOverlay").remove();
        }
    }

    // look to gameState.current... if cutScene.enabled == true
    if (gameState.current.level.tutorial.enabled == true){
        dialogue = gameState.current.level.tutorial.dialogue;
        console.log("there's a tutorial!", dialogue);
        loadTutorial(); //
    }
    else {
        console.log("tutorials are disabled");
    }

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
    $("#tip").hide();
    console.log("level cleared!");

    gameState.current.timer.global.end = new Date();
    console.log("end time", gameState.current.timer.global.end);

    let newDiv = document.createElement('div');
    newDiv.id = "beatLevel";
    newDiv.classList.add("modal");
    newDiv.innerHTML =
        `<div class="inner center">
            <div class="title">Level ${currentLevel+1} Cleared!</div>
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
        continueSession();
        document.querySelector('body').removeChild(document.querySelector("#beatLevel"));
    })
    document.querySelector("#goHomeModal").addEventListener("click", (event)=>{
        console.log("going home");
        event.preventDefault();
        // saveSessionResults(); TODO: Replace with a version that saves info without resetting
        newGame();
        window.location.href = "index.html";
    })
}

let nextLevel = ()=> {
    console.log(typeof currentLevel);
    console.log(`incrimenting level from ${currentLevel} to ${currentLevel+1}`);
    currentLevel = currentLevel+1;
    console.log(`current level is now ${currentLevel}`);

    if (currentMode == "arcade"){
        console.log("arcade level. You get a random...")
        document.querySelector("#level .value").innerText = currentLevel+1;
        random();
    }
    else if (currentMode == "story"){
        gameState.current.level = gameState.mode[currentMode].levels[gameState.current.level.number+1];
        console.log(`advancing to level ${gameState.current.level.number}`);
        document.querySelector("#level .value").innerText = gameState.current.level.name;
        tipText();
        dialogue = gameState.mode[currentMode].levels[currentLevel].tip.dialogue;
        counter = gameState.mode[currentMode].levels[currentLevel].tip.counter;
        currentWave = gameState.mode[gameState.current.mode].levels[currentLevel].currentWave;
        checkForCutScene();
        loadLevelEnemies(); // load level specific words
    }

}

let newGame = ()=> {
    loadGameState();
}
newGame();


let gameOver = ()=> {
    $("#tip").hide();
    console.log("game over!");
    // saveSessionResults();
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
            <div class="actions">
                <a><button id="newGameModal">New Game</button></a>
                <a><button id="goHomeModal">Home</button></a>
            </div>
        </div>`
    document.querySelector("body").appendChild(newDiv);
    document.querySelector("#newGameModal").addEventListener("click", ()=>{
        console.log("new game");
        event.preventDefault();
        saveSessionResults();
        document.querySelector('body').removeChild(document.querySelector("#gameOver"));
        newGame();
    })
    document.querySelector("#goHomeModal").addEventListener("click", (event)=>{
        console.log("going home");
        event.preventDefault();
        saveSessionResults();
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

// save data for high score list
let saveSessionResults = () => {
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

// save level progress if window is closed
let continueSession = ()=>{
    console.log("saving session to local storage");
    window.localStorage.setItem('currentLevel',JSON.stringify(gameState.current.level.number)); 
    // currentLevel = window.localStorage.getItem('currentLevel');
    nextLevel();
}

let tipText = () => {
    currentMode = gameState.current.mode;
    currentLevel = gameState.current.level.number;
    console.log("current level",currentLevel)
    console.log("current mode is", currentMode,gameState.mode[currentMode]);
    dialogue = gameState.mode[currentMode].levels[currentLevel].tip.dialogue;
    counter = gameState.mode[currentMode].levels[currentLevel].tip.counter;
    enabled = gameState.mode[currentMode].levels[currentLevel].tip.enabled;
    console.log("dialouge length", dialogue, dialogue.length)
    if (dialogue.length && enabled == true) {
        $("#tip").show();
        tipToggle();
        let dots = '';
        for (let i=0;i<dialogue.length;i++) {
            i == counter ? dots += `<span class="active">&#8226; </span>` : dots += `&#8226; `;
        }
        // console.log("all of dots", dots)
        $("#tip .pagination").html(dots)
        $("#tip .message").text(dialogue[counter]);
        $("#tip .container").removeClass("auto");
    }
}

let autoText = (message) => {
    $("#tip .container").addClass("auto");
    $("#tip .pagination").html(``);
    $("#tip .message").text(message);
}

$("#tip .container").on("click touchstart", ()=>{
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
    $("#tip .pagination").html(dots)
    $("#tip .message").text(dialogue[counter]);
})

let tipToggle = ()=>{
    console.log("tutoriaToggle activated")
    $("#tipToggle,.closeButton").on("click touchstart", ()=>{
        console.log("you clicked tip toggle")
        $("#tip").toggle();
    })
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