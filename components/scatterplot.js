class Scatterplot {
    margin = {
        top: 10, right: 20, bottom: 40, left: 60
    }

    constructor(svg, tooltip, data, width = 550, height = 580) {
        this.svg = svg;
        this.tooltip = tooltip;
        this.data = data;
        this.width = width;
        this.height = height;
        this.handlers = {};
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.tooltip = d3.select(this.tooltip);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        // this.legend = this.svg.append("g");
        this.corr = this.svg.append("g").append("text").attr("transform", `translate(480, 20)`);

        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleLinear();
        this.zScale = d3.scaleOrdinal().range(d3.schemeCategory10);
        this.zScale = d3.scaleSequential().interpolator(d3.interpolateViridis);

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        // this.brush = d3.brush()
        //     .extent([[0, 0], [this.width, this.height]])
        //     .on("start brush", (event) => {
        //         this.brushCircles(event);
        //     })
    }

    update(data, xVar, yVar, colorVar, useColor) {
        this.data = data;
        this.xVar = xVar;
        this.yVar = yVar;
        let xmap = this.data.map(d => d[xVar]);
        let ymap = this.data.map(d => d[yVar]);
        let correlationCoefficient = (xmap.length <= 2 || ymap.length <= 2) ? 0 : ss.sampleCorrelation(xmap, ymap);
        this.corr.text(`Correlation ${correlationCoefficient.toFixed(2)}`);

        this.xScale.domain(d3.extent(this.data, d => d[xVar])).range([0, this.width]).nice();
        this.yScale.domain(d3.extent(this.data, d => d[yVar])).range([this.height, 0]).nice();
        this.zScale.domain([...new Set(this.data.map(d => d[colorVar]))])

        // this.container.call(this.brush);
        // console.log(this.tooltip);
        this.circles = this.container.selectAll("circle")
            .data(data)
            .join("circle")
            .on("mouseover", (e, d) => {
                this.tooltip.select(".tooltip-inner")
                    .html(`Value X: ${d[this.xVar]}<br />Value Y: ${d[this.yVar]}`);

                Popper.createPopper(e.target, this.tooltip.node(), {
                    placement: 'top',
                    modifiers: [
                        {
                            name: 'arrow',
                            options: {
                                element: this.tooltip.select(".tooltip-arrow").node(),
                            },
                        },
                    ],
                });

                this.tooltip.style("display", "block");
            })
            .on("mouseout", (d) => {
                this.tooltip.style("display", "none");
            });

        this.circles
            .transition()
            .attr("cx", d => this.xScale(d[xVar]))
            .attr("cy", d => this.yScale(d[yVar]))
            .attr("fill", "steelblue")
            .attr("r", 3)

        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .transition()
            .call(d3.axisBottom(this.xScale));

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale));

        // if (useColor) {
        //     this.legend
        //         .style("display", "inline")
        //         .style("font-size", ".8em")
        //         .attr("transform", `translate(${this.width + this.margin.left + 10}, ${this.height / 2})`)
        //         .call(d3.legendColor().scale(this.zScale))
        // }
        // else {
        //     this.legend.style("display", "none");
        // }
    }

    // isBrushed(d, selection) {
    //     let [[x0, y0], [x1, y1]] = selection; // destructuring assignment
    //     let x = this.xScale(d[this.xVar]);
    //     let y = this.yScale(d[this.yVar]);

    //     return x0 <= x && x <= x1 && y0 <= y && y <= y1;
    // }

    // // this method will be called each time the brush is updated.
    // brushCircles(event) {
    //     let selection = event.selection;

    //     this.circles.classed("brushed", d => this.isBrushed(d, selection));

    //     if (this.handlers.brush)
    //         this.handlers.brush(this.data.filter(d => this.isBrushed(d, selection)));
    // }

    // on(eventType, handler) {
    //     this.handlers[eventType] = handler;
    // }
}