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
  console.log("this is referenceCategories[descriptions]",referenceCategories["Descriptions"]) //good
  console.log("referencecat",refCat)
  console.log("this is referenceCategories[refCat] complete",referenceCategories["Descriptions"][refCat])
  // $("#referenceCategoryDescription").text(`${refCat} Category Descriptions coming soon, using {referenceCategories[descriptions][refCat]}`);
  $("#referenceCategoryDescription").text(referenceCategories["Descriptions"][refCat]);
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
      <div class="referenceFunctionName">${e}<div class="referenceFunctionIcon"><img src="assets/images/ui/categoryArrow.svg"></div></div>
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
    let functionDescription = $(this).find(".referenceFunctionDescription");
    let descriptionOpen = functionDescription.is(":visible");
    $(".referenceFunction").removeClass("active");
    $(".referenceFunctionIcon").removeClass("rotate");
    $(".referenceFunctionDescription").hide(); // works but remains open
    if (descriptionOpen) {
      $(this).removeClass("active");
      functionDescription.hide();
      $(this).find(".referenceFunctionIcon").removeClass("rotate");
    }
    else {
      $(this).addClass("active");
      functionDescription.show();
      $(this).find(".referenceFunctionIcon").addClass("rotate");
    }
  });
}
// referenceFunctionListener();

// pull categories items from json 
let loadReferenceCategories = ()=>{

  // let loadStandardCategories = () => {
    fetch("../categories/data.json")
    .then( (res) => res.json())
    .then( (res) => {
      referenceCategories = res;
    }).then( res => {
      populateCategories();
    }).then (res => {
      loadFunctionList();
    })
  // }
  
}
// loadReferenceCategories();


// generate category content
let populateCategories = ()=> {
  console.log("These are the categories", referenceCategories);
  let referenceSidebarItems = '';

  for (category in referenceCategories) {
    if (category !== "Descriptions") {
      console.log("this is category name", category);
      referenceSidebarItems += `<li>${category}</li>`;
    }
  }

  $("#referenceSidebar").append(referenceSidebarItems);
  $("#referenceSidebar li:first-of-type").addClass("active");
  referenceSidebarListener();
}