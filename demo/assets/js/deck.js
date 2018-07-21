let deckRender = $("#deck");
let deckData = {};

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

let quantifierEventListeners = ()=> {
    $(".quantifier").on("click", function (event){
        // allow value of quantifier to be toggled
        // have quantifiers start disabled at 0 value
        // off, one or more +, {x}, {x,}optional ?
        let currentValue = $(this).attr("value");
        if (currentValue === "q") {
            // if disabled
            $(this).removeClass("disable");
            $(this).addClass("include");
            $(this).addClass("onePlus");
            $(this).text("+");
            $(this).attr("value","+");
        } else if (currentValue == "+") {
            // if one or more
            $(this).removeClass("onePlus");
            $(this).addClass("xTimes");
            // $(this).html("<input type='number' class='howMany' value='1'>{x}");
            $(this).text("{1}");
            let quant = 1;
            // $(this)[0].outerHTML = `<div class="quantifierHolder"><input type='number' class='howMany' value='${quant}'><div class="quantifier include xTimesRange" value="{x,}">{x}</div></div>`
            // TODO: Set value based on howMany field content
            // TODO: Allow user to click on input without toggling
            $(this).attr("value",`{${quant}}`);
        } else if (/{\d+}/g.test(currentValue)) { // TODO: check for current value of howMany field
            // if x times
            $(this).removeClass("xTimes");
            $(this).addClass("xTimesRange");
            // $(this).html("<input type='number' class='howMany' value='1'>{x,}");
            $(this).text("{1,}");
            let quant = 1;
            $(this).attr("value",`{${quant},}`);
        } else if (/{\d+,}/g.test(currentValue)) {
            // if x times range
            $(this).removeClass("xTimesRange");
            $(this).addClass("optional");
            $(this).text("?");
            $(this).attr("value","?");
        } else if (currentValue == "?") {
            // if optional
            $(this).removeClass("optional");
            $(this).removeClass("include");
            $(this).addClass("disable");
            $(this).html(".<br>.<br>.");
            $(this).attr("value","q");
        }
        console.log("current quantifier value", $(this).attr("value"));
        matchEnemies();
    })
}

let addQuantifiers = () => {
    $('.quantifier').remove();
    $(".simple-grid .grid-item").each(function (i, val){
        $(`<div class="quantifier disable" value="q">.<br>.<br>.</div>`).insertAfter($(this));
    })
    quantifierEventListeners();
}
addQuantifiers();