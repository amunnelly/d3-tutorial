function drawGraph(data) {

  // HEADLINE
  document.getElementsByTagName("h2")[0].innerHTML = "Best-Selling Cars, 2023";
  document.getElementsByTagName("h3")[0].innerHTML = "";

  // DIMENSIONS
  const width = 600;
  const height = 600;

  const margin = { top: 10, right: 10, bottom: 10, left: 10 };

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

  let models = [];
  let models_prime = data.filter(d => d.value > 0);
  models_prime.forEach(d=>{
    models.push(d.id);
  })

  const stratify = d3.stratify()
  .id(d=>d.id)
  .parentId(d=>d.parentId);

  const root = stratify(data)
  .sort((a,b)=>b.height - a.height)
  .sum(d=>d.value);


  // CREATE TREE MAP
  const treemap = d3.treemap()
  .size([plot_width, plot_height])
  .padding(1);

  treemap(root);
  
  // SCALES

  let scaleColor = d3.scaleOrdinal(d3.schemeSet3);

  // VISUALISATION

  let viz = plot.selectAll("rect")
  .data(root.leaves())
  .join("rect")
  .attr("x", d=>d.x0)
  .attr("y", d=>d.y0)
  .attr("width", d=>d.x1-d.x0)
  .attr("height", d=>d.y1-d.y0)
  .style("stroke", d=>d3.color(scaleColor(d.data.parentId)).darker())
  .style("fill", d=>scaleColor(d.data.parentId));

  // LABELS

  plot.selectAll("text")
  .data(root.leaves())
  .enter()
  .append("text")
  .attr("x", d=>d.x0+10)
  .attr("y", d=>d.y0+20)
  .text(d=> models.includes(d.id) ? d.id: "")
  .style("font-size", "12px");

  // FORMATTER
  let commaFormatter = d3.format(",");

    // TOOLTIP

    function tooltipText(make, model, sales) {
      return `The ${make} ${model} sold ${commaFormatter(sales)} units.`;
    }
  
    let tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  
      // DON'T USE AN ARROW FUNCTION!
    viz
      .on("mouseover", function (e, d) {
        if(models.includes(d.data.id)){
        tooltip.transition().duration(500).style("opacity", 0.9);

        tooltip
          .html(tooltipText(d.data.parentId, d.data.id, d.data.value))
          .style("left", e.pageX + "px")
          .style("top", e.pageY + "px");
      }})
      .on("mouseout", function (d){
        tooltip.transition().duration(500).style("opacity", 0);

    });


}

function draw() {
  d3.csv("data/best_selling_cars_treemap_ready.csv").then((data) => {
    
    drawGraph(data);
  }).catch((err) => {
    console.log("Something has gone wrong.")
    console.log(err);
  })
}