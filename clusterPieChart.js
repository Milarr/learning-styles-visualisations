
const ClusterPieChart = function ClusterPieChart(parent_selector, dataPath, options) {
  var originalData,
      legendFilter = [],
      innerRadius = 0;

  const chartConfig = {
    width: options.width,
    height: options.height,
    colourScale: d3.scaleOrdinal().range(["#071930", "#03A694", "#F24738", "#851934"]),
    margin: options.margin,
    radiusScale: d3.scaleLinear(),
    circleRadius: 0,
    legend: { title: "Learning Styles", translateX: 0, translateY: 0 }
  }

  let arc = d3.arc().innerRadius(innerRadius);

  const parent = d3.select(parent_selector);

  d3.json(dataPath,function(error, data){
    
    let dataLength = data.length;
    let piesInRow = Math.ceil(Math.sqrt(dataLength));
    let width = chartConfig.width;
    // let tempWidth = dataLength > piesInRow?width-0.5*(width/piesInRow):width;
    let tempWidth = width-0.5*(width/piesInRow)
    chartConfig.circleRadius = (chartConfig.height-chartConfig.margin.top) / piesInRow
    // chartConfig.circleRadius = d3.min([tempWidth,(chartConfig.height-chartConfig.margin.top)])/piesInRow;
    // let translateBy = `translate('${(dataLength > piesInRow?0.5*chartConfig.circleRadius:0)}, ${chartConfig.margin.top})`;
    let xOffset = 0, yOffset = 0;

    parent.select("svg").remove();
    let svg = parent.append("svg")
      .attr("width", chartConfig.width )
      .attr("height", chartConfig.height)
      .attr("class", "clusterPie");
    
    // LEGEND
    let legendZone = svg.append("g")
    .attr("class", "legendZone")
    .attr("transform", `translate(${-chartConfig.width / 2}, 20)`);

    let title = legendZone.append("text")
      .attr("class", "title")
      .attr("transform", `translate(${chartConfig.legend.translateX}, ${chartConfig.legend.translateY})`)
      .attr("x", chartConfig.width - 70)
      .attr("y", 10)
      .attr("font-size", "12px")
      .attr("fill", "#404040")
      .text(chartConfig.legend.title);

    let legend = legendZone.append("g")
      .attr("class", "legend")
      .attr("height", 100)
      .attr("width", 200)
      .attr("transform", `translate(${chartConfig.legend.translateX},${chartConfig.legend.translateY + 20})`);

    let categoryNames = data[0].values.map(d => d.type);

    let legendCategory = legend.selectAll(".legendCategory")
      .data(categoryNames)
      .enter()
      .append("g")
      .attr("class", "legendCategory")

    let legendText = legendCategory.append("text")
    let legendSquare = legendCategory.append("rect")

    legendSquare.attr("x", chartConfig.width - 65)
      .attr("y", (d, i) => i * 20)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", (d, i) => chartConfig.colourScale(i))

    legendText.attr("x", chartConfig.width - 52)
      .attr("y", (d,i) => i * 20 + 9)
      .attr("font-size", "11px")
      .attr("fill", "#737373")
      .text(d => d);

    // PIE CHARTS
    let pies = svg.append('g').attr('class', 'pies')
      // .attr('transform', `translate(${chartConfig.width / 2}, ${chartConfig.height - 10 })`);

    let pieGraphic = pies.selectAll('.pieGraphic')
      .data(data)
      .enter();

    pieGraphic.append('g')
      .attr('class', 'pieGraphic')
      .attr('id', function(d, i) { d.name })
      .attr('transform', function (d, i) {
        return `translate(${((i%piesInRow)*(chartConfig.circleRadius))}, ${(Math.floor(i/piesInRow)*chartConfig.circleRadius)})`;
      });

    let pieText = pieGraphic.append("text")

    pieText.attr("x", 30)
      .attr("y", 30)
      .attr("font-size", "11px")
      .attr("fill", "#737373")
      .attr('transform', function (d, i) {
        return `translate(${((i%piesInRow)*(chartConfig.circleRadius)) + 5 }, ${(Math.floor(i/piesInRow)*chartConfig.circleRadius - 5)})`;
      })
      .text(function(d, i){ return d.name });

    // Draw all of the pies
    d3.selectAll('.pieGraphic').each(RenderPieCharts);
    
    // Mouse over events over legend to high light learning type pie pieces 
    legendCategory.on("mouseover", function (legendType, i){
        d3.selectAll(`.pieGraphic .${legendType}`)
          .transition("elastic")
          .attr("d", arc.outerRadius(chartConfig.radiusScale(60) * 1.2));
      })
      .on ("mouseout", function(legendType, i){
        d3.selectAll(`.pieGraphic .${legendType}`)
          .transition("elastic")
          .attr("d", arc.outerRadius(chartConfig.radiusScale(60) * 0.8));
      });

    return svg;
  });

  function RenderPieCharts(pieData){
    let pie = d3.pie()
      .value(function(d, i){ return d.ele })
      .sort(function(_){return _});

    arc.outerRadius(chartConfig.radiusScale(60) * 0.8);

    let paths = d3.select(this)
      .selectAll('path')
      .data(pie(pieData.values))
      .enter()
      .append('path')
      .attr("class", function(d){ return d.data.type })
      .attr('transform',function(d, i){
        return `translate(${(chartConfig.circleRadius/2)},${(chartConfig.circleRadius/2)})`;
      })
      .attr("fill", function(d){ return chartConfig.colourScale(d.data.type); })
      .attr('d', arc);

    paths.exit().transition().remove()
  }
}