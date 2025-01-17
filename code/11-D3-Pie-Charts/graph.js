function drawGraph(data) {

  const size = 600;
  const margin = 20;
  const radius = (size/2)-margin;

  // TITLE
  document.getElementsByTagName("h2")[0].innerHTML = "USA Energy Sources";
  document.getElementsByTagName("h3")[0].innerHTML = "";

  // CANVAS
  var canvas = d3
    .select("#canvas")
    .append("svg")
    .attr("height", size)
    .attr("width", size)
    .style("background", "aliceblue");

  // PLOT
  var plot = canvas
    .append("g")
    .attr("transform", `translate(${radius+margin}, ${radius+margin})`);

  let pie = d3.pie()
  .startAngle(Math.PI/2)
  .endAngle(2.5*Math.PI)
  .value(d=>d.share);

  let arcs = pie(data);
  console.log(arcs);

  const drawArc = d3.arc().innerRadius(0).outerRadius(radius);

  let colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  let chart = plot.selectAll("arcs").data(arcs).enter()
  .append("path")
  .attr("d", drawArc)
  .attr("fill", d=>colorScale(d));

  // LABELS

  plot.append("g").selectAll("arcs").data(arcs).enter()
  .append("text")
  .attr("class","pieLabel")
  .attr("x", d=>drawArc.centroid(d)[0]*1.67)
  .attr("y", d=>drawArc.centroid(d)[1]*1.67)
  .attr("text-anchor", "middle")
  .text(d=>`${d.data.source}: ${d.data.share}%`);

  let angleInterpolator = d3.interpolate(pie.startAngle()(), pie.endAngle()());

  chart.transition().duration(1000).attrTween("d", d=>{
    let originalend = d.endAngle;
    return t => { // t: a time interval; one millisecond
      let currentAngle = angleInterpolator(t);
      if (currentAngle < d.startAngle){
        return "";
      }
      d.endAngle = Math.min(currentAngle, originalend);
      return drawArc(d);
    }
  })

  }

function draw() {
  d3.csv("data/energy_sources.csv")
    .then((data) => {
      data.forEach((d) => {
        d.share = +d.share;
      });
      drawGraph(data);
    })
    .catch((err) => {
      console.log("Something has gone wrong");
      console.log(err);
    });
}
