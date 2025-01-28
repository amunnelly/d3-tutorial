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

  // CLIP PATH
  canvas.append("defs")
  .append("clipPath").attr("id", "plot")
  .append("rect")
  .attr("width", plot_width)
  .attr("height", plot_height);

  // VIEW
  const view = plot.append("g")
  .attr("class", "view")
  .attr("clip-path", "url(#plot)")
  .append("g");


  // SCALES
  let xScale = d3
    .scaleLinear()
    .range([0, plot_width]);

  let yScale = d3
    .scaleLinear()
    .range([plot_height, 0]);

  let colorScale = d3
    .scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica"])
    .range(["crimson", "olive", "dodgerblue"]);

  xScale.domain([0, d3.max(data, (d) => d.petalLength)]);
  yScale.domain([0, d3.max(data, (d) => d.petalWidth)]);

    const domain = {};
  domain.x = xScale.domain()
  domain.y = yScale.domain();

  let xAx = d3.axisBottom(xScale);
  let yAx = d3.axisLeft(yScale);

  let xAxisHolder = plot
    .append("g")
    .attr("transform", `translate(0, ${plot_height})`)
    .attr("class", "axes");

  let yAxisHolder = plot
    .append("g")
    .attr("transform", "translate(0, 0)")
    .attr("class", "axes");

    xAxisHolder.call(xAx);
    yAxisHolder.call(yAx);

  // AXIS GRID

  const xGridHolder = plot.append("g")
  const yGridHolder = plot.append("g")

  const xGrid = (g)=>{
    g.attr("class", "grid-line")
    .selectAll("line")
    .data(xScale.ticks())
    .join("line")
    .attr("x1", d=>xScale(d))
    .attr("x2", d=>xScale(d))
    .attr("y1", 0)
    .attr("y2", plot_height);
  }

  const yGrid = (g)=>{
    g.attr("class", "grid-line")
    .selectAll("line")
    .data(yScale.ticks())
    .join("line")
    .attr("x1", 0)
    .attr("x2", plot_width)
    .attr("y1", d=>yScale(d))
    .attr("y2", d=>yScale(d));
  }

  xGridHolder.call(xGrid);
  yGridHolder.call(yGrid);

  const brush = d3.brush().on("end", detail);

  function detail(e){
    console.log("I am detail");
    if (e.selection) {
      console.log(e.selection);
      const [[minX, minY], [maxX, maxY]] = e.selection;

      const newDomainX = [xScale.invert(minX), xScale.invert(maxX)];
      const newDomainY = [yScale.invert(minY), yScale.invert(maxY)];

      xScale.domain(newDomainX);
      yScale.domain(newDomainY);

      updateView();

      view.call(brush.move, null);
      d3.select("#zoom-reset").style("opacity", 1);
    } // end if
  } //end detail 

  function updateView(){
    console.log("I am update view");

    xAxisHolder.call(xAx);
    yAxisHolder.call(yAx);

    xGridHolder.call(xGrid);
    yGridHolder.call(yGrid);

    view.selectAll("circle")
    .attr("cx", d=>xScale(d.petalLength))
    .attr("cy", d=>yScale(d.petalWidth));
  }

  d3.select("#zoom-reset").on("click", function(){
    this.style.opacity = 0;

    xScale.domain(domain.x);
    yScale.domain(domain.y);

    updateView();
  })

  function scatter(){
    view.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.petalLength))
    .attr("cy", (d) => yScale(d.petalWidth))
    .attr("r", 5)
    .attr("opacity", 0.5)
    .style("fill", (d) => colorScale(d.species))
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

  view.call(brush);
  scatter();
    
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