function drawGraph(data) {

  // HEADLINES
  document.getElementsByTagName("h2")[0].innerHTML = "Population Growth by Decade";
  document.getElementsByTagName("h3")[0].innerHTML = "Population Given in Millions";

  // DIMENSIONS
  const width = 600;
  const height = 600;

  const margin = { top: 10, bottom: 75, left: 75, right: 10}

  const plot_height = height - margin.top - margin.bottom;
  const plot_width = width - margin.left - margin.right;

  // CANVAS AND PLOT
  const canvas = d3.select('#canvas')
    .append('svg')
    // .style('background', 'aliceblue')
    .attr('height', height)
    .attr('width', width)

  const plot = canvas.append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  // SCALES
  let continents = new Set(data.map(d => d.continent));
  let years = new Set(data.map(d => d.year));

  let scaleX = d3.scaleBand(continents, [0, plot_width]).padding(0.01);

  let scaleY = d3.scaleBand(years, [0, plot_height]).padding(0.01);

  let scaleColor = d3.scaleSequential()
    .domain(d3.extent(data, d => d.pop))
    .interpolator(d3.interpolateYlGnBu);

  let commaFormatter = d3.format(",")

  // HEAT MAP
  plot.selectAll('rect').data(data).enter()
    .append('rect')
    .attr('class', 'heatmap-tile')
    .attr("x", d => { return scaleX(d.continent) })
    .attr("y", d => { return scaleY(d.year) })
    .attr("width", d => { return scaleX.bandwidth() })
    .attr("height", d => { return scaleY.bandwidth() })
    .style("fill", d => scaleColor(d.pop));

    // LABELS
  plot.selectAll('text').data(data).enter()
    .append('text')
    .attr('class', 'pop')
    .attr("x", d => { return scaleX(d.continent) })
    .attr("y", d => { return scaleY(d.year) })
    .attr("dx", scaleX.bandwidth() - 20)
    .attr("dy", 40)
    .style("text-anchor", "end")
    .style("fill", d => d.pop < 2000 ? "black" : "white")
    .text(d => commaFormatter(d.pop));

    // AXES
  let xAx = d3.axisBottom(scaleX);
  let yAx = d3.axisLeft(scaleY);

  let xaxis = plot
    .append("g")
    .attr("transform", `translate(0, ${plot_height})`)
    .attr("class", "axes")
    .call(xAx.tickSizeOuter(0));

  let yaxis = plot
    .append("g")
    .attr("transform", "translate(0, 0)")
    .attr("class", "axes")
    .call(yAx.tickSizeOuter(0));

  xaxis.selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-30)")
    .style("text-anchor", "end")
}


function draw() {
  d3.csv("data/population_by_continent_by_decade.csv")
    .then(function (data) {
      data.forEach(d => {
        d.pop = +d.pop
      })
      drawGraph(data);
    })
    .catch((err) => {
      console.log("data loading error");
      console.log(err);
    })
}