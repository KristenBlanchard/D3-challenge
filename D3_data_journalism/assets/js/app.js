var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper, append SVG group that will hold our chart
//and shift the latter by left and top margins
var svg = d3
    .select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(inputData) {

console.log(inputData)

    // Parse Data/Cast as numbers
    inputData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Create scales
    var xLinearScale = d3.scaleLinear()
        .domain([6, d3.max(inputData, data => data.poverty)])
        .range([0, width]);
        
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(inputData, data => data.healthcare)])
        .range([height, 0]);
    
    // Create Axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(inputData)
    .enter()
    .append("circle")
    .attr("cx", data => xLinearScale(data.poverty))
    .attr("cy", data => yLinearScale(data.healthcare))
    .attr("r", "12")
    .attr("fill", "pink")
    .attr("opacity", .5)

    //Initialize tooltip and create tooltip in chart
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
        return (abbr + '%');
        });

    chartGroup.call(toolTip);

    // Create event listener
    circlesGroup.on("click", function(data) {
        toolTip.show(data);
    })


    // Append axes labels and state  labelss
    chartGroup.append("text")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(inputData)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.poverty - .2);
            })
            .attr("y", function(data) {
                return yLinearScale(data.healthcare - .2);
            })
            .text(function(data) {
                return data.abbr
            });

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healtcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
});