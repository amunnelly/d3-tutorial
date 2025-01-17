function drawGraph(data) {
  // DIMENSIONS
  const width = 800;
  const height = 600;

  const margin = { top: 20, right: 20, bottom: 50, left: 50 };

  // TITLE
  document.getElementsByTagName("h2")[0].innerHTML = "Fisher's Iris Dataset";
  document.getElementsByTagName("h3")[0].innerHTML =
    "Petal Length vs Petal Width";

  const plot_width = width - margin.left - margin.right;
  const plot_height = height - margin.top - margin.bottom;

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
