let gameState = {};
let gameModes = '';

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
    for (mode in gameState.mode) {
        gameModes += `<div class="mode">${mode}</div>`;
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
// clickClose();