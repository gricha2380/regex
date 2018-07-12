let enemiesDefault = document.querySelector('#enemies').innerText; //holds original enemy array to allow resetting
let alert = document.querySelector("#alert"); // notification field

$("#random").on("click", function(event){
    event.preventDefault();
    random();
})

// method for displying alerts
let alertMessage=(message)=> {
    alert.innerText = message;
    clearAlert();
}

// load value for selected card
let processCards = (cardValue) => {
    $(".card").on("click", function(e){
        let cardName = $(this)[0].id; // jquery stores $(this) as an array
        if ($(this).find("span.cardClass").attr("value")=="manual") {
            // manual cards require user input
            cardValue = prompt(`Type your input. Example:${deckData[gameState.activeCategory][cardName].examples[0].pattern}`);
            console.log("cardValue",cardValue)
            if (!cardValue) return; // if user cancels
        } else {
            cardValue = $(this).attr("value"); // for auto card type
        }
        alert.innerText = "";
    
        $('#hand').val(
            function() { 
                return $(this).val() ? $(this).val() + `+${cardValue}` : `${cardValue}`; 
            }
        );
        matchEnemies();
    })
}

$(".clear").on("click", function(e){
    alert.innerText = "";
    $("#hand").val("");
    document.querySelector('#enemies').innerText = enemiesDefault;
})

document.querySelector("#attack").addEventListener("click", e=>{
    increaseScore(gameState.holdPoints);
    endTurn(); 
    
})

let matchEnemies = ()=> {
    gameState.holdPoints = 0;
    let enemies = document.querySelector("#enemies").innerText;
    console.log("enemies value",enemies);
    let enemyArray = document.querySelector("#enemies").innerText.split(""); // e.g.:["a", "b", "e", "1", "3", "3"]
    console.log("enemyArray content",enemyArray);
    let playerPattern = new RegExp($("#hand").val(),"g"); //let playerPattern = /\d/g; // static test
    console.log("playerpattern",playerPattern); //  e.g.:/\d/g
    let enemyMatch = enemies.match(playerPattern);
    if (!enemyMatch) {
        alert.innerText = "No matches...";
        return;
    }
    console.log("enemyMatch",enemyMatch); // e.g.:["1", "3", "3"]
    enemyMatch.forEach(matchSet=>{
        console.log("matchSet contents",matchSet,matchSet.length);
        console.log("enemy array before action",enemyArray,enemyArray.length)
        enemyArray.forEach((element,x) => {
            for(let i=0;i<matchSet.length;i++) {
                if(matchSet[i]===enemyArray[x] && enemyArray[x]!==" "){
                    // go into game object, find score value for enemry type, call increaseScore(passvalue)
                    console.log(`element type is"${element}".`)
                    console.log("element at index",enemyData.enemies[element])
                    let enemyType = enemyData.enemies[element].type;
                    enemyType = enemyType.toLowerCase();
                    gameState.holdPoints += enemyData[enemyType].points.normal;
                    console.log("points added",enemyData[enemyType].points.normal)
                    enemyArray[x] = `<b>${element}</b>`;
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
    // alertMessage("Your Turn!");
}

let clearEnemies = (totalEnemyMatch)=> {
    
    $("#hand").val(""); // clear hand
    totalEnemyMatch = document.querySelector("#enemies").innerHTML; // use ("#enemies").innerText for plain characters
    let matched = new RegExp("<b>(.*?)<\/b>","g");
    // console.log("match formula", matched)
    let remainingEnemies = totalEnemyMatch.replace(matched, ""); //remove matched enemies
    console.log('regex results', remainingEnemies,remainingEnemies.length);
    document.querySelector('#enemies').innerText = remainingEnemies;// set dom to regex results
    enemiesDefault = document.querySelector('#enemies').innerText;
    if (remainingEnemies=='' || remainingEnemies==' ') {
        console.log("no enemies left")
        document.querySelector("#enemies").innerText = "All Clear!";
        setTimeout(function() {
            document.querySelector("#enemies").innerText = "";
            beatLevel();
          }, 1000);
    }
    else {enemyAttack()}
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
            alertMessage("Your Turn!");
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
    gameState.damage += damage;
    document.querySelector("#health .value").innerText = gameState.health - gameState.damage;
    document.querySelector("#health .healthBar").setAttribute("style", `width:${gameState.health - gameState.damage}%`);

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
      }, 3000);
}

$("#endGame").on("click", function(event){
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

// what should go to local storage? score, date, time spent, enemies matched, cards played