const url = "http://localhost:3000/cyclist-data";
// const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

async function getData(url) {
  try {
    const res = await axios.get(url);
    const cyclistData = res["data"];

    const years = cyclistData.map((data) => String(data["Year"]));
    const times = cyclistData.map((data) => data["Time"]);
    // console.log(cyclistData);
    // console.log(times);

    const minYear = d3.min(years);
    const maxYear = d3.max(years) ;
    console.log(maxYear)

    const width = 600;
    const height = 400;
    const padding = 50;

    const xScale = d3
      .scaleTime()
      .domain([new Date(minYear), new Date(maxYear)])
      .range([padding, width - padding]);
    // console.log(minYear)
    // console.log(xScale(new Date(minYear)))
    // const t = Date.now()
    console.log(times);
    const timeFormat = d3.timeFormat("%M:%S");
    const parsedTime = times.map((d) => d3.timeParse("%M:%S")(d));
    const minTime = d3.min(parsedTime);
    const maxTime = d3.max(parsedTime);

    // console.log("printing the parsedTimes");
    // console.log(parsedTime);
    // console.log("--------------------");
    // console.log(minTime);
    // console.log(maxTime);
    // console.log("converting to scale");
    const yScale = d3
      .scaleTime()
      // .domain([t - (1 * 1000), t + (1 * 1000)])
      .domain([minTime, maxTime])
      .range([padding, height - padding]);

    // console.log(yScale(minTime));
    // console.log(d3.timeParse("%M:%S")("33:02"), " call the parser");
    // console.log(yScale(d3.timeParse("%M:%S")("36:50")), " converted to yScale");
    const container = d3
      .select("#container")
      .attr("width", width)
      .attr("height", height);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

    container
      .selectAll("circle")
      .data(cyclistData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => d.Time)
      .attr("cx", (d) => {
        return xScale(new Date(String(d.Year))) + padding;
      })
      .attr("cy", (d) => {
        return yScale(d3.timeParse("%M:%S")(d.Time));
      })
      .attr("r", 5);

    container
      .append("g")
      .attr("id", "x-axis")
      .style("transform", `translate(0, ${height - padding}px)`)
      .call(xAxis);

    container
      .append("g")
      .attr("id", "y-axis")
      .style("transform", `translate(${padding}px, 0px)`)
      .call(yAxis);
  } catch (err) {
    console.log(err);
  }
}

getData(url);
