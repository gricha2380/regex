let gameState = {};
let gameModes = '';
let gameModesLocal = ["quiz"];

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
  
  

  // load reference modal
  $("#homepageReference").on("click touchstart", function(event){
    event.preventDefault();
    // create new reference modal
    // fetch ajax of reference.html
    // set inner html of new modal to contents of ajax
    fetchReferenceContent();
})

let fetchReferenceContent = (referenceContent)=> {
    $.get("assets/partials/reference.html",function(response){
        referenceContent = response;
        generateReferenceModal(referenceContent);
    });
}

let generateReferenceModal = (referenceContent)=> {
    $("#tip").hide();

    let newDiv = document.createElement('div');
    let modalName = "referenceModal";
    newDiv.id = modalName;
    newDiv.classList.add("modal");
    newDiv.innerHTML = 
        `<div class="inner styled">
            ${referenceContent}
        </div>
        <div class="modalBG"></div>`
    document.querySelector("body").appendChild(newDiv);

    referenceSidebarListener();
    referenceFunctionListener();
    loadReferenceCategories();
    //someting to disable timer
    // timerTriggerStop();

    $(".modalBG").on("click",function(event){
        document.querySelector('body').removeChild(document.querySelector("#"+modalName));
        $(document).off();
        //reenable timer
        // timerTrigger();
    })
    $(document).on("keydown", function(event){
        console.log(event.which)
        if (event.which === 27) {
            document.querySelector('body').removeChild(document.querySelector("#"+modalName));
            $(document).off();
            //reenable timer
            timerTrigger();
        }
    })
}
