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



$("#computeValues").on("click", ()=> {
    // grab value field from all div's in .simple-grid, including quantifiers
    computeHand();
    // compute Values and send to regex processor?
})


let computeHand = () => { 
    timerTrigger();
    let values = '';

    if ($(".simple-grid .include")) {
        $(".simple-grid .include").each(function (i, val){
            let value = $(this).attr("value");
            console.log("grid item value", value)
            values += value;
        })   
        console.log("Values in player hand",values);
        return values;
    } else {
        return '';
    }
}