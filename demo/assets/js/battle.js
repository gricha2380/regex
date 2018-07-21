let enemiesDefault = document.querySelector('#enemies').innerText; //holds original enemy array to allow resetting
let alert = document.querySelector("#alert"); // notification field

// dev tool: produce random enemy
$("#random").on("click touchstart", function(event){
    event.preventDefault();
    random();
    matchEnemies();
})

// method for displaying alerts
let alertMessage=(message)=> {
    $(alert).addClass("active");
    alert.innerText = message;
    clearAlert();
}

// load value for selected card
let processCards = (cardValue) => {
    $(".card").on("click touchstart", function(e){
        let cardName = $(this)[0].id; // jquery stores $(this) as an array
        let mode = $(this).find(".cardClass").attr("value");
        if ($(this).find(".cardClass").attr("value")=="manual") {
            // manual cards require user input
            cardValue = prompt(`Type your input. Example:${deckData[gameState.activeCategory][cardName].examples[0].pattern}`);
            console.log("cardValue",cardValue)
            if (!cardValue) return; // if user cancels
        } else {
            cardValue = $(this).attr("value"); // for auto card type
        }
        gameState.current.counter.patterns +=1; // Future note: If cards are removed from hand, subtract from pattern counter
        alert.innerText = "";
        generateCard(cardValue, cardName, mode);  // add card to hand
        addQuantifiers(); // add quantifiers between cards
        removeListener(); // event listener for removing cards
        matchEnemies(); // highlight matched enemies
    })
}

// visually add card into hand
let generateCard = (cardValue, cardName, mode)=>{
    $("#hand .simple-grid")
    .append(`
        <div class="${"lime"} z-depth-3 grid-item include" value="${cardValue}">
            <div class="remove">remove</div>
            <div class="innerBlock auto">
                <div class="name">${cardName}</div>
                <div>${cardValue}</div>
                <div class="cardClass" value="auto">${(mode === "auto") ? "⚡️" : "..."}</div>
            </div>
        </div>`
    )
}

// event listener to remove card
let removeListener = () => {
    $(".remove").on("click touchstart", function() {
        console.log("this is my parent", $(this).parent())
        $(this).parent().remove();
        addQuantifiers();
        matchEnemies();
    })
}

// remove cards from hand
$(".clear").on("click touchstart", function(e){
    alert.innerText = "";
    $("#hand .simple-grid").html("");
    document.querySelector('#enemies').innerText = enemiesDefault;
})

// event listener for attack button
document.querySelector("#attack").addEventListener("click", e=>{
    increaseScore(gameState.holdPoints);
    endTurn();  
})

// produce regex to match enemies
let matchEnemies = ()=> {
    gameState.holdPoints = 0; // holds points awarded each turn
    let enemies = document.querySelector("#enemies").innerText; // hold text based enemy string
    console.log("enemies value",enemies);
    let enemyArray = document.querySelector("#enemies").innerText.split(""); // e.g.:["a", "b", "e", "1", "3", "3"]
    console.log("enemyArray content",enemyArray);
    let playerPattern = new RegExp(computeValues(),"g"); //let playerPattern = /\d/g; // static test
    console.log("playerpattern",playerPattern); //  e.g.:/\d/g
    let enemyMatch = enemies.match(playerPattern); // match enemy string with player's regex pattern
    if (!enemyMatch) {
        document.querySelector('#enemies').innerText = enemiesDefault;// set dom to regex results
        alert.innerText = "No matches...";
        clearAlert();
        return;
    }
    console.log("enemyMatch",enemyMatch); // e.g.:["1", "3", "3"]
    
    // match each word and tag the matches
    enemyMatch.forEach(currentWord=>{
        console.log("currentWord contents",currentWord,currentWord.length);
        console.log("enemy array before action",enemyArray,enemyArray.length)
        
        // parse each character in the current word
        enemyArray.forEach((currentLetter,x) => {
            for(let i=0;i<currentWord.length;i++) {
                // find current character in enemy array
                if(currentWord[i]===enemyArray[x] && enemyArray[x]!==" "){
                    // go into game object, find score value for enemry type, call increaseScore(passvalue)
                    console.log(`currentLetter type is"${currentLetter}".`)
                    console.log("currentLetter at index",enemyData.enemies[currentLetter])
                    let enemyType = enemyData.enemies[currentLetter].type.toLowerCase(); // enemy classification
                    gameState.holdPoints += enemyData[enemyType].points.normal; // points to be awarded for matching enemy
                    console.log("points added",enemyData[enemyType].points.normal)
                    enemyArray[x] = `<b>${currentLetter}</b>`; // flag enemy as matched
                }
            }
            console.log("About to add enemyArray[x]",enemyArray[x])
        });
    })
    console.log("all of enemyArray",enemyArray);
    enemies = enemyArray.toString().replace(/,+/g,''); //convert array to string and remove commas
    console.log("returning enemies", enemies)
    document.querySelector('#enemies').innerHTML = enemies;
    document.querySelector("#attack").disabled = false;
}    

