function drawGraph(data) {
  const size = 600;
  const margin = 20;
  const radius = (size/2)-margin;

  // TITLE
  document.getElementsByTagName("h2")[0].innerHTML = data[0].project;
  document.getElementsByTagName("h3")[0].innerHTML = `Completion: ${data[0].completed*100}%`;

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
  .startAngle(0)
  .endAngle(2*Math.PI*data[0].completed)
  .value(d=>d.completed);

  let arcs = pie(data);
  console.log(arcs);

  const drawArc = d3.arc().innerRadius(140).outerRadius(radius);

  let chart = plot.selectAll("arcs").data(arcs).enter()
  .append("path")
  .attr("d", drawArc)
  .attr("fill", "steelblue");

  let angleInterpolator = d3.interpolate(pie.startAngle()(), pie.endAngle()());

  chart.transition().duration(750).attrTween("d", d=>{
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
  d3.csv("data/completion.csv")
    .then((data) => {
      data.forEach((d) => {
        d.completed = +d.completed;
      });
      drawGraph(data);
    })
    .catch((err) => {
      console.log("Something has gone wrong");
      console.log(err);
    });
}
