function drawGraph(data) {
  // DIMENSIONS
  const width = 800;
  const height = 600;

  const margin = { top: 20, right: 20, bottom: 50, left: 50 };

  const plot_width = width - margin.left - margin.right;
  const plot_height = height - margin.left - margin.right;

  // TITLE
  document.getElementsByTagName("h2")[0].innerHTML = "Fisher's Iris Dataset";
  document.getElementsByTagName("h3")[0].innerHTML =
    "Petal Length vs Petal Width";

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
    .attr("transform", `translate(${margin.left}, ${margin.right})`);

  // SCALES
  let xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.petalLength)])
    .range([0, plot_width]);

  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.petalWidth)])
    .range([plot_height, 0]);

  let colorScale = d3
    .scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica"])
    .range(["crimson", "olive", "dodgerblue"]);

  let viz = plot
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.petalLength))
    .attr("cy", (d) => yScale(d.petalWidth))
    .attr("r", 5)
    .attr("opacity", 0.5)
    .style("fill", (d) => colorScale(d.species));

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

  // LABELS
  plot
    .append("g")
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", plot_width)
    .attr("y", plot_height + margin.bottom * 0.67)
    .text("Petal Length");

  plot
    .append("g")
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", 0)
    .attr("y", -(margin.left * 0.67))
    .attr("transform", "rotate(-90)")
    .text("Petal Width");

  function tooltipText(d) {
    return `${d.species.toUpperCase()}<br>
        Petal length: ${d.petalLength}<br>
        Petal width: ${d.petalWidth}<br>
        Sepal length: ${d.sepalLength}<br>
        Sepal width: ${d.sepalWidth}`;
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
  d3.csv("data/iris.csv")
    .then((data) => {
      drawGraph(data);
    })
    .catch((err) => {
      console.log("Something has gone wrong");
      console.log(err);
    });
}
