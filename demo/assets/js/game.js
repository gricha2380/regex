let gameState = {};
let enemyData = {};

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

let newGame = ()=> {
    resetHealth();
    resetScore();
    random();
}
newGame();

fetch("../../enemies/data.json")
.then((resp) => resp.json())
.then( (res) => {
    enemyData = res;
    console.log("enemyData here", enemyData);
})

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

