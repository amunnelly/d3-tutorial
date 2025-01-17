function drawGraph(data) {
  
  // HEADLINE
  document.getElementsByTagName("h2")[0].innerHTML = "Airline Passengers, 2008";
  document.getElementsByTagName("h3")[0].innerHTML = "";

  // DIMENSIONS
  const width = 500;
  const height = 500;

  const margin = { top: 75, right: 75, bottom: 75, left: 75 };

  const plot_height = height - margin.top - margin.bottom;
  const plot_width = width - margin.left - margin.right;

  const radius = plot_width / 2;

  // CANVAS AND PLOT
  const canvas = d3.select("#canvas")
    .append("svg")
    .style("background", "aliceblue")
    .attr("height", height)
    .attr("width", width);

  const plot = canvas.append("g")
    .attr("transform", `translate(${width/2},${width/2})`);

  // MANIPULATE DATA
  let labels = data.columns.slice(1);
  let chord_data = [];
  data.forEach(d=> chord_data.push(Object.values(d).slice(1)));

  // SCALES

  let scaleColor = d3.scaleOrdinal()
  .domain(labels)
  .range(d3.schemeSet1)

  // VISUALISATION

  // 1. Chords
  const chord = d3.chord().padAngle(0.1);
  chord_data = chord(chord_data);
  console.log(chord_data);

  // 2. Ribbons

  const ribbon = d3.ribbon().radius(radius);

  const ribbons = plot.selectAll("path.ribbon")
  .data(chord_data)
  .join("path") // join()
  .attr("class", "ribbon")
  .attr("d", ribbon)
  .style("opacity", 0.3)
  .style("fill", d=> d.source.value > d.target.value ? scaleColor(d.source.index): scaleColor(d.target.index));

  // 3. Arcs
  const arc = d3.arc().innerRadius(radius+2).outerRadius(radius+38);

  plot.selectAll("path.arc")
  .data(chord_data.groups)
  .join("path") // join
  .attr("class", "arc")
  .attr("d", arc)
  .style("fill", d=>scaleColor(d.index));

  // LABELS

  plot.selectAll("text")
  .data(chord_data.groups)
  .join("text") // join
  .attr("x", d=>arc.centroid(d)[0])
  .attr("y", d=>arc.centroid(d)[1])
  .attr("dx", d=>arc.centroid(d)[0] < 0 ? -25: 25)
  .attr("yy", d=>arc.centroid(d)[1] < 0 ? -25: 25)
  .attr("class", "label")
  .style("fill", "white")
  .style("stroke","black")
  .style("stroke-width", 1.5)
  .text(d=>labels[d.index]);



  // FORMATTER
  let commaFormatter = d3.format(",");

    // TOOLTIP

    function tooltipText(origin, destination, oPassengers, dPassengers) {
      return `    <table id="tooltipTable">
        <tr>
            <th>Origin</th>
            <th>Destination</th>
            <th>Passengers</th>
        </tr>
        <tr>
            <td>${origin}</td>
            <td>${destination}</td>
            <td>${oPassengers}</td>
        </tr>
        <tr>
            <td>${destination}</td>
            <td>${origin}</td>
            <td>${dPassengers}</td>
        </tr>
    </table>`;
    }
  
    let tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  
      // DON'T USE AN ARROW FUNCTION!
    ribbons
      .on("mouseover", function (e, d) {
        tooltip.transition().duration(500).style("opacity", 0.9);

        d3.select(this).transition().duration(250).style("opacity", 0.67);

        let origin = labels[d.source.index];
       let destination = labels[d.target.index];
       let oPassengers = commaFormatter(d.source.value);
       let dPassengers = commaFormatter(d.target.value)
        
        tooltip
          .html(tooltipText(origin, destination, oPassengers, dPassengers))
          .style("left", e.pageX + "px")
          .style("top", e.pageY + "px");
      })
      .on("mouseout", function (d){
        tooltip.transition().duration(500).style("opacity", 0);

        d3.select(this).transition().duration(250).style("opacity", 0.3);

    });


}

function draw() {
  d3.csv("data/big_four_airports.csv").then((data) => {
    
    drawGraph(data);
  }).catch((err) => {
    console.log("Something has gone wrong.")
    console.log(err);
  })
}