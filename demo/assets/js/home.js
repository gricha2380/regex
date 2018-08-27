let gameState = {};
let gameModes = '';
let gameModesLocal = ["quiz","reference"];

let loadGameState = ()=>{
    fetch("../game/data.json")
    .then((resp) => resp.json())
    .then( (res) => {
        gameState = res;
    }).then( res => {
        loadGameModes();
    })
}
loadGameState();

let loadGameModes = ()=>{
    // for (mode in gameState.mode) {
    //     gameModes += `<div class="mode">${mode}</div>`;
    // }
    for (mode in gameModesLocal) {
        gameModes += `<div class="mode">${gameModesLocal[mode]}</div>`;
    }

    $("#gameModes").html(gameModes);
    $("#gameModes").append(`<div class="closeModes"></div>`)
}

$("#modes").on("click", (event)=>{
    $("#gameModes").toggleClass("showModes");
    console.log("prepping close function")
    clickClose();
})

let clickClose= ()=> {
    $("#gameModes .closeModes").on("click", ()=>{
        console.log("you clicked the icon")
        $("#gameModes").removeClass("showModes");
    })
}


// set game mode to data-mode of clicked link
$(".play").on("click", function(event){
    event.preventDefault();
    window.localStorage.setItem('gameMode', JSON.stringify($(this).attr("data-mode")));
    window.location = `battle.html`;
})

$(".reference").on("click", ()=>{
    // create modal called referenceModal
    // ajax contents to reference.html
  })
  
  