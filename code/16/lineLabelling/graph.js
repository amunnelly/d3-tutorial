function drawGraph(data) {
  let byYear = d3.group(data, (d) => d.year);

  // DIMENSIONS
  const width = 800;
  const height = 600;

  const margin = { top: 30, right: 50, bottom: 50, left: 50 };

  // TITLE
  document.getElementsByTagName("h2")[0].innerHTML = "Seattle Weather";
  document.getElementsByTagName("h3")[0].innerHTML =
    "Precipitation by Year, 2012-2015";

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

  // SCALES
  let xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.dayOfYear)])
    .range([0, plot_width]);

  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.cumulativePrecipitationByYear)])
    .range([plot_height, 0]);

  let years = new Set(data.map((d) => d.year));

  let colorScale = d3.scaleOrdinal().domain(years).range(d3.schemeTableau10);

  //  THE LINE MAKING FUNCTION
  let makeLine = d3
    .line()
    .x((d) => xScale(d.dayOfYear))
    .y((d) => yScale(d.cumulativePrecipitationByYear));

  // THE LINES THEMSELVES
  byYear.forEach((value, key) => {
    plot
      .append("path")
      .attr("d", makeLine(value))
      .attr("class", "dataline")
      .style("stroke", colorScale(key))
      .style("fill", "none");
  });

  let xAx = d3.axisBottom(xScale);
  let yAx = d3.axisLeft(yScale);

  let xaxis = plot
    .append("g")
    .attr("transform", `translate(0, ${plot_height})`)
    .attr("class", "axes")
    .call(xAx);

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
    .text("Day of Year");

  plot
    .append("g")
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", 0)
    .attr("y", -(margin.left * 0.67))
    .attr("transform", "rotate(-90)")
    .text("Precipitation");

  let viz = plot
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.dayOfYear))
    .attr("cy", (d) => yScale(d.cumulativePrecipitationByYear))
    .attr("r", 5)
    .attr("opacity", 0);

  // LINE LEGEND LABELS

  // a legend object
  const legendDetails = [];
  byYear.forEach((value, key) => {
    let year = key;
    let yPos = yScale(d3.max(value, d => d.cumulativePrecipitationByYear));
    let color = colorScale(key);
    legendDetails.push(
      {
        label: year,
        x: xScale(d3.max(value, d => d.dayOfYear)),
        y: yPos,
        color: color
      }
    )
  })

  // a force object
  const simulation = d3.forceSimulation(legendDetails)
    .force("x", d3.forceX(d => d.x).strength(0.5))
    .force("collide", d3.forceCollide(10))
    .stop();

  for (let i = 0; i < 250; i++) {
    simulation.tick();
  }

  // the legends themselves
  plot.append("g")
    .selectAll("text")
    .data(legendDetails)
    .join("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .style("fill", d => d.color)
    .text(d => d.label);

  // FORMATTERS

  let dateFormatter = d3.timeFormat("%b %d, %Y");
  let numberFormatter = d3.format(",.1f");

  function tooltipText(d) {
    return `${dateFormatter(d.date)}<br>
        Total Precipitation: ${numberFormatter(d.cumulativePrecipitationByYear)}<br>
        Daily Precipitation: ${numberFormatter(d.precipitation)}<br>
        Weather: ${d.weather}`;
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
  d3.csv("data/seattle_weather.csv")
    .then((data) => {
      data.forEach((d) => {
        d.date = new Date(d.date);
        d.cumulativePrecipitationByYear = +d.cumulativePrecipitationByYear;
        d.dayOfYear = +d.dayOfYear;
      });
      drawGraph(data);
    })
    .catch((err) => {
      console.log("Something has gone wrong");
      console.log(err);
    });
}
