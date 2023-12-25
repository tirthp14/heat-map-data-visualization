let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let req = new XMLHttpRequest();

let baseTemp
let values = []

let xScale
let xScale2
let yScale

let minYear
let maxYear
let numYear = maxYear - minYear + 1
let monthsName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

let maxTemp
let minTemp

let width = 1450;
let height = 550;
let padding = 78;

let legendWidth = 600; 
let legendHeight = 80; 

let canvas = d3.select("#canvas")
let tooltip = d3.select("#tooltip")
let legendCanvas = d3.select("#legend")
                        .attr("width", legendWidth)
                        .attr("height", legendHeight)

let drawCanvas = () => {
    canvas.attr("width", width)
            .attr("height", height)
}

let generateScales = () => {

    minYear = d3.min(values, (item) => {
        return item["year"]
    })
 
    maxYear = d3.max(values, (item) => {
        return item["year"]
    })

    xScale = d3.scaleLinear()
                .domain([minYear, maxYear + 1])
                .range([padding, (width - padding)])

    yScale = d3.scaleTime()
                .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
                .range([padding, (height - padding)])

}

let drawCells = () => {

    canvas.selectAll("rect")
            .data(values)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("fill", (item) => {
                variance = (baseTemp + item["variance"])

                minTemp = d3.min(values, (item) => {
                    return (baseTemp + item["variance"])
                })
            
                maxTemp = d3.max(values, (item) => {
                    return (baseTemp + item["variance"])
                })

                let colorScale = ["#08306b","#4292c6","#6baed6","#c6dbef","#feedde","#fdbe85","#fd8d3c","#e6550d","#a63603"] 

                if (variance >= minTemp && variance <= 3.04) {
                    return colorScale[0]
                } else if (variance >= 3.04 && variance <= 4.396) {
                    return colorScale[1]
                } else if (variance >= 4.396 && variance <= 5.752) {
                    return colorScale[2]
                } else if (variance >= 5.752 && variance <= 7.108) {
                    return colorScale[3]
                } else if (variance >= 7.108 && variance <= 8.464) {
                    return colorScale[4]
                } else if (variance >= 8.464 && variance <= 9.82) {
                    return colorScale[5]
                } else if (variance >= 9.82 && variance <= 11.176) {
                    return colorScale[6]
                } else if (variance >= 11.176 && variance <= 12.532) {
                    return colorScale[7]
                } else if (variance >= 12.532 && variance <= 13.888) {
                    return colorScale[8]
                } else {
                    return "nothing"
                }
            })
            .attr("data-year", (item) => {
                return item["year"]
            })
            .attr("data-month", (item) => {
                return item["month"] - 1
            })
            .attr("data-temp", (item) => {
                return (baseTemp + item["variance"])
            })
            .attr("height", (height - (2 * padding)) / 12)
            .attr("y", (item) => {
                return yScale(new Date(0, (item["month"] - 1), 0, 0, 0, 0, 0))
            })
            .attr("width", () => {
                let numYear = maxYear - minYear
                return (width - (2 * padding)) / numYear
            })
            .attr("x", (item) => {
                return xScale(item["year"])
            })
            .on("mouseover", (event, item) => {

                let temp = (baseTemp + item["variance"])
                let variance = item["variance"]

                tooltip.style("opacity", 0.9)
                tooltip.style("border-radius", 15 + "px")
                tooltip
                .html(
                    "<p>" +
                        item["year"] + " - " + monthsName[item["month"] - 1] + 
                    "</p>" +
                    "<p>" + 
                        "Temperature: " + temp.toFixed(2) +" °C" + 
                    "</p>"+
                    "<p>" +
                        "Variance: " + variance.toFixed(2) + " °C" +
                    "</p>")
                .attr("data-date", item["Year"])
                .style("left", event.pageX + 15 + "px")
                .style("top", event.pageY - 28 + "px")
            })
            .on("mouseout", (item) => {
                tooltip.style("opacity", 0)
            })

}

let generateAxes = () => {

    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"))

    canvas.append("g")
            .call(xAxis)
            .attr("id", "x-axis")
            .attr("transform", "translate(0," + (height - padding) + ")")

    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%B"))

    canvas.append("g")
            .call(yAxis)
            .attr("id", "y-axis")
            .attr("transform", "translate(" + padding + ", 0)")

}

let drawLegend = () => {

    minTemp = d3.min(values, (item) => {
        return (baseTemp + item["variance"])
        })
    
    maxTemp = d3.max(values, (item) => {
        return (baseTemp + item["variance"])
    })

    let legend = legendCanvas.append("g")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("transform", "translate(140, 10)");

    let legendValues = [1.68, 3.04, 4.396, 5.752, 7.108, 8.464, 9.82, 11.176, 12.532, 13.888];
    let colorScale = ["#08306b","#4292c6","#6baed6","#c6dbef","#feedde","#fdbe85","#fd8d3c","#e6550d","#a63603"] 

    legend.selectAll("rect")
        .data(colorScale)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 36) 
        .attr("width", 36)  
        .attr("height", 26)  
        .attr("fill", d => d)
        .style("stroke", "black")

    let xAxisScale = d3.scaleLinear()
        .domain([legendValues[0], legendValues[legendValues.length - 1]])
        .range([0, colorScale.length * 36])

    let tickValues = legendValues.slice(0, legendValues.length);

    let xAxis = d3.axisBottom(xAxisScale)
                    .tickValues(tickValues)
                    .tickSizeInner(36)  
                    .tickSizeOuter(0);

    legend.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0, 0)") 
        .call(xAxis)

    legend.selectAll(".tick text")
        .text(d => d.toFixed(2))
        .style("font-size", 10 + "px");
};

req.open("GET", url, true)
req.onload = () => {
    let object = JSON.parse(req.responseText)
    baseTemp = object["baseTemperature"]
    values = object["monthlyVariance"]
    drawCanvas()
    generateScales()
    drawCells()
    generateAxes()
    drawLegend()
}
req.send()