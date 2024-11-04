function draw() {
    let scale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, 10]);

    for (let i = 0; i < 11; i++) {
        console.log(`The value ${i} maps to the value ${scale(i)}.`);

    }
}