function drawGraph(data) {
  console.log(data)
}

function draw() {
    d3.csv("data/dummydata.csv")
        .then((data) => {
            data.forEach(d=> {
              d.Date = new Date(d.Date);
              d.Quantity = +d.Quantity;
            });
            drawGraph(data);
        }).catch((err) => {
            console.log("Something has gone wrong");
            console.log(err);
        });
}
