
const ClusterPieChart = function ClusterPieChart(parent_selector, dataPath, options) {
  var originalData,
      ParentG,LegendG,legendFilter = [],
      innerRadius = 0;


  const chartConfig = {
    width: 600,
    height: 600,
    colourScale: d3.scaleOrdinal().range(["#071930", "#03A694", "#F24738", "#851934"]),
    margin: options.margin,
    radiusScale: d3.scaleLinear(),
    circleRadius: 0
  }

  // let pie = d3.pie()
  //   // .sort(null)
  //   .value(function (d) {
  //     return d.value;
  //   });

  // let clusterLayout = d3.customPieLayout()

  let arc = d3.arc().innerRadius(innerRadius);


  const parent = d3.select(parent_selector);

  d3.json(dataPath,function(error, data){
    
    let dataLength = data.length;
    let piesInRow = Math.ceil(Math.sqrt(dataLength));
    let width = chartConfig.width - 100;
    let tempWidth = dataLength > piesInRow?width-0.5*(width/piesInRow):width;
    chartConfig.circleRadius = d3.min([tempWidth,(chartConfig.height-chartConfig.margin.top)])/piesInRow;
    let translateBy = 'translate('+(dataLength > piesInRow?0.5*chartConfig.circleRadius:0)+','+chartConfig.margin.top+')';
    let xOffset = 0, yOffset = 0;

    parent.select("svg").remove();
    let svg = parent.append("svg")
      .attr("width", chartConfig.width + chartConfig.margin.left)
      .attr("height", chartConfig.height + chartConfig.margin.top + chartConfig.margin.bottom)
      .attr("class", "clusterPie");
    
    let pies = svg.append('g').attr('class', 'pies')
      .attr('transform',translateBy);

    let legend = svg.append('g').attr('class', 'legend');

    let pieGraphic = pies.attr('transform',translateBy)
      .selectAll('.pieGraphic')
      .data(data);

    pieGraphic.enter()
      .append('g')
      .attr('class', 'pieGraphic')
      .attr('id', function(d, i) { d.name })
      .attr('transform', function (d, i) {
        return 'translate('+((i%piesInRow)*(chartConfig.circleRadius))+','+(Math.floor(i/piesInRow)*chartConfig.circleRadius)+')';
      })
      .append('circle')
      .attr('r', 5)
      .attr('cx',chartConfig.circleRadius / 2)
      .attr('cy',chartConfig.circleRadius / 2)
      .style('fill','white')
      .style('stroke','black')
      .style('stroke-width','1px');

    d3.selectAll('.pieGraphic').each(RenderPieCharts);
    
    return svg;
  });

  function RenderPieCharts(pieData){
    let pie = d3.pie()
      .value(function(d, i){ return d.ele });

    arc.outerRadius(chartConfig.radiusScale(30) * 0.8);

    let paths = d3.select(this)
      .selectAll('path')
      .data(pie(pieData.values))
      .enter()
      .append('path')
      .attr('transform',function(d, i){
        return 'translate('+(chartConfig.circleRadius/2)+','+(chartConfig.circleRadius/2)+')';
      })
      .attr("fill", function(d){ return chartConfig.colourScale(d.data.type); })
      .attr('d', arc);

  }
}