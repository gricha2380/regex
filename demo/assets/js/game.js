let gameState = {};
let enemyData = {};
let levelData = {};

fetch("../../enemies/data.json")
.then((resp) => resp.json())
.then( (res) => {
    enemyData = res;
    console.log("enemyData here", enemyData);
})

let loadLevelData = ()=>{
    fetch("../../game/data.json")
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
    window.alert("Game over!");
    document.querySelector(".container").appendChild(`
        <div id="gameOver">
            ... 
            <button id="newGame">New Game</button>
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

