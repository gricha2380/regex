let referenceCategories;

console.log("reference js loaded");

// listen for click on reference sidebar
let referenceSidebarListener = ()=> {
  $("#referenceSidebar li").on("click", function(){
    $("#referenceSidebar li").removeClass("active");
    $(this).addClass("active");

    // grab name of reference category
    let referenceCategory = $(this).text();
    // pass value into loadFunctionList()
    loadFunctionList(referenceCategory);
  });
}

// load functions for currently selected category
let loadFunctionList = (referenceCategory) => {
  let refCat = {};
  if (referenceCategory) {
    refCat = referenceCategory;
    console.log("referenceCategory provided", referenceCategory)
    console.log(referenceCategories[referenceCategory])
  } else {
    console.log("no referenceCategory given, showing first category instead")
    refCat = $("#referenceSidebar li:first-of-type").text();
    console.log(referenceCategories[refCat])
  }

  let referenceFunction = referenceCategories[refCat];
  console.log("referenceFunction items", referenceFunction);
  $("#referenceCategoryDescription").text(`Category Descriptions coming soon, using {referenceCategories[descriptions][refCat]}`);
  $("#referenceFunctionList").html(``);
  let referenceFunctions = '';
  for (e in referenceFunction) {
    let examplePatterns, exampleMatches;
    console.log("e in referenceFunction", e)
    if (referenceFunction[e].examples) {
      console.log("find the examples", referenceFunction[e])
      let examplesArray = [...referenceFunction[e].examples];
      console.log("here's examplesArray", examplesArray)
    }
    referenceFunctions += 
    `
    <li class="referenceFunction">
      <div class="referenceFunctionName">${e}<div class="referenceFunctionIcon">></div></div>
            <div class="referenceFunctionDescription">
              <div class="referenceFunctionDescriptionContainer">
                <div class="description">
                  ${referenceFunction[e].description ? referenceFunction[e].description : "no description..."}
                </div>
                
                <div class="examples"><div class="examplesTitle">Examples</div> ${referenceFunction[e].examples ? processExamples() : ''}</div>
                <div class="infoTips">tips</div>
                <div class="infoRelated">related</div>
              </div>
            </div>
    </li>
    `;
/* 
<div class="examples">
  <div class="pattern">Pattern: ${referenceFunction[e].examples[0] ? referenceFunction[e].examples[0].pattern : ''}</div>
  <div class="matches">Matches: ${referenceFunction[e].examples[0] ? referenceFunction[e].examples[0].matches : ''}</div>
</div> 
*/

//<div class="examples">Full examples object... ${referenceFunction[e].examples ? referenceFunction[e].examples.forEach(processExamples) : ''}</div>

    function processExamples(patterns, matches) {
      let htmlExmaples = '';
      console.log("does this see length?",referenceFunction[e].examples);
      referenceFunction[e].examples.forEach(function(example){
        examplePatterns = example.pattern;
        exampleMatches = example.matches;
        console.log("here is a pattern from loop",examplePatterns)
        console.log("here are matches from loop",exampleMatches)
        htmlExmaples += `<div class="examplesContent"><div class="examplePatterns">${examplePatterns}</div><div class="matchesLabel">matches</div><div class="exampleMatches">${exampleMatches}</div></div>`
      })
      // return patterns, matches;
      // return "hello"
      return htmlExmaples;
    }
  }


// console.log("contents of referenceFunctionList", referenceFunctions);
  $("#referenceFunctionList").append(referenceFunctions);
  referenceFunctionListener();
}

// listen for click on reference function name
let referenceFunctionListener = ()=> {
  $(".referenceFunction").on("click", function(){
    $(".referenceFunction").removeClass("active");
    $(".referenceFunctionIcon").removeClass("rotate");
    $(".referenceFunctionDescription").hide();
    // $(this).hasClass("active") ? $(this).removeClass("active") : $(this).addClass("active");
    $(this).addClass("active");
    // let functionDescription = $(this).find(".referenceFunctionDescription");
    // functionDescription.is(":visible") ? functionDescription.hide() : functionDescription.show();
    $(this).find(".referenceFunctionDescription").toggle();
    let rotate = $(this).find(".referenceFunctionIcon");
    rotate.hasClass("rotate") ? rotate.removeClass("rotate") : rotate.addClass("rotate");
  });
}
referenceFunctionListener();

// pull categories items from json 
let loadCategories = ()=>{
  fetch("../../../categories/data.json")
  .then((resp) => resp.json())
  .then( (res) => {
      referenceCategories = res;
  }).then( res => {
      populateCategories();
    }).then (res => {
      loadFunctionList();
  })
}
loadCategories();


// generate category content
let populateCategories = ()=> {
  console.log("These are the categories", referenceCategories);
  let referenceSidebarItems = '';

  for (category in referenceCategories) {
    console.log("this is category name", category);
    referenceSidebarItems += `<li>${category}</li>`;
  }

  $("#referenceSidebar").append(referenceSidebarItems);
  $("#referenceSidebar li:first-of-type").addClass("active");
  referenceSidebarListener();
}