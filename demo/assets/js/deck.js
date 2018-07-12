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
            <button class="card" value="${deckData[gameState.activeCategory][card].nickname}" id="${card}">
                <span class="name">${deckData[gameState.activeCategory][card].name}</span>
                <span>${deckData[gameState.activeCategory][card].nickname}</span>
                ${deckData[gameState.activeCategory][card].type == "auto" ? 
                        '<span class="cardClass" value="auto">⚡️</span>' :
                        '<span class="cardClass" value="manual">...</span>'}
            </button>
        `)
    }
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