function drawGraph(data) {

  data.sort((a,b)=>{return b.Population - a.Population});

  // DIMENSIONS
  const width = 800;
  const height = 600;

  const margin = { top: 20, right: 20, bottom: 75, left: 100 };

  // TITLE
  document.getElementsByTagName("h2")[0].innerHTML = "EU Population by Country";
  document.getElementsByTagName("h3")[0].innerHTML = "";

  const plot_width = width - margin.left - margin.right;
  const plot_height = height - margin.top - margin.bottom;

  // CANVAS
  var canvas = d3
    .select("#canvas")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .style("background", "aliceblue");

  // PLOT
  var plot = canvas
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let countries = new Set(data.map(d=>d.Country));
  // SCALES
  let xScale = d3.scaleBand(countries, [0, plot_width]).padding(0.1)

  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.Population)])
    .range([plot_height, 0]);

    // BAR CHART
    let viz = plot
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d=>xScale(d.Country))
    .attr("y", d=>yScale(d.Population))
    .attr("height", d=>plot_height-yScale(d.Population))
    .attr("width", d=>xScale.bandwidth())
    .style("fill", "steelblue");

  // GRIDLINE FUNCTION

  let yGrid = (g) =>{
    g.attr("class", "grid-line")
    .selectAll("line")
    .data(yScale.ticks())
    .join("line")
    .attr("x1", 0)
    .attr("x2", plot_width)
    .attr("y1", d=>yScale(d))
    .attr("y2", d=>yScale(d))
    .style("stroke", "gray")
    .style("stroke-width", 0.1)
  }
    
  plot.append("g").call(yGrid);

  let xAx = d3.axisBottom(xScale);
  let yAx = d3.axisLeft(yScale);

  let xaxis = plot
    .append("g")
    .attr("transform", `translate(0, ${plot_height})`)
    .attr("class", "axes")
    .call(xAx);

    xaxis.selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .attr("text-anchor", "end")

  let yaxis = plot
    .append("g")
    .attr("transform", "translate(0, 0)")
    .attr("class", "axes")
    .call(yAx);

  // AXIS LABELS
  plot
    .append("g")
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", plot_width)
    .attr("y", plot_height + margin.bottom * 0.67)
    .text("Country");

  plot
    .append("g")
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", 0)
    .attr("y", -(margin.left * 0.67))
    .attr("transform", "rotate(-90)")
    .text("Population");

    let numberFormatter = d3.format(",")

  function tooltipText(d) {
    return `${d.Country} has a population of ${numberFormatter(d.Population)}`;
  }

  let tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  viz
    .on("mouseover", (e, d) => {
      tooltip.transition().duration(500).style("opacity", 0.9);
      tooltip
        .html(tooltipText(d))
        .style("left", e.pageX + "px")
        .style("top", e.pageY + "px");
    })
    .on("mouseout", (d) =>
      tooltip.transition().duration(500).style("opacity", 0),
    );
}

function draw() {
  d3.csv("data/eu_countries_by_population.csv")
    .then((data) => {
      data.forEach((d) => {
        d.Population = +d.Population;
      });
      drawGraph(data);
    })
    .catch((err) => {
      console.log("Something has gone wrong");
      console.log(err);
    });
}
