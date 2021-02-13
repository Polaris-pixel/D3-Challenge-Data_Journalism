// @TODO: YOUR CODE HERE!
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // svg params
  var svgHeight = window.innerHeight;
  var svgWidth = window.innerWidth;
  

  var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr('class', "chart");

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
  // Initial Params
  var chosenXAxis = "poverty";

  // function used for updating x-scale var upon click on axis label
  function xScale(csvData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(csvData, d => d[chosenXAxis]) * 0.8,
      d3.max(csvData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);

    return xLinearScale;

  }

  // function used for updating xAxis var upon click on axis label
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return xAxis;
  }

  
  // Initial y Params
  var chosenYAxis = "healthcare";

  // function used for updating y-scale var upon click on axis label
  function yScale(csvData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(csvData, d => d[chosenYAxis]) * 0.8,
      d3.max(csvData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);

    return yLinearScale;

  }

  // function used for updating yAxis var upon click on axis label
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
      .duration(1000)
      .call(leftAxis);

    return yAxis;
  }

  // function used for updating circles group with a transition to
  // new circles
  function renderXCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
  }

   // function used for updating circles text group with a transition to
  // new circles
  function renderXText(circlesTextGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesTextGroup.transition()
      .duration(1000)
      .attr("dx", d => newXScale(d[chosenXAxis]))
      .attr("dy", d => newYScale(d[chosenYAxis]))
      .attr("text-anchor", "middle");
    return circlesTextGroup;
  }

    // function used for updating circles group with a transition to
  // new circles
  function renderYCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
  }

   // function used for updating circles text group with a transition to
  // new circles
  function renderYText(circlesTextGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesTextGroup.transition()
      .duration(1000)
      .attr("dx", d => newXScale(d[chosenXAxis]))
      .attr("dy", d => newYScale(d[chosenYAxis]))
      .attr("text-anchor", "middle");
    return circlesTextGroup;
  }



  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesTextGroup) {

    var xlabel;

    if (chosenXAxis === "poverty") {
      xlabel = "Poverty (%):";
    }
    else if (chosenXAxis === 'age') {
      xlabel = "Age (Median)";
    }
    else {
      xlabel = 'Household Income (Median)';
    }

    var ylabel;

    if (chosenYAxis === "healthcare") {
      ylabel = "Lacks Healthcare (%)";
    }
    else if (chosenYAxis === 'smokes') {
      ylabel = "Smokes (%)";
    }
    else {
      ylabel = 'Obese (%)';
    }


    //Initialize tool-tip
    var toolTip = d3.tip()
      .attr("class", "tooltip d3-tip")
      .offset([80, 60])
      .html(function (d) {
        return (`<strong>${d.state}</strong><br>${xlabel} ${d[chosenXAxis]}<br> ${ylabel} ${d[chosenYAxis]}`);
      });

    //Create circles tool-tip in chart
    circlesGroup.call(toolTip);
    
    //Create event listeners to display or hide circles tool-tip
    circlesGroup.on("mouseover", function (data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function (data, index) {
        toolTip.hide(data);
      });

    //Create text inside circles tool-tip in chart
    circlesTextGroup.call(toolTip);

    //Create event listeners to display or hide text tool-tip
      circlesTextGroup.on('mouseover', function(data, index){
        toolTip.show(data, this);
      })
      //onmouseout event
      .on("mouseout", function(data){
        toolTip.hide(data);
      });
    return circlesGroup;
  }

  // Retrieve data from the CSV file and execute everything below
  d3.csv('./assets/data/data.csv').then(function (csvData) {
    console.log(csvData);


      // parse data
    csvData.forEach(function (data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.obesity = +data.obesity;
      data.income = +data.income;
      data.smokes = +data.smokes;
    });

    // xLinearScale & yLinearScale function above csv import
    var xLinearScale = xScale(csvData, chosenXAxis);
    var yLinearScale= yScale(csvData, chosenYAxis);
    
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll(".stateCircle")
      .data(csvData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("class", "stateCircle")
      .attr("r", 15)
      .attr("opacity", ".5");

    // text inside circles
    var circlesTextGroup = chartGroup.selectAll(".stateText")
      .data(csvData)
      .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("dx", d => xLinearScale(d[chosenXAxis]))
      .attr("dy", d => yLinearScale(d[chosenYAxis]*.98))
      .attr("class", "stateText")

    // Create group for three x-axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height})`);

    var povertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    var incomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");


    // Create group for three y-axis labels
    var ylabelsGroup = chartGroup.append("g")
      // .attr("transform", `translate(-25 ,${height/ 2})`);

      //Append yAxis
    var healthcareLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left+40)
      .attr("x", 0 - (height / 2))
      .attr("value", "healthcare")
      .attr("dy", "1em")
      .text("Lacks Healthcare (%)")
      .classed("active", true);


    var smokersLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left+20)
      .attr("x", 0 - (height / 2))
      .attr("value", "smokes")
      .attr("dy", "1em")
      .text("Smokes (%)")
      .classed("inactive", true);


    var obesityLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("value", "obesity")
      .attr("dy", "1em")
      .text("Obese (%)")
      .classed("inactive", true)


    // updateToolTip function above csv import
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesTextGroup);

    // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function () {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(csvData, chosenXAxis);

          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);

          // updates circles with new  values
          circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          // updates circles text with new  values
          circlesTextGroup = renderXText(circlesTextGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesTextGroup);

          // changes classes to change bold text
          if (chosenXAxis === "age") {
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === 'income') {
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      
      });
  

        //y axis labels event listener
        ylabelsGroup.selectAll("text")
          .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

              // replaces chosenYAxis with value
              chosenYAxis = value;

              // functions here found above csv import
              // updates y scale for new data
              yLinearScale = yScale(csvData, chosenYAxis);

              // updates y axis with transition
              yAxis = renderYAxes(yLinearScale, yAxis);

              // updates circles with new y values
              circlesGroup = renderYCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

              // updates circles text with new y values
              circlesTextGroup = renderYText(circlesTextGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

              // updates tooltips with new info
              circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesTextGroup);

              // changes classes to change bold text
              if (chosenYAxis === "obesity") {
                obesityLabel
                  .classed("active", true)
                  .classed("inactive", false)
                smokersLabel
                  .classed("active", false)
                  .classed("inactive", true)
                healthcareLabel
                  .classed("active", false)
                  .classed("inactive", true)
                
              }
              else if (chosenYAxis === 'smokes') {
                smokersLabel
                  .classed("active", true)
                  .classed("inactive", false)
                healthcareLabel
                  .classed("active", false)
                  .classed("inactive", true)
                obesityLabel
                  .classed("active", false)
                  .classed("inactive", true)
              }
              else {
                healthcareLabel
                  .classed("active", true)
                  .classed("inactive", false)
                smokersLabel
                  .classed("active", false)
                  .classed("inactive", true)
                obesityLabel
                  .classed("active", false)
                  .classed("inactive", true)
                
              
              }
            }
          });  
          
  });
}


//this function is called when browser loads
makeResponsive();

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);