let gameState = {};
let enemyData = {};

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
    gameState.current.mode = "arcade"; //TODO: Let user pick mode from start screen
    gameState.current.level = gameState.mode[gameState.current.mode].levels[0];
    document.querySelector("#level .value").innerHTML = `${gameState.current.level.name}: ${gameState.current.level.description}`;
}

let restartLevel = ()=> {
    //restart current level
}

let beatLevel = ()=> {
    //level cleared
    console.log("level cleared!");
    let newDiv = document.createElement('div');
    newDiv.id = "beatLevel";
    newDiv.classList.add("modal");
    newDiv.innerHTML =
        `<div class="inner">
            <div class="title">Level Cleared!</div>
            <div class="row" id="timeModal">
                <label>Time Spent</label>
                <div class="holder">
                    <div class="value">${gameState.current.timer.global}</div>
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
            <a href="battle.html"><button id="newGameModal">Continue</button></a>
                <a href="index.html"><button id="goHomeModal">End Game</button></a>
            </div>
        </div>`
    document.querySelector(".container").appendChild(newDiv);
    document.querySelector("#continueGameModal").addEventListener("click", ()=>{
        console.log("continue game...");
        document.querySelector('.container').removeChild(document.querySelector("#beatLevel"));
        newGame();
    })
    document.querySelector("#goHomeModal").addEventListener("click", ()=>{
        console.log("going home");
        document.querySelector('.container').removeChild(document.querySelector("#beatLevel"));
        newGame();
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
    let newDiv = document.createElement('div');
    newDiv.id = "gameOver";
    newDiv.classList.add("modal");
    newDiv.innerHTML =
        `<div class="inner">
            <div class="title">Game Over!</div>
            <div class="row" id="levelsModal">
                <label>Levels Completed</label>
                <div class="holder">
                    <div class="value">${gameState.current.level.number+1}</div>
                    <span class="record">New Record!</span>
            </div>
            <div class="row" id="scoreModal">
                <label>Score</label>
                <div class="holder">
                    <div class="value">${gameState.current.score}</div>
                    <span class="record">New Record!</span>
                </div>
            </div>
            <a href="battle.html"><button id="newGameModal">New Game</button></a>
            <a href="index.html"><button id="goHomeModal">Home</button></a>
        </div>`
    document.querySelector(".container").appendChild(newDiv);
    document.querySelector("#newGameModal").addEventListener("click", ()=>{
        console.log("new game");
        document.querySelector('.container').removeChild(document.querySelector("#gameOver"));
        newGame();
    })
    document.querySelector("#goHomeModal").addEventListener("click", ()=>{
        console.log("going home");
        document.querySelector('.container').removeChild(document.querySelector("#gameOver"));
        newGame();
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

