document.querySelector("#attack").addEventListener("click", e=>{
    battle();    
})

let battle = ()=> {
    // console.log(document.querySelector("#card").value)
    console.log("battling")
    let enemies = document.querySelector('#enemies').innerHTML;
    console.log("enemies value",enemies)
    let newArray = enemies.split("")
    console.log(newArray)
    // let playerPattern = /\d/g; // static value
    let playerPattern = new RegExp(document.querySelector("#card").value,"g");
    console.log("playre pattern",playerPattern,typeof playerPattern)
    // let results = playerPattern.test(enemies);
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
