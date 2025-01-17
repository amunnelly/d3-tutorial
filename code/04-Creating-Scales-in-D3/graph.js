function drawGraph(data) {
  // DIMENSIONS
  const width = 800;
  const height = 600;

  const margin = { top: 20, right: 20, bottom: 50, left: 50 };

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
