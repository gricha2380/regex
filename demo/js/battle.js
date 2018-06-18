$(".card").on("click", function(e){
    // console.log("hi",e)
    console.log("hi",$(this).attr("value"));
    $("#hand").attr("value", ($(this).attr("value")))
    
    // function(content) {
    //     console.log("this is content", content)
    //     return content += $(this).attr("value");
    // }) 
})

document.querySelector("#attack").addEventListener("click", e=>{
    battle();    
})

let battle = ()=> {
    let enemies = document.querySelector('#enemies').innerText;
    console.log("enemies value",enemies)
    let newArray = enemies.split("")
    console.log(newArray)
    // let playerPattern = /\d/g; // static value
    let playerPattern = new RegExp(document.querySelector("#hand").value,"g");
    let results = enemies.match(playerPattern)
    console.log("results",results);
    enemies = '';
    newArray.forEach((element,x) => {
        for(let i = 0;i<newArray.length;i++){
            if (element==results[i]) {
                console.log(`match ${element}`)
                newArray[x] = `<b>${element}</b>`
            }
        }
        enemies += newArray[x];
    });
    console.log("all of it",newArray)
    document.querySelector('#enemies').innerHTML = enemies;
}    
