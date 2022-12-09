// OUTLINE
// 1.  Webpage will have the following:
//     *  Dropdown that will allow selection of a name/id
//     *  Horizontal bar chart that shows data related to only the id
//     *  Bubble chart shows data related only to id
//     *  Summary section that only shows data related to id
// 2.  So every graphic needs the id and the only part that is independent is the dropdown
// 3.  The dropdown has many options so it needs created dynamically based on what is in the data file
// 4.  The page will load with a default selected id but needs to update based on the dropdown selection
//     *  This tells me that I need to run code once and then same code again with only an id change.
//     *  This sounds like a good time to use a function like  `createPlot(id)`
// 5.  Note:  The html already has several things built-in:
//     a.  you are given empty divs with ids called:
//         *  `selDataset` ==> used for the dropdown
//         *  `sample-metadata` ==> used for the summary data section
//         *  `bar` ==> used for the horizontal bar chrt
//         *  `gauge` ==> (optional) used for gauge chart
//         *  `bubble` ==> used for bubble chart
//     b.  There is an inline event handler in the html.  It looks like this:
//         `<select id="selDataset" onchange="optionChanged(this.value)"></select>`
//         This line of code is part of the dropdown, aka in html terms a `select`
//         If you look up the code for a select it is made up of options (dropdown entries)
//         and values associated with each option.  The value for the select is based on what option is selected.
//         i.e.  Dropdown has selected 'Subject 940' and maybe the value associated with this is `940`.
//               The '940' is captured by using 'this.value'... So 'this.value' captures the current selection value.
//               The 'optionChanged()' is a function that you need to make in your app.js that updates
//               some type of data filter that filters the data only related to '940' and then that 
//               data is used in all the charts.
//     c.  On Day 3 we will cover event handlers from the js file but we do not cover inline event handlers in the html.  
//         The only differene is where we call them but otherwise they work the same.
//     d.  You already have the data connected - notice the names list matches the id's used in the 
//         other data structures below.  Inspect the data - there are several sections - which one would 
//         be used for each chart?  Look at the images in the readme and matchup the data.  There is not
//         much that needs done except filtering and ordering of the existing data.

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
// d3.json(url).then(function(data) {
//   console.log(data);

// });
// SAMPLE STRUCTURE
// 1.  Check inspector console to see if each function is running on page load


// function that contains instructions at page load/refresh
// function does not run until called
function init(){
    d3.json(url).then(function(data) {
        console.log(data);
        let sampleNames = data.names;
        let selector = d3.select("#selDataset");
                
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
      });
    // code that runs once (only on page load or refresh)

    // this checks that our initial function runs.
    console.log("The Init() function ran")

    // create dropdown/select
  // Use D3 to select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  let dataset = dropdownMenu.property("value");

    // run functions to generate plots
    createScatter('940')
    createBar('940')
    createSummary('940')
    dataGauge('940')

}

// function that runs whenever the dropdown is changed
// this function is in the HTML and is called with an input called 'this.value'
// that comes from the select element (dropdown)
function optionChanged(newID){
    // code that updates graphics
    // one way is to recall each function
    createScatter(newID)
    createBar(newID)
    createSummary(newID)
    dataGauge(newID)

}

function createScatter(id){
    // code that makes scatter plot at id='bubble'
        //filter to match id (for each "dictionary",)
        let otu_ids = [];
        let sample_values = [];
        let otu_labels = [];
    
        d3.json(url).then(function(data) {
        for (let i = 0; i < data.samples.length; i++){
            if(id === data.samples[i].id){
                for(let j = 0; j < data.samples[i].sample_values.length; j++){
                    otu_ids.push(data.samples[i].otu_ids[j])
                    sample_values.push(data.samples[i].sample_values[j])
                    otu_labels.push(data.samples[i].otu_labels[j])
                }
            }
        }
        let trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values
            }
          };
          
          let scattertrace = [trace];
          
          let layout = {
            title: 'Sample Values over OTU IDs',
            showlegend: false,
            height: 600,
            width: 1000
          };
        Plotly.newPlot("bubble", scattertrace, layout);
        //console.log(otu_ids, sample_values)
    });
    // checking to see if function is running
    console.log(`This function generates scatter plot of ${id} `)
}
  
function createBar(id){
    // code that makes bar chart at id='bar'
    //limit to top 10 sample values within eventual for loop
    let otu_ids = [];
    let sample_values = [];
    let otu_labels = [];

    d3.json(url).then(function(data) {
    for (let i = 0; i < data.samples.length; i++){
        if(id === data.samples[i].id){
            for(let j = 0; j < data.samples[i].sample_values.length; j++){
                otu_ids.push(data.samples[i].otu_ids[j])
                sample_values.push(data.samples[i].sample_values[j])
                otu_labels.push(data.samples[i].otu_labels[j])
            }
        }
    }
    console.log(otu_ids)
    let top_ten = sample_values.slice(0,9).reverse();
    let top_ten_ids = otu_ids.slice(0,9).map(i=>`OTU ${i}`).reverse();
    let top_labels = otu_labels.slice(0,9).reverse();
    let bardata = [{
        type: 'bar',
        x: top_ten,
        y: top_ten_ids,
        text:top_labels,
        orientation: 'h',
        marker: {
            color: 'red',
            width: 1
          }
      }];
    Plotly.newPlot("bar",bardata);
});
    // checking to see if function is running
    console.log(`This function generates bar chart of ${id} `)

}

function createSummary(id){
    // code that makes list, paragraph, text/linebreaks at id='sample-meta'
    d3.json(url).then(function(data) {
        let demoList = "";
        let summaryTable = document.getElementById("sample-metadata")
        idType = Number(id)
        for(let i = 0; i < data.metadata.length; i++){
            let demoData = data.metadata[i]
            if(idType === demoData.id){
                for(let [key, value] of Object.entries(demoData)){
                    demoList += key + " : " + value + "<br>"
                }
            }
        };
        summaryTable.innerHTML = demoList;
    });
    // checking to see if function is running
    console.log(`This function generates summary info of ${id} `)
}
function dataGauge(id){
    
    d3.json(url).then(function(data) {
        idType = Number(id)
        for(let i = 0; i < data.metadata.length; i++){
            let washData = data.metadata[i].wfreq
        let gdata = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: washData,
                title: { text: "Weekly Washing Frequency" },
                type: "indicator",
                mode: "gauge+number",
                gauge: { axis: { range: [null, 9] }, bar: { color: "grey" }, steps: [
                    { range: [0, 3], color: "yellow" },
                    { range: [3, 6], color: "orange" },
                    { range: [6, 9], color: "red" }
                  ], }
            }
        ];
            
        let layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot("gauge", gdata, layout);
        //console.log(washData)
        //Couldn't get gauge data to change with each id, skipping for now, might come back.
    };    
    });
    console.log(`This function generates the gauge for ${id} `)
    };

// function called, runs init instructions
// runs only on load and refresh of browser page
init()





// STRATEGIES
// 1.  Inside-Out:  Generate each chart by assuming an ID/name then refactor the code to 
//                  work for any ID/name coming from the function.  I typically do this practice.
// 2.  Outside-In:  Generate the control (dropdown) and how the control interacts with the other parts.
//                  I gave you the basics of how it interacts above.  You could generate the dropdown
//                  and then see in the console the ID/names update as you make a change.  Then you could
//                  make your chart code.

// Overall, the above are the two steps you need to do (1.  Make plots with data, 2. make dropdown that passes id to functions)
// You could do it in either order.