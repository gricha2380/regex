let enemiesDefault; //holds original enemy array as text to allow resetting
let enemiesDefaultHTML; //holds original enemy array HTML
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
    $("#enemies").html(enemiesDefaultHTML);
})

// event listener for attack button
document.querySelector("#attack").addEventListener("click", e=>{
    increaseScore(gameState.holdPoints);
    endTurn();  
})

// produce regex to match enemies
let matchEnemies = ()=> {
    $("#enemyImageHolder .enemyImageHolder").removeClass("matched");
    gameState.holdPoints = 0; // holds points awarded each turn
    let enemyArray = enemiesDefault.split(""); // e.g.:["a", "b", "e", "1", "3", "3"]
    console.log("enemyArray content",enemyArray);
    let playerPattern = new RegExp(computeValues(),"g"); //let playerPattern = /\d/g; // static test
    console.log("playerpattern",playerPattern); //  e.g.:/\d/g
    let enemyMatch = enemiesDefault.match(playerPattern); // match enemy string with player's regex pattern
    if (!enemyMatch) {
        $("#enemies").html(enemiesDefaultHTML);
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
                    let currentMatch = $("#enemyImageHolder .enemyImageHolder").get(x); 
                    $(currentMatch).addClass("matched");
                }
            }
            console.log("About to add enemyArray[x]",enemyArray[x])
        });
    })
    console.log("all of enemyArray",enemyArray);
    let matchedEnemies = enemyArray.toString().replace(/,+/g,''); //convert array to string and remove commas
    console.log("matched enemies", matchedEnemies)
    // document.querySelector('#enemies').innerHTML = enemies;
    document.querySelector("#attack").disabled = false;
}    

let endTurn = ()=>{
    clearEnemies();
    gameState.holdPoints = 0;
}

let clearEnemies = (totalEnemyMatch)=> {
    //TODO: Rewrite to check for .matched class instead of <b> tags

    $("#hand .simple-grid").html(""); // clear hand
    // totalEnemyMatch = document.querySelector("#enemies").innerHTML; // use ("#enemies").innerText for plain characters
    let remainingEnemies = '';
    gameState.current.counter.enemies += $("#enemies .enemyImageHolder.matched").length;
    totalEnemyMatch = $("#enemies .enemyImageHolder").each(function(){
        if($(this).hasClass("matched")) {
            $(this).remove();
            gameState.current.counter.enemies ++; // save into global enemy counter
        } else {
            let dataValue = $(this).find(".enemyImg").attr("data-value");
            if (dataValue) {remainingEnemies += dataValue}
        }
    })

    console.log('regex results', remainingEnemies,remainingEnemies.length);
    enemiesDefault = remainingEnemies;
    enemiesDefaultHTML = $("#enemies").html();

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
    // let enemyString = document.querySelector("#enemies").innerText.replace(/\s/g, ''); // remove blank spaces
    let enemyString = enemiesDefault;
    
    // loop through each character
    // custom loop to allow timeout
    console.log("enemy string length", enemyString, enemyString.length);
    var i = 0;
    function f() {
        if( i < enemyString.length ){
            setTimeout( f, 3000 );
        }
        else {
            console.log("loop finisheed")
            clearAlert();
            $("#enemies .enemyImageHolder").removeClass("attacking");
            let returnMessage = "Your Turn!";
            alertMessage(returnMessage);
            autoText(returnMessage);
        }
        if (enemyData.enemies[enemyString[i]]) {

            console.log("i value", i)
            $("#enemies .enemyImageHolder").removeClass("attacking");
            let currentEnemy = $("#enemies .enemyImageHolder").not(".blank").get(i);
            $(currentEnemy).addClass("attacking");
    
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