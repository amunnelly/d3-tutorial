function drawGraph(data) {

    data = data.filter(d => d.year == 2012);

    // DIMENSIONS
    const width = 800;
    const height = 600;

    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    const plot_width = width - margin.left - margin.right;
    const plot_height = height - margin.left - margin.right;

    // TITLE
    document.getElementsByTagName("h2")[0].innerHTML = "Seattle Weather";
    document.getElementsByTagName("h3")[0].innerHTML = "Precipitation in 2012";

    // CANVAS
    var canvas = d3.select("#canvas")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .style("background", "aliceblue");

    // PLOT
    var plot = canvas.append('g')
        .attr("transform", `translate(${margin.left}, ${margin.right})`);

    // SCALES
    let xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, plot_width]);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cumulativePrecipitationByYear)])
        .range([plot_height, 0]);

    //  THE LINE MAKING FUNCTION
    let makeLine = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.cumulativePrecipitationByYear));

    // THE LINE ITSELF
    let dataline = plot.append("path")
        .attr("d", makeLine(data))
        .attr("class", "dataline")
        .style("stroke", "crimson")
        .style("fill", "none");

    let xAx = d3.axisBottom(xScale);
    let yAx = d3.axisLeft(yScale);

    let xaxis = plot
        .append("g")
        .attr("transform", `translate(0, ${plot_height})`)
        .attr("class", "axes")
        .call(xAx);

    let yaxis = plot
        .append("g")
        .attr("transform", "translate(0, 0)")
        .attr("class", "axes")
        .call(yAx);

    // LABELS
    plot
        .append("g")
        .append("text")
        .attr("class", "axisLabel")
        .attr("x", plot_width)
        .attr("y", plot_height + margin.bottom * 0.67)
        .text("Date");

    plot
        .append("g")
        .append("text")
        .attr("class", "axisLabel")
        .attr("x", 0)
        .attr("y", -(margin.left * 0.67))
        .attr("transform", "rotate(-90)")
        .text("Precipitation");

    let viz = plot
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.date))
        .attr("cy", (d) => yScale(d.cumulativePrecipitationByYear))
        .attr("r", 5)
        .attr("opacity", 0);

    // FORMATTERS

    let dateFormatter = d3.timeFormat("%a, %b %d");
    let numberFormatter = d3.format(",.1f");


    function tooltipText(d) {
        return `${dateFormatter(d.date)}<br>
        Total Precipitation: ${numberFormatter(d.cumulativePrecipitationByYear)}<br>
        Daily Precipitation: ${numberFormatter(d.precipitation)}<br>
        Weather: ${d.weather}`;
    }

    let tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    viz.on("mouseover", (e, d) => {

        tooltip.transition().duration(500)
            .style("opacity", 0.9);
        tooltip.html(tooltipText(d))
            .style("left", e.pageX + "px")
            .style("top", e.pageY + "px")
    })
        .on("mouseout", d => tooltip
            .transition().duration(500)
            .style("opacity", 0));

}


function draw() {
    d3.csv("data/seattle_weather.csv")
        .then((data) => {
            data.forEach(d => {
                d.date = new Date(d.date);
                d.cumulativePrecipitationByYear = +d.cumulativePrecipitationByYear;
                d.dayOfYear = +d.dayOfYear;
            })
            drawGraph(data);
        }).catch((err) => {
            console.log("Something has gone wrong");
            console.log(err);
        });
}