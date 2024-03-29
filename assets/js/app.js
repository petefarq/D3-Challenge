// Initialize SVG

var svgWidth = 960;
var svgHeight = 700;

var margin = {
  top: 20,
  right: 40,
  bottom: 120,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data
d3.csv("/D3-Challenge/assets/data/data.csv").then(function(data) {

    console.log(data);

  // Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.income = +data.income;
      data.age = +data.age;
      data.smokes = +data.smokes;
    });

    // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.poverty)-1, d3.max(data, d => d.poverty)+1])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.healthcare)+1])
      .range([height, 0]);

    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

     // Initialize tool tip
    //==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-5, 0])
      .html(function(d) {
        return (`<u>${d.state}</u><br>Poverty Rate: ${d.poverty}%<br>% Lack Healthcare: ${d.healthcare}%`);
      });

    // Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Create circle labels
        var circleLabels = chartGroup.selectAll(".label")
            .data(data)
            .enter()
            .append("text") 
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare)+5)
            .attr("class","label")
            .attr("fill","black")
            .text(d => d.abbr);

      // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "20")
        .attr("fill", "green")
        .attr("opacity", .3)
        .attr("stroke", "black")
        .attr("stroke-width","0")
        .on('mouseover', function(d) {
          d3.select(this).style('stroke-width','4');
          toolTip.show(d);
        })
        .on('mouseout', function(d) {
          d3.select(this).style('stroke-width','0');
          toolTip.hide(d);
        })

    // Create axes labels
        chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("% Lack Healthcare");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
      .attr("class", "aText")
      .text("% In Poverty");

    
  }).catch(function(error) {
    console.log(error);
  });



