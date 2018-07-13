//  pull top 20 values from local storage -->
// show score and dates -->
//  Have categories for game mode. only bother linking arcade for now -->

$(".nav div").on("click", (event)=>{
    console.log("this is the event", event.currentTarget.id);
    if (event.currentTarget.id === 'scores') {
        $("#scoresBody").show();
        $("#achievementsBody").hide();
    } else {
        $("#scoresBody").hide();
        $("#achievementsBody").show();
    }
})