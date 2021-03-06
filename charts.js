function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var bioArray = samples.filter(sampleObj => sampleObj.id == sample);

       //  5. Create a variable that holds the first sample in the array.
    var resultBio = bioArray[0];
    console.log(bioArray[0]);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = bioArray[0].otu_ids;
    var otuLabels = bioArray[0].otu_labels;
    var valSamples = bioArray[0].sample_values;

    
  
    console.log(otuIDs);
    console.log(otuLabels);
    console.log(valSamples);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var sortedotuIDs = otuIDs.sort((a,b) => a-b).reverse();
    console.log(sortedotuIDs);
    var toptenBioIds = sortedotuIDs.slice(0,10);
    console.log(toptenBioIds);
    var sortedvalSamples = valSamples.sort((c,d) => c-d).reverse();
    var toptenBioSVs = sortedvalSamples.slice(0,10);
    console.log(toptenBioSVs);
    //var sortedotuLabels = otuLabels.sort((e,f) => e-f).reverse();
    //var toptenBioLabels = sortedotuLabels.slice(0,10);
    //console.log(toptenBioLabels);

    var yticks = toptenBioIds.map(function (e){return 'OTU: '+e.toString()});
    console.log(yticks)
    var xticks = toptenBioSVs;

    // 8. Create the trace for the bar chart. 
    var barData = [
    {
      x: xticks,
      y: yticks,
      type: "bar",
      orientation:'h'
     
    }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top Ten Bacteria Culture Found",
      xaxis: { title: "Number of Bacteria"},
      yaxis: { title: "Belly Button Bacteria"},
      margin: {t:30, l:150}

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


// Bubbles chart
  
// 1. Create the trace for the bubble chart
var bubbleData = [
  {
    x: otuIDs,
    y: valSamples,
    text: otuLabels,
    mode: 'markers',
    marker: {
      color: otuIDs,
      size: valSamples,
      colorscale: "Rainbow"
    } 
  } 
  ];


  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    title: "Bacteria Cultures Per Sample",
    margin: {t:0},
    hovermode: otuLabels,
    xaxis: {title:"OTU ID"},
    margin: {t:25}
    
  };

 
    // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble",bubbleData,bubbleLayout); 


// Gauge chart

// 3. Create a variable that holds the washing frequency.
  var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample)
  var metadati = metadataArray[0];
  console.log(metadati);
  var wfreqDati = parseFloat(metadataArray[0].wfreq);
  console.log(wfreqDati);
  

 // 4. Create the trace for the gauge chart.
  var gaugeData = [
  {
    value: wfreqDati,
    title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week" },
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: { range: [null, 10] },
      bar: { color: "darkblue" },
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "yellowgreen" },
        { range: [8, 10], color: "green" }
        ]
      }
  }     
  ];

// 5. Create the layout for the gauge chart.
  var gaugeLayout = { 
    width: 500,
    height: 400,
    margin: { t: 0, b: 0 }
  };

// 6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot('gauge', gaugeData, gaugeLayout);

});
}

