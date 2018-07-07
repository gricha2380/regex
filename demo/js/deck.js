let deck = $("#deck");
let data = {};
let gameState = {};


fetch("../../categories/data.json")
.then((resp) => resp.json()) 						// Transform the data into json
.then( (res) => {
    data = res;
    console.log("data here", data);
    gamePrep();
})


let gamePrep = ()=>{
    loadCategories();
}

let loadCategories = (input) => {
    for (categories in data) {
        $("#categories").append(`<li>${categories.charAt(0).toUpperCase()+categories.substr(1)}</li>`)
    }
    
    data.activeCategory = "characters";
}