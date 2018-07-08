let deckRender = $("#deck");
let deckData = {};
let gameState = {};


fetch("../../categories/data.json")
.then((resp) => resp.json()) 						// Transform the data into json
.then( (res) => {
    deckData = res;
    console.log("deckData here", deckData);
    gamePrep();
})


let gamePrep = ()=>{
    loadCategories();
}

let loadCategories = (input) => {
    gameState.activeCategory = "characters";
    for (category in deckData) {
        console.log(`category is ${category}`,category == gameState.activeCategory);
        category == gameState.activeCategory ? 
            $("#categories").append(`<li class="active">${category.charAt(0).toUpperCase()+category.substr(1)}</li>`) :
            $("#categories").append(`<li>${category.charAt(0).toUpperCase()+category.substr(1)}</li>`)
    }
    
    for (let i = 0; i < deckData[gameState.activeCategory].length; i++) {
        $("#cards").append(`
            <button class="card" value="${deckData[gameState.activeCategory][i].nickname}">
                ${deckData[gameState.activeCategory][i].name}
                <span>${deckData[gameState.activeCategory][i].nickname}</span>
                ${deckData[gameState.activeCategory][i].type == "auto" ? 
                        '<span class="cardClass" value="auto">⚡️</span>' :
                        '<span class="cardClass" value="manual">...</span>'}

            </button>
        `)

    }
    processCards()
    console.log("done loading categories")
}