// inititate Lean-Mean-Drag-and-Drop
let optionsObject = {
    containerClass: 'simple-grid',
    draggableItemClass: 'grid-item'
}
console.log("hi i'm a draggable")
lmdd.set(document.querySelector('#hand'),optionsObject);


$("#addToHand").on("click", ()=>{
    console.log("clicked draggable")
    generateCard("Any Digit","\\d","auto")
})

$(".cardNew").on("click", function(e){
    let cardName = $(this)[0].id; // jquery stores $(this) as an array
    if ($(this).find(".cardClass").attr("value")=="manual") {
        // manual cards require user input
        cardValue = prompt(`Type your input. Example:${deckData[gameState.activeCategory][cardName].examples[0].pattern}`);
        console.log("cardValue",cardValue)
        if (!cardValue) return; // if user cancels
    } else {
        cardValue = $(this).attr("value"); // for auto card type
        gameState.current.counter.patterns +=1; // Fture note: If cards are removed from hand, subtract from pattern counter
    }
    alert.innerText = "";

    matchEnemies();
})

$("#addQuantifiers").on("click", (event)=> {
    console.log("adding quantifiers")
    addQuantifiers();
})

$("#hand").on("lmddstart", ()=>{
    console.log("custom event found")
    $('.quantifier').remove();
})

$("#hand").on("lmddend", ()=>{
    console.log("custom event found")
    $(".remove").css("opacity","1");
    addQuantifiers();
    matchEnemies();
})

$("#hand").on("lmddbeforestart", ()=>{
    console.log("hiding remove!")
    $(".remove").css("opacity","0");
})

let quantifierEventListeners = ()=> {
    $(".quantifier").on("click", function (event){
        // allow value of quantifier to be toggled
        // have quantifiers start disabled at 0 value
        // off, one or more +, {x}, {x,}optional ?
        let currentValue = $(this).attr("value");
        if (currentValue == 0) {
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
            $(this).text("{x}");
            $(this).attr("value","{x}");
        } else if (currentValue == "{x}") {
            // if x times
            $(this).removeClass("xTimes");
            $(this).addClass("xTimesRange");
            $(this).text("{x,}");
            $(this).attr("value","{x,}");
        } else if (currentValue == "{x,}") {
            // if x times range
            $(this).removeClass("xTimesRange");
            $(this).addClass("optional");
            $(this).text("?");
            $(this).attr("value","?");
        } else if (currentValue == "?") {
            // if x times range
            $(this).removeClass("optional");
            $(this).removeClass("include");
            $(this).addClass("disable");
            $(this).text("+");
            $(this).attr("value","0");
        }
        console.log("current quantifier value", $(this).attr("value"));
        // matchEnemies();
    })
}

let addQuantifiers = () => {
    $('.quantifier').remove();
    $(".simple-grid .grid-item").each(function (i, val){
        $(`<div class="quantifier disable" value="0">.<br>.<br>.</div>`).insertAfter($(this));
    })
    quantifierEventListeners();
}
addQuantifiers()

$("#computeValues").on("click", ()=> {
    // grab value field from all div's in .simple-grid, including quantifiers
    // 
    computeValues();
    // compute Values and send to regex processor?
})


let computeValues = () => {
    let values = '';
    $(".simple-grid .include").each(function (i, val){
        let value = $(this).attr("value");
        console.log("grid item value", value)
        values += value;
    })   
    console.log("all values",values)
    return values;
}

// $(".remove").on("click", function() {
//     console.log("this is my parent", $(this).parent())
//     $(this).parent().remove();
//     addQuantifiers();
// })