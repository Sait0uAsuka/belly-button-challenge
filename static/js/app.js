// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filter_data = metadata.filter(sampleNumber => sampleNumber.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filter_data).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    })
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filter_data = samples.filter(sampleNumber => sampleNumber.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let ids = filter_data.otu_ids;
    let labels = filter_data.otu_labels;
    let values = filter_data.sample_values;

    // Build a Bubble Chart
    let chartData = {
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        size: values,
        color: ids,
      },
      type: 'bubble'
    };
    let bubbledata = [chartData];
    let layout = {
      title: "Bacteria Cultures Per Sample",
      margin: {
        l: 50,
        r: 50,
        b: 200,
        t: 50,
        pad: 4
      },
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' }
    };
    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbledata, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = ids.slice(0, 10).map(sampleID => "OUT " + sampleID).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barchartData = {
      x: values.slice(0, 10).reverse(),
      y: yticks,
      text: labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };
    
    let barData = [barchartData];

    let barLayout = {
      title:'Top 10 Bacteria Cultures Found',
      xaxis: {title: 'Number of Bacteria'}
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownButton = d3.select("#selDataset")

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdownButton.append("option").text(sample).property("value", sample);
    })

    // Get the first sample from the list
    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