let endTurn = ()=>{
    clearEnemies();
    gameState.holdPoints = 0;
}

let clearEnemies = (totalEnemyMatch)=> {
    
    $("#hand .simple-grid").html(""); // clear hand
    totalEnemyMatch = document.querySelector("#enemies").innerHTML; // use ("#enemies").innerText for plain characters
    let matched = new RegExp("<b>(.*?)<\/b>","g");
    // console.log("match formula", matched)
    let remainingEnemies = totalEnemyMatch.replace(matched, ""); //remove matched enemies
    gameState.current.counter.enemies += totalEnemyMatch.match(matched).length; // save into global enemy counter
    console.log('regex results', remainingEnemies,remainingEnemies.length);
    document.querySelector('#enemies').innerText = remainingEnemies;// set dom to regex results
    enemiesDefault = document.querySelector('#enemies').innerText;

    // check for end of level conditions
    if (remainingEnemies=='' || remainingEnemies==' ') {
        console.log("no enemies left")
        document.querySelector("#enemies").innerText = "All Clear!";
        setTimeout(function() {
            document.querySelector("#enemies").innerText = "";
            beatLevel();
          }, 1000);
    }
    else {enemyAttack()} // otherwise let enemies attack
}

// enemy attacks player
let enemyAttack = ()=>{
    let enemyString = document.querySelector("#enemies").innerText.replace(/\s/g, ''); // remove blank spaces
    
    // loop through each character
    // custom loop to allow timeout
    console.log("enemy string length", enemyString.length);
    var i = 0;
    function f() {
        if( i < enemyString.length ){
            setTimeout( f, 3000 );
        }
        else {
            console.log("loop finisheed")
            clearAlert();
            document.querySelector("#enemies").innerHTML = enemyString;
            let returnMessage = "Your Turn!";
            alertMessage(returnMessage);
            autoText(returnMessage);
        }
        if (enemyData.enemies[enemyString[i]]) {

            console.log("0,i position",enemyString.substring(0,i))
            console.log("i+2 position",enemyString.substring(i+2))
            console.log("enemystring[i]",enemyString[i])
            console.log("full enemystring",enemyString)
            // split & mend string to place style on current character
            let split = `${enemyString.substring(0,i)}<span style="color:blue">${enemyString[i]}</span>${enemyString.substring(i+1)}`;
            console.log("split",split)
            console.log("i value", i)
            document.querySelector("#enemies").innerHTML = split;
    
            // determine enemy damage based on character type min & max
            let enemyType = enemyData.enemies[enemyString[i]].type;
            enemyType = enemyType.toLowerCase();
            console.log("enemy type is", enemyType);
            let damageRange = enemyData[enemyType].damage;
            let damage = doDamage(damageRange.min,damageRange.max);
            $(alert).addClass("active");
            alert.innerText = `Enemy "${enemyString[i]}" did ${damage} damage!`;
            console.log(`enemy ${enemyString[i]} did ${damage} damage!`,);
        }
        i++;
        
    }
    f();
}

// random damage is calculated & sent back
let doDamage = (min,max)=> {
    console.log(`min:${min} max:${max}`)
    let damage = Math.floor(Math.random()*max) + min;
    // damage is subtracted from player health
    gameState.current.damage += damage;
    document.querySelector("#health .value").innerText = gameState.current.health - gameState.current.damage;
    document.querySelector("#health .healthBar").setAttribute("style", `width:${gameState.current.health - gameState.current.damage}%`);

    // TODO: install Vue.js & have health bar synced for free

    checkHealth();
    return damage;
}

// make sure player's still alive
let checkHealth = ()=>{
    console.log("checking health");
    if (gameState.damage >= gameState.health) gameOver();
}

// clear notification area
let clearAlert = ()=> {
    setTimeout(() =>{
        console.log("clearing alert")
        alert.innerText="";
        $(alert).removeClass("active");
      }, 3000);
}

$("#endGame").on("click touchstart", function(event){
    event.preventDefault();
    endGame();
})

// endGame
// capture current score
// save in local storage (also add local storage code to regular end game process)
// show end game screen
let endGame = ()=>{
    gameOver();
}