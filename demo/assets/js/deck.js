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
                <button class="${gameState.current.level.deck.locked.indexOf(card) >=0 ? 'card locked' : 'card'}" value="${deckData[gameState.activeCategory][card].nickname}" data-name="${card}" data-category="${gameState.activeCategory}">
                    <span class="name">${deckData[gameState.activeCategory][card].name}</span>
                    <span>${deckData[gameState.activeCategory][card].nickname}</span>
                    ${deckData[gameState.activeCategory][card].type == "auto" ? 
                            '<span class="cardClass" value="auto">⚡️</span>' :
                            '<span class="cardClass" value="manual">...</span>'}
                </button>
                <div class="infoIcon">?</div>
            </div>
        `)
    }
    // sort deck with locked cards at end
    console.log("now sorting cards...");
    
    let sortDeck = (a, b) => {
        return ($(b).find('button').attr('class')) < ($(a).find('button').attr('class')) ? 1 : -1;
    }
    $("#cards .cardHolder").sort(sortDeck).appendTo('#cards'); // append again to the list
    
    infoButtonListener();
}

let categoryEventListeners = ()=>{
    $("#categories li").on("click", function(e){
        // remove active class from li & set to new li
        $("#categories li").removeClass("active");
        this.classList.add("active");
        gameState.activeCategory = this.getAttribute("value"); // set gameState.activeCategory to whatver category was clicked
        loadActiveCategory();
        processCards();
    })
}

let infoButtonListener = (category) => {
    $(".infoIcon").on("click",function(){
        console.log("you clickedon info");
        let cardName = $(this).prev().attr("data-name");
        let cardCategory = $(this).prev().attr("data-category");
        let card = deckData[cardCategory][cardName];
        generateInfoModal(card);
    })

    $(".infoIcon").hover(function(){
        console.log("I see you hoverin...")
        $(this).prev().addClass("hover");
    }, function(){
        $(this).prev().removeClass("hover");
    })
}

// card info modal
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
        `<div class="inner styled">
            <div class="infoName title">${card.name} <span class="infoNickname">${card.nickname}</span></div>
            <div class="infoDescription">${card.description}</div>
            ${card.tips ? '<div class="infoTips">'+card.tips+'</div>' : ''}
            <div class="row infoExamples">
                <div>Examples:</div>
                <div>${examples}</div>
            </div>
        </div>
        <div class="modalBG"></div>`
    document.querySelector("body").appendChild(newDiv);
    $(".modalBG").on("click",function(event){
        document.querySelector('body').removeChild(document.querySelector("#infoModal"));
        $(document).off();
    })
    $(document).on("keydown", function(event){
        console.log(event.which)
        if (event.which === 27) {
            document.querySelector('body').removeChild(document.querySelector("#infoModal"));
            $(document).off();
        }
    })
}

// bind quantifier val to text input
let howManyEventListener = function () {
    $(".howMany").on("input", function(e){
        console.log(e.target.value)
        let currentValue = $(this).siblings(".quantifier").attr("value");
        if (/{\d+}/g.test(currentValue)) {
            $(this).siblings(".quantifier").attr("value", `{${e.target.value}}`).text(`{${e.target.value}}`);
            matchEnemies();
        } else if (/{\d+,}/g.test(currentValue)) {
            $(this).siblings(".quantifier").attr("value", `{${e.target.value},}`).text(`{${e.target.value},}`);
            matchEnemies();
        }
    })
}

let quantifierEventListeners = ()=> {
    // toggle quantifier value on click
    // values = disabled, one or more +, x times {x}, x times or more {x,}, optional optional ?
    $(".quantifier").on("click", function (event){
        howManyEventListener();
        $(".infoIcon").off();
        infoButtonListener();
        let currentValue = $(this).attr("value");
        if (currentValue === "disable") {
            // if disabled
            $(this).removeClass("disable");
            $(this).addClass("include");
            $(this).addClass("onePlus");
            $(this).text("+");
            $(this).attr("value","+");
            $(this).attr("data-name","One Or More");
            $(this).next(".infoIcon").show();
        } else if (currentValue == "+") {
            // if one or more
            $(this).removeClass("onePlus");
            $(this).addClass("xTimes");
            $(this).text("{1}");
            let quant = 1;
            $(this).siblings(".howMany").attr("value",quant).val(quant).show();
            $(this).attr("value",`{${quant}}`);
            $(this).attr("data-name","Exactly x Times");
        } else if (/{\d+}/g.test(currentValue)) { 
            // if x times
            $(this).removeClass("xTimes");
            $(this).addClass("xTimesRange");
            $(this).text("{1,}");
            let quant = 1;
            $(this).siblings(".howMany").attr("value",quant).val(quant).show();
            $(this).attr("value",`{${quant},}`);
            $(this).attr("data-name","x or More Times");
        } else if (/{\d+,}/g.test(currentValue)) {
            // if x times range
            $(this).siblings(".howMany").hide();
            $(this).removeClass("xTimesRange");
            $(this).addClass("optional");
            $(this).text("?");
            $(this).attr("value","?");
            $(this).attr("data-name","Optional");
        } else if (currentValue == "?") {
            // if optional
            $(this).removeClass("optional");
            $(this).removeClass("include");
            $(this).addClass("disable");
            $(this).html(".<br>.<br>.");
            $(this).attr("value","disable");
            $(this).attr("data-name","none");
            $(this).next(".infoIcon").hide();
        }
        console.log("current quantifier value", $(this).attr("value"));
        matchEnemies();
    })
}

let addQuantifiers = () => {
    $('.quantifierHolder').remove();
    $(".simple-grid .grid-item").each(function (i, val){
        let quant=1;
        $(`<div class="quantifierHolder"><input type='number' class='howMany' value='${quant}' min='0' max='100'><div class="quantifier disable" value="disable" data-category="quantifiers">.<br>.<br>.</div><div class="infoIcon">?</div></div>`).insertAfter($(this));
    })
    quantifierEventListeners();
}
addQuantifiers();