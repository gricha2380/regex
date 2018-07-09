let deckRender = $("#deck");
let deckData = {};

fetch("../categories/data.json")
.then((resp) => resp.json()) 						// Transform the data into json
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
            $("#categories").append(`<li class="active">${category.charAt(0).toUpperCase()+category.substr(1)}</li>`) :
            $("#categories").append(`<li>${category.charAt(0).toUpperCase()+category.substr(1)}</li>`)
    }
    
    for (card in deckData[gameState.activeCategory]) {
        $("#cards").append(`
            <button class="card" value="${deckData[gameState.activeCategory][card].nickname}" id="${card}">
                <span class="name">${deckData[gameState.activeCategory][card].name}</span>
                <span>${deckData[gameState.activeCategory][card].nickname}</span>
                ${deckData[gameState.activeCategory][card].type == "auto" ? 
                        '<span class="cardClass" value="auto">⚡️</span>' :
                        '<span class="cardClass" value="manual">...</span>'}

            </button>
        `)
    }
    processCards() // listen for click on cards in battle.js
    console.log("done loading categories")
}