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
    let enemyArray = enemies.split(""); // e.g.:["a", "b", "e", "1", "3", "3"]
    console.log("enemyArray content",enemyArray);
    let playerPattern = new RegExp($("#hand").val(),"g"); //let playerPattern = /\d/g; // static test
    console.log("playerpattern",playerPattern); //  e.g.:/\d/g
    let enemyMatch = enemies.match(playerPattern);
    if (!enemyMatch) {
        alert.innerText = "No matches...";
        return;
    }
    console.log("enemyMatch",enemyMatch); // e.g.:["1", "3", "3"]
    enemies = '';
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
            enemies += enemyArray[x];
        });
    })
    console.log("all of enemyArray",enemyArray);
    let stringy = enemyArray.toString().replace(/,+/g,'');
    console.log("stringy", stringy)
    document.querySelector('#enemies').innerHTML = stringy;
}    
