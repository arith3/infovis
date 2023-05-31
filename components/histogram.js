class Histogram {
    margin = {
        top: 10,
        right: 20,
        bottom: 40,
        left: 60,
    };

    constructor(svg, width = 550, height = 580) {
        this.svg = svg;
        this.width = width;
        this.height = height;
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");

        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleLinear();

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr(
            "transform",
            `translate(${this.margin.left}, ${this.margin.top})`
        );
    }

    update(data, xVar) {
        //const categories = [...new Set(data.map(d => d[xVar]))]
        const bins = d3.bin().thresholds(d3.thresholdFreedmanDiaconis).value((d) => d[xVar])(data);
        //console.log(bins)
        //const counts = {}

        this.xScale = d3
            .scaleLinear()
            .domain([bins[0].x0, bins[bins.length - 1].x1])
            .range([0, this.width]).nice();

        // Declare the y (vertical position) scale.
        this.yScale = d3
            .scaleLinear()
            .domain([0, d3.max(bins, (d) => d.length)])
            .range([this.height, 0]).nice();

        // categories.forEach((c) => {
        //   counts[c] = data.filter((d) => d[xVar] === c).length;
        // });

        // this.xScale.domain(categories).range([0, this.width]).padding(0.3);
        // this.yScale.domain([0, d3.max(Object.values(counts))]).range([this.height, 0]);

        // this.container
        //   .selectAll("rect")
        //   .data(categories)
        //   .join("rect")
        //   .attr("x", (d) => this.xScale(d))
        //   .attr("y", (d) => this.yScale(counts[d]))
        //   .attr("width", this.xScale.bandwidth())
        //   .attr("height", (d) => this.height - this.yScale(counts[d]))
        //   .attr("fill", "lightgray");
        this.container
            .selectAll("rect")
            .data(bins)
            .join("rect")
            .transition()
            .attr("x", (d) => this.xScale(d.x0) + 1)
            .attr("y", (d) => this.yScale(d.length))
            //.attr("width", (d) => this.xScale(d.x1) - this.xScale(d.x0) - 1)
            .attr("width", (d) => {return this.xScale(d.x1) - this.xScale(d.x0) - 1 > 0 ? this.xScale(d.x1) - this.xScale(d.x0) - 1 : 50;})
            .attr("height", (d) => this.yScale(0) - this.yScale(d.length))
            .attr("fill", "steelblue").transition().duration(1000);
        // this.container

        //     .selectAll("text")
        //     .data(bins)
        //     .join("text")
        //     .style("font-size", "10px")
        //     // add half the size of the bar to center the text
        //     .attr("x", (d) => this.xScale(d.x0) + 1 + (this.xScale(d.x1) - this.xScale(d.x0)) / 2)
        //     .attr("y", (d) => this.yScale(d.length) - 10)
        //     .text((d) => d.length)
        // this.container
        //     .append("line")
        //     .attr("x1", x(140) )
        //     .attr("x2", x(140) )
        //     .attr("y1", y(0))
        //     .attr("y2", y(1600))
        //     .attr("stroke", "grey")
        //     .attr("stroke-dasharray", "4")
        // this.container.append("text").attr("x", 320).attr("y", 60).text("variable B").style("font-size", "15px").attr("alignment-baseline","middle")
            // .append("text")
            // .attr("x", x(190))
            // .attr("y", y(1400))
            // .text("threshold: 140")
            // .style("font-size", "15px")

        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .transition().call(d3.axisBottom(this.xScale));
            // .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
            // .call(d3.axisBottom(this.xScale).ticks(this.width / 80).tickSizeOuter(0))
            // .call((g) => g.append("text")
            //     .attr("x", this.width)
            //     .attr("y", this.margin.bottom - 4)
            //     .attr("fill", "currentColor")
            //     .attr("text-anchor", "end")
            //     .text("Unemployment rate (%) →"));

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition().call(d3.axisLeft(this.yScale));
    }
}