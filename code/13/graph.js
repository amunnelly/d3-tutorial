function drawGraph(data) {
  
  // HEADLINE
  document.getElementsByTagName("h2")[0].innerHTML = "Population Growth by Decade";
  document.getElementsByTagName("h3")[0].innerHTML = "Population Given in Millions";

  // DIMENSIONS
  const width = 900;
  const height = 633;

  const margin = { top: 10, right: 150, bottom: 75, left: 100 };

  const plot_height = height - margin.top - margin.bottom;
  const plot_width = width - margin.left - margin.right;

  // CANVAS AND PLOT
  const canvas = d3.select("#canvas")
    .append("svg")
    .style("background", "aliceblue")
    .attr("height", height)
    .attr("width", width);

  const plot = canvas.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // MANIPULATE DATA
  const primaryCategory = data.map(d=>d.Year);
  const secondaryCategory = data.columns.slice(1);

  const stack = d3.stack().keys(secondaryCategory);
  const stackedData = stack(data);


  // SCALES

  let scaleX = d3.scaleBand(primaryCategory, [0, plot_width]).padding(0.05);

  let scaleY = d3.scaleLinear().domain([
    0, d3.max(stackedData, d=>d3.max(d, e=>e[1]))
  ]).range([plot_height, 0])

  let scaleColor = d3.scaleOrdinal()
  .domain(secondaryCategory)
  .range(d3.schemeTableau10)

  // VISUALISATION

  const viz = plot.append("g")
    .selectAll("g")
    .data(stackedData)
    .join("g")
    .attr("fill", d => scaleColor(d.key))
    .selectAll("rect")
    .data(d => d)
    .join('rect')
    .attr('class', 'bar')
    .attr('x', d => { return scaleX(d.data.Year) })
    .attr('y', d => { return scaleY(d[1]) })
    .attr('height', d => { return scaleY(d[0]) - scaleY(d[1]) })
    .attr('width', d => { return scaleX.bandwidth() });



  // FORMATTER
  let commaFormatter = d3.format(",");

  // AXES
  let xAx = d3.axisBottom(scaleX);
  let yAx = d3.axisLeft(scaleY);

  let xaxis = plot.append("g")
    .attr("transform", `translate(0, ${plot_height})`)
    .attr("class", "axes")
    .call(xAx.tickSizeOuter(0));

  let yaxis = plot.append("g")
    .attr("transform", "translate(0, 0)")
    .attr("class", "axes")
    .call(yAx.tickSizeOuter(0));

    // LABELS
    let xLabel = plot
    .append("g")
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", plot_width)
    .attr("y", plot_height + margin.bottom * 0.5)
    .text("Year");

  let yLabel = plot
    .append("g")
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", 0)
    .attr("y", -(margin.left * 0.67))
    .attr("transform", "rotate(-90)")
    .text("Population (millions)");

    // LEGEND

    let legend = canvas.append("g").attr("class", "legend");

    let legendLabels = secondaryCategory.reverse();

    // legend circles
    legend.selectAll("circle").data(legendLabels).enter()
    .append("circle")
    .attr("class", "legend-circle")
    .attr("cx", plot_width+margin.left + 10)
    .attr("cy", (d,i)=>{return 15+(i*25)})
    .attr("r", 5)
    .style("fill", d=>scaleColor(d));

    // legend text
    legend.selectAll("legend").data(legendLabels).enter()
    .append("text")
    .attr("class", "legend-label")
    .attr("x", plot_width+margin.left +17 )
    .attr("y", (d,i)=>{return 20+(i*25)})
    .text(d=>d);


    // TOOLTIP

    function tooltipText(primaryTip, secondaryTip, pop) {
      return `${primaryTip}: ${secondaryTip}<br>
      Population: ${commaFormatter(pop)}`;
    }
  
    let tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  
      // DON'T USE AN ARROW FUNCTION!
    viz
      .on("mouseover", function (e, d) {
        tooltip.transition().duration(500).style("opacity", 0.9);
        console.log(this.parentNode);

        let primaryTip = d.data.Year;
        let secondaryTip = d3.select(this.parentNode).datum().key;
        let pop = d.data[secondaryTip];

        tooltip
          .html(tooltipText(primaryTip, secondaryTip, pop))
          .style("left", e.pageX + "px")
          .style("top", e.pageY + "px");
      })
      .on("mouseout", (d) =>
        tooltip.transition().duration(500).style("opacity", 0),
      );


}

function draw() {
  d3.csv("data/population_by_continent_by_decade_wide.csv").then((data) => {
    
    drawGraph(data);
  }).catch((err) => {
    console.log("Something has gone wrong.")
    console.log(err);
  })
}