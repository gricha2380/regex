let gameState = {};
let enemyData = {};
let levelData = {};

fetch("../enemies/data.json")
.then((resp) => resp.json())
.then( (res) => {
    enemyData = res;
    console.log("enemyData here", enemyData);
})

let loadLevelData = ()=>{
    fetch("../game/data.json")
    .then((resp) => resp.json())
    .then( (res) => {
        levelData = res;
        console.log("levelData here", enemyData);
        resetLevels();
    })
}
loadLevelData();

let resetHealth = () => {
    gameState.health = 100;
    gameState.damage = 0;
    document.querySelector("#health .max").innerText = gameState.health;
    document.querySelector("#health .value").innerText = gameState.health - gameState.damage;
}

let resetScore = () => {
    gameState.score = 0;
    gameState.level = 0;
    document.querySelector("#score .value").innerText = 0;
}

let increaseScore = (increase) => {
    gameState.score += increase;
    document.querySelector("#score .value").innerText = gameState.score;
}

let random = ()=>{
    let enemyTotal = Math.floor(Math.random()*2) + 1; // number of words between 1 & 3
    for (let i = 0; i < enemyTotal; i++) {
        $("#enemies").append(Math.random().toString(36).slice(6)+" "); // 6 random alphanumeric characters per word
    }
    enemiesDefault = document.querySelector('#enemies').innerText;
}

let resetLevels = () => {
    gameState.mode = "arcade"; //TODO: Let user pick mode from start screen
    gameState.level = levelData.mode[gameState.mode].levels[0];
    document.querySelector("#level .value").innerHTML = `${gameState.level.name}: ${gameState.level.description}`;
}

let restartLevel = ()=> {
}

let beatLevel = ()=> {
    //level cleared
    console.log("level cleared!");
    let newDiv = document.createElement('div');
    newDiv.id = "gameOver";
    newDiv.classList.add("modal");
    newDiv.innerHTML =
        `<div class="inner">
            <div>Level Cleared!</div>
            <div class="row" id="time">
                <label>Time</label>
                <div class="value">
                    00:00
                    <span class="record">New Record!</span>
                </div>
            </div>
            <div class="row" id="time">
                <label>Score</label>
                <div class="value">
                    ${gameState.score}
                    <span class="record">New Record!</span>
                </div>
            </div>
            <button id="newGameModal">New Game</button>
            <button id="goHomeModal">Home</button>
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
    })
}

let nextLevel = ()=> {
    gameState.level = levelData.mode[gameState.mode].levels[gameState.level.number+1];
    document.querySelector("#level .value").innerText = gameState.level.name;
}

let newGame = ()=> {
    resetHealth();
    resetScore();
    loadLevelData();
    random();
}
newGame();


let gameOver = ()=> {
    console.log("game over!");
    window.alert("Game over!");
    document.querySelector(".container").appendChild(`
        <div id="gameOver" class="modal">
        <div class="inner">
                <div>Game Over!</div>
                <button id="newGame">New Game</button>
            </div>
        </div>
    `);
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

