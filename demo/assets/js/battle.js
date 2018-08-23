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
    $(".card:not(.locked)").on("click touchstart", function(e){
        let cardName = $(this).attr("data-name"); // jquery stores $(this) as an array
        let mode = $(this).find(".cardClass").attr("value");
        if ($(this).find(".cardClass").attr("value")=="manual") {
            // manual cards require user input
            cardValue = prompt(`Type your input. Example:${deckData[gameState.activeCategory][cardName].examples[0].pattern}`,`${deckData[gameState.activeCategory][cardName].examples[0].pattern}`);
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
        matchEnemies(); // currently caues infinite loop
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

// produce regex to match enemies. The meat and potatoes of the engine!
let matchEnemies = ()=> {
    $("#enemyImageHolder .enemyImageHolder").removeClass("matched");
    gameState.holdPoints = 0; // holds points awarded each turn

    // let enemiesDefault = "hello world"; //temp variable
    // let playerPattern = /^hello w/igm; //temp variable
    // let playerPattern = new RegExp("[a-e]?","gim");
    let playerPattern = new RegExp(computeHand(),"g"); // gim = expression flags. global, case insensitive, multiline
    console.log("playerPattern regex",playerPattern)
    let matchSet = [];
    let resultArray = enemiesDefault.split("");
    
   console.log("current value of enemiesDefault",enemiesDefault)
   console.log("playerPattern source",playerPattern.source,playerPattern.source.length)
    if (playerPattern.source.length > 0 && playerPattern.source !== "(?:)") {
        let counter = 0; // to prevent infinite loop
        
        // iterate through each 
        while ((match = playerPattern.exec(enemiesDefault)) != null) {
            console.log("in while loop",match,match.index);
            console.log("match char", match[0]);
            if (match[0] !== " ") {
                console.log("not blank, pushing to matchSet...");
                
                matchSet.push({"start":match.index,"end":playerPattern.lastIndex});
            }
            console.log("counter value", counter);
            counter++;
            if (counter >=20) {
                console.log("Too many loops. Aborting.");
                break
            }
        }
        
    } else {
        console.log("there was no playerPattern",playerPattern,playerPattern.length)
    }

    console.log("pattern matches", matchSet, matchSet.length); // matchSet e.g.: [{start: 0, end: 5}]
    if (matchSet.length==0 || !matchSet) {
        $("#enemies").html(enemiesDefaultHTML);
        alert.innerText = "No matches...";
        clearAlert();
        return;
    }
    else {
        // attach matched tag to matching enemies
        console.log("resultArray",resultArray, resultArray.length) // e.g.: ["w", "e", "l", "c", "o", "m", "e"]
        for (let i=0;i<=resultArray.length;i++) {
            // if index of current resultArray value is present in any of the ranges from matchSet array

            // do for loop for each item in matchSet
           console.log("matchSet here",matchSet);
            console.log("All enemyHolders from DOM",$("#enemyImageHolder .enemyImageHolder"));
           // strip blanks from enemy string before entering matchSet

           for (matchRange in matchSet) {
                console.log("matchset start mostly",matchSet[matchRange])
                console.log("current matchSet start + end",matchSet[matchRange].start,matchSet[matchRange].end)

                if (i >= matchSet[matchRange].start && i <= matchSet[matchRange].end) {
                    console.log("match found",resultArray[i],matchSet[matchRange].start, matchSet[matchRange].end);
                    let currentMatch = $("#enemyImageHolder .enemyImageHolder").get(i); //was using :not('.blank')
                    // try .blank again. 
                    console.log("here is currentmatch",currentMatch)
                    console.log("here is i",i)

                    if (!$(currentMatch).hasClass("blank")) {
                        console.log("no blank class")
                        $(currentMatch).addClass("matched"); // visually mark div with checkmark
                        let currentLetter = $(currentMatch).find("img").attr("data-value");
                        if (currentLetter) {
                            console.log("currentLetter",currentLetter);
                            let enemyType = enemyData.enemies[currentLetter].typeShort; // enemy classification
                            gameState.holdPoints += enemyData[enemyType].points.normal; // points to be awarded for matching enemy
                            console.log("points added",enemyData[enemyType].points.normal);
                        }
                    }
                }
           }
        }
        document.querySelector("#attack").disabled = false;
        inspectEnemyListener();
    }
}  

let endTurn = ()=>{
    clearEnemies();
    gameState.holdPoints = 0;
}

// check for goal completion and remove enemies 
let clearEnemies = (totalEnemyMatch)=> {

    $("#hand .simple-grid").html(""); // clear hand
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
    console.log("enemiesDefault is now",enemiesDefault);
    enemiesDefaultHTML = $("#enemies").html();
    inspectEnemyListener();

    let checkGoalCompletion = ()=>{
        if (remainingEnemies == currentGoal) {
            // next level function
            checkForNewWave();
        } else if (remainingEnemies=='' || remainingEnemies==' ') {
            // check if results 
            // find way to determine when results should be compared with goal
            // it can't show game over at every end turn check
            // how to know when enemyArray is ready to be checked?
            // maybe only check when all enemies are gone?
            // question is kind of important for gameplay
            console.log("object not met. game over");
            gameOver();
        } else{
            enemyAttack(); // otherwise let enemies attack
        }
    }

    // check at every clearing to see if level goal is met 
    if (gameState.current.mode == "story") {
        checkGoalCompletion();
    }
    // check for end of level conditions
    else if (gameState.current.mode == "story" && remainingEnemies=='' || remainingEnemies==' ') {
        console.log("no enemies left");
        console.log("verifying level goals");
        checkForNewWave();
    }
    else if (gameState.current.mode == "arcade" && remainingEnemies=='' || remainingEnemies==' ') {
        document.querySelector("#enemies").innerText = "All Clear!";
        setTimeout(function() {
            document.querySelector("#enemies").innerText = "";
            beatLevel();
        }, 1000);
    }
    else {enemyAttack()} 
    
}


let checkForNewWave = ()=> {
    console.log("checking for other waves");
    // if current wave is last wave
    if (currentWave && currentWave+1 == enemyArray.length) {
        
        document.querySelector("#enemies").innerText = "Level Cleared!";
        setTimeout(function() {
            document.querySelector("#enemies").innerText = "";
            beatLevel();
        }, 1000);
    }
    // if multiple waves of enemies
    else {
        document.querySelector("#enemies").innerText = "Objective Complete!";
        setTimeout(function() {
            alertMessage("First wave complete!");
            alertMessage("Prepare for next wave...");
            document.querySelector("#enemies").innerText = "";
            document.querySelector("#attack").disabled = true; // disable end turn button
            currentWave++;
            autoText(enemyArray[currentWave].dialogue.intro);
            loadLevelEnemies();
        }, 1000);
        
    }
}

// enemy attacks player
let enemyAttack = ()=>{
    document.querySelector("#attack").disabled = true; // disable end turn button

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
            document.querySelector("#health").classList.remove("shake"); // remove healthbar shake. Shake added in doDamage()
        }
        if (enemyData.enemies[enemyString[i]]) {

            console.log("i value", i)
            $("#enemies .enemyImageHolder").removeClass("attacking");
            let currentEnemy = $("#enemies .enemyImageHolder").not(".blank").get(i);
            $(currentEnemy).addClass("attacking");
    
            // determine enemy damage based on character type min & max
            let enemyType = enemyData.enemies[enemyString[i]].typeShort;
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
    document.querySelector("#health").classList.add("shake");
    document.querySelector("#health .healthBar").setAttribute("style", `width:${gameState.current.health - gameState.current.damage}%`);

    // TODO: install Vue.js & have health bar synced for free

    checkHealth();
    return damage;
}

// make sure player's still alive
let checkHealth = ()=>{
    console.log("checking health");
    console.log("current damage", gameState.damage);
    console.log("current health", gameState.health);
    if (gameState.current.damage >= gameState.current.health) gameOver();
}

// had to move this to bott0om of game.js for unknown reasons..
let inspectEnemyListener = ()=>{
    $(".enemyImageHolder").off();
    $(".enemyImageHolder").on("click touchstart", function(){
        if ($(this).find(".enemyImg").attr("data-value")) {
            let imgVal = $(this).find(".enemyImg").attr("data-value");
            // import enemies data.json
            generateEnemyModal(enemyData["enemies"][imgVal]);
        }
    })
}

// enemy info modal
let generateEnemyModal = (enemy)=>{
    $("#tip").hide();
    
    let newDiv = document.createElement('div');
    let modalName = "enemyModal";
    newDiv.id = modalName;
    newDiv.classList.add("modal");
    newDiv.innerHTML =
        `<div class="inner styled">
            <div class="enemyName title">${enemy.name}</div>
            <div class="enemyImage">${enemy.typeShort == "number" ? '<img src="assets/images/numbers/'+enemy.nameShort+'.svg">':'<img src="assets/images/letters/'+enemy.typeShort+'/'+enemy.nameShort+'.svg">'}</div>
            <div class="enemyType"><span class="label">Type:</span> ${enemy.type}</div>
            <div class="enemyPoints"><span class="label">Points:</span> ${enemyData[enemy.typeShort].points.normal}</div>
            <div class="infoDescription">${/*enemy.description*/ bobRoss()}</div>
        </div>
        <div class="modalBG"></div>`
    document.querySelector("body").appendChild(newDiv);
    $(".modalBG").on("click",function(event){
        document.querySelector('body').removeChild(document.querySelector("#"+modalName));
        $(document).off();
    })
    $(document).on("keydown", function(event){
        console.log(event.which)
        if (event.which === 27) {
            document.querySelector('body').removeChild(document.querySelector("#"+modalName));
            $(document).off();
        }
    })
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