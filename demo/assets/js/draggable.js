// inititate Lean-Mean-Drag-and-Drop
let optionsObject = {
    containerClass: 'simple-grid',
    draggableItemClass: 'grid-item'
}
console.log("hi i'm a draggable")
lmdd.set(document.querySelector('#hand'),optionsObject);


$("#addToHand").on("click", ()=>{
    console.log("clicked draggable")
    generateCard()
})

let generateCard = ()=>{
    $("#hand .simple-grid")
        .append(`
            <div class="black z-depth-3 grid-item include" value="\\d">
                <div class="remove">remove</div>
                <div class="innerBlock auto">
                    <div class="name">Any Digit</div>
                    <div>\\d</div>
                    <div class="cardClass" value="auto">⚡️</div>
                </div>
            </div>`)
}


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

    // $('#hand').val(
    //     function() { 
    //         return $(this).val() ? $(this).val() + `+${cardValue}` : `${cardValue}`; 
    //     }
    // );
    matchEnemies();
})

$("#addQuantifiers").on("click", (event)=> {
    let cardGrid = '';
    console.log("adding quantifiers")
    addQuantifiers();
})

// $(".grid-item").on("drag", ()=>{
//     $('.quantifier').remove();
// })

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

let addQuantifiers = () => {
    $('.quantifier').remove();
    $(".simple-grid .grid-item").each(function (i, val){
        $(`<div class="quantifier include" value="+">+</div>`).insertAfter($(this));
    })
}
addQuantifiers()

$("#computeValues").on("click", ()=> {
    // grab value field from all div's in .simple-grid, including quantifiers
    // 
    computeValues();
    // compute Values and send to regex processor?
})


$(".quantifier").on("click", function (event){
    // allow value of quantifier to be toggled
    // have quantifiers start disabled at 0 value
    // off, one or more +, {x}, {x,}optional ?
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