let enemiesDefault;
let alert;

let random = ()=>{
    $("#enemies").text(Math.random().toString(36).slice(6));
    enemiesDefault = document.querySelector('#enemies').innerText;
    alert = document.querySelector("#alert");
}
random();

$("#random").on("click", function(e){
    random();
})

$(".card").on("click", function(e){
    let cardValue = $(this).attr("value");
    alert.innerText = "";

    $('#hand').val(
        function() { 
            return $(this).val() ? $(this).val() + `${cardValue}` : `${cardValue}`; 
        }
    );
})

$(".clear").on("click", function(e){
    alert.innerText = "";
    $("#hand").val("");
    document.querySelector('#enemies').innerText = enemiesDefault;
})

document.querySelector("#attack").addEventListener("click", e=>{
    battle();    
})

let battle = ()=> {
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
                if(matchSet[i]===enemyArray[x]){
                    enemyArray[x] = `<b>${element}</b>`;
                }
            }
            console.log("About to add enemyArray[x]",enemyArray[x])
        });
    })
    console.log("all of enemyArray",enemyArray);
    enemies = enemyArray.toString().replace(/,+/g,'');
    console.log("returning enemies", enemies)
    document.querySelector('#enemies').innerHTML = enemies;
}    
