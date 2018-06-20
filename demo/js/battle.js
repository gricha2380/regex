const enemiesDefault = document.querySelector('#enemies').innerText;
const alert = document.querySelector("#alert");

$(".card").on("click", function(e){
    let cardValue = $(this).attr("value");
    alert.innerText = "";
    // $("#hand").attr("value", ($(this).attr("value")))

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
    let enemies = document.querySelector('#enemies').innerText;
    console.log("enemies value",enemies);
    let enemyArray = enemies.split(""); // ["a", "b", "e", "1", "3", "3"]
    console.log("enemyArray content",enemyArray);
    // let playerPattern = /\d/g; // static value
    let playerPattern = new RegExp(document.querySelector("#hand").value,"g");
    console.log("playerpattern",playerPattern); //  /\d/g
    let enemyMatch = enemies.match(playerPattern);
    if (!enemyMatch) {
        alert.innerText = "No matches...";
        return;
    }
    console.log("enemyMatch",enemyMatch); //  ["1", "3", "3"]
    enemies = '';
    if (enemyMatch.length === 1) {
        console.log("enemyMatch length",enemyMatch[0].length)

        enemyArray.forEach((element,x) => {
            for(let i=0;i<enemyMatch[0].length;i++) {
                if(enemyMatch[0][i]===enemyArray[x]){
                    enemyArray[x] = `<b>${element}</b>`;
                }
            }
        enemies += enemyArray[x];
        });
    }
    else {
       console.log("enemy match longer than 1")
    }
    console.log("all of it",enemyArray);
    document.querySelector('#enemies').innerHTML = enemies;
}    
