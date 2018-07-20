let deckRender = $("#deck");
let deckData = {};

// fetch("../categories/data2.json")
// .then((resp) => resp.json())
// .then( (res) => {
//     deckData = res;
//     console.log("new deckData here", deckData);
//     loadCategories();
// })

fetch("../categories/data.json")
.then((resp) => resp.json())
.then( (res) => {
    deckData = res;
    console.log("deckData here", deckData);
    loadCategories();
})

let loadCategories = (input) => {
    gameState.activeCategory = "characters";
    for (category in deckData) {
        console.log(`category is ${category}`,category == gameState.activeCategory);
        category == gameState.activeCategory ? 
            $("#categories").append(`<li class="active" value="${category}">${category.charAt(0).toUpperCase()+category.substr(1)}</li>`) :
            $("#categories").append(`<li value="${category}">${category.charAt(0).toUpperCase()+category.substr(1)}</li>`)
    }
    
    loadActiveCategory();
    categoryEventListeners();
    processCards(); // listen for click on cards in battle.js
    console.log("done loading categories")
}

let loadActiveCategory = ()=> {
    $("#cards").html('');
    for (card in deckData[gameState.activeCategory]) {
        $("#cards").append(`
            <div class="cardHolder">
                <button class="card" value="${deckData[gameState.activeCategory][card].nickname}" id="${card}" data-name="${card}">
                    <span class="name">${deckData[gameState.activeCategory][card].name}</span>
                    <span>${deckData[gameState.activeCategory][card].nickname}</span>
                    ${deckData[gameState.activeCategory][card].type == "auto" ? 
                            '<span class="cardClass" value="auto">⚡️</span>' :
                            '<span class="cardClass" value="manual">...</span>'}
                </button>
                <div class="info">?</div>
            </div>
        `)
    }
    infoButtonListener();
}

let categoryEventListeners = ()=>{
    $("#categories li").on("click", function(e){
        console.log("you clicked a list itemm",this.getAttribute("value"));
        // find value attr
        $("#categories li").removeClass("active");
        this.classList.add("active");
        gameState.activeCategory = this.getAttribute("value"); // set gameState.activeCategory to whatver category was clicked
        loadActiveCategory();
        processCards();
        // remove active class from li & set to new li
    })
}

let infoButtonListener = () => {
    $(".info").on("click",function(){
        console.log("you clickedon info");
        let cardName = $(this).prev().attr("data-name");
        console.log(cardName);
        let card = deckData[gameState.activeCategory][cardName];
        generateInfoModal(card);
    })
    $(".info").hover(function(){
        console.log("I see you hoverin...")
        $(this).prev().addClass("hover");
    }, function(){
        $(this).prev().removeClass("hover");
    })
}

let generateInfoModal = (card)=>{
    $("#tutorial").hide();
    let examples = '';
    for (i=0;i<card.examples.length;i++){
        examples += `<div><span class="patternExample">${card.examples[i].pattern}</span><span class="matchesWord">matches</span><span class="matchesResults">${card.examples[i].matches}</span></div>`
    }
    let newDiv = document.createElement('div');
    newDiv.id = "infoModal";
    newDiv.classList.add("modal");
    newDiv.innerHTML =
        `<div class="inner">
            <div class="infoName">${card.name} <span class="infoNickname">${card.nickname}</span></div>
            <div class="infoDescription">${card.description}</div>
            ${card.tips ? '<div class="infoTips">'+card.tips+'</div>' : ''}
            <div class="row infoExamples">
                <div>Examples:</div>
                <div>${examples}</div>
            </div>
        </div>
        <div class="modalBG"></div>`
    document.querySelector("body").appendChild(newDiv);
    $(".modalBG").on("click",()=>{
        document.querySelector('body').removeChild(document.querySelector("#infoModal"));
    })
}