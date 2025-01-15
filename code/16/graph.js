function drawGraph(data) {

  let colormap = data[1];
  data = data[0];
  

  // HEADLINE
  document.getElementsByTagName("h2")[0].innerHTML = "Character Interactions in <i>The Godfather</i>";
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

  // UPDATE NODES
  function updateNodes() {
    plot.selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 10)
      .style("fill", d => colormap[d.label])
      // .attr("stroke", d => d3.color(d => colormap[d.label]).darker())
      .attr("class", "viz");
  }

  // UPDATE LINKS
  function updateLinks() {
    plot.selectAll("line")
      .data(data.links)
      .join("line")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
  }

  // TICKED
  function ticked() {
    updateLinks();
    updateNodes();


    // DON'T USE AN ARROW FUNCTION!
    plot.selectAll(".viz")
      .on("mouseover", function (e, d) {
        tooltip.transition().duration(500).style("opacity", 0.9);

        tooltip
          .html(d.label)
          .style("left", e.pageX + "px")
          .style("top", e.pageY + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition().duration(500).style("opacity", 0);
      })

      d3.selectAll("circle").call(drag);

  }

  const drag = d3.drag().on("drag", handleDrag);

  function handleDrag(e){
    e.subject.x = e.x;
    e.subject.y = e.y;

    updateLinks();
    updateNodes();
  }
  
  // FORCE SIMULATION

  const simulation = d3.forceSimulation(data.nodes)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(plot_width/2, plot_height/2))
    .force("link", d3.forceLink().links(data.links).distance(75))
    .on("tick", ticked);


  // TOOLTIP

  let tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
}

function draw() {
  Promise.all([d3.json("data/theGodfather.json"),
  d3.json("data/theGodfather_character_color_map.json")])
    .then((data) => {
      drawGraph(data);
    }).catch((err) => {
      console.log("Something has gone wrong.")
      console.log(err);
    })
}