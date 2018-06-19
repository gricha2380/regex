$(".card").on("click", function(e){
    let cardValue = $(this).attr("value");
    // console.log("hi",$(this).attr("value"));
    // $("#hand").attr("value", ($(this).attr("value")))

    $('#hand').val(
        function() { 
            return $(this).val() ? $(this).val() + `${cardValue}` : cardValue; 
        }
    );
})

$(".clear").on("click", function(e){
    $("#hand").val("");
})

document.querySelector("#attack").addEventListener("click", e=>{
    battle();    
})
//current problem: when full string is returned inside enemyMatch it's all stored in index 0.
// possible solution: conditional for if enemyMatach.length = 0;
let battle = ()=> {
    let enemies = document.querySelector('#enemies').innerText;
    console.log("enemies value",enemies);
    let enemyArray = enemies.split(""); // ["a", "b", "e", "1", "3", "3"]
    console.log("enemyArray content",enemyArray);
    // let playerPattern = /\d/g; // static value
    let playerPattern = new RegExp(document.querySelector("#hand").value,"g");
    console.log("playerpattern",playerPattern); //  /\d/g
    let enemyMatch = enemies.match(playerPattern);
    console.log("enemyMatch",enemyMatch); //  ["1", "3", "3"]
    enemies = '';
    if (enemyMatch.length === 1) {
        enemyArray.forEach((element,x) => {
            console.log("element char", element)
            
            for(let i = 0;i<enemyArray.length;i++){
                console.log("itterator",i)
                if (enemyMatch[i]) console.log(enemyMatch[i]) 
                // console.log("enemyMatch char", enemyMatch[i])
                if (enemyMatch[0][i] == enemyArray[element]) {
                    console.log(`match ${element}`);
                    enemyArray[x] = `<b>${element}</b>`;
                }
            }
            enemies += enemyArray[x];
        });

    }
    else {
        enemyArray.forEach((element,x) => {
            console.log("element char", element)
            
            for(let i = 0;i<enemyArray.length;i++){
                console.log("itterator",i)
                if (enemyMatch[i]) console.log(enemyMatch[i]) 
                // console.log("enemyMatch char", enemyMatch[i])
                if (enemyMatch[i] && enemyArray[element]==enemyMatch[i]) {
                    console.log(`match ${element}`);
                    enemyArray[x] = `<b>${element}</b>`;
                }
            }
            enemies += enemyArray[x];
        });
    }
    console.log("all of it",enemyArray);
    document.querySelector('#enemies').innerHTML = enemies;
}    
