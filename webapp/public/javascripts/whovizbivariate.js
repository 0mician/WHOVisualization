var width = 750;
var height = 750;
var dataset;

// // create the zoom listener
// var zoomListener = d3.behavior.zoom()
//   .scaleExtent([0.1, 3])
//   .on("zoom", zoomHandler);

// // function for handling zoom event
// function zoomHandler() {
//   vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
// }

var svg = d3.select(".content-heatmap").append("svg")
        .attr("width", width).attr("height", height)
        .call(d3.behavior.zoom().on("zoom", function () {
            svg.attr("transform", 
                     "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
        }));

var color = d3.scale.linear()
        .domain([-1, 0, 1])
        .range(["red", "white", "blue"]);

var lines;


d3.text("/datafiles/cor.csv", function(error, d){
    if(error){
        console.log(error);
    }
    dataset = d3.csv.parseRows(d).map(function(row){
               return row.map(function(value) {
            return +value;
        });
    });
    console.log(dataset);
    lines = svg.selectAll("g")
        .data(dataset)
        .enter()
        .append("g")
        .attr('transform', function(d, i) {
            return 'translate(0, ' + (2) * i + ')';
        });

    lines.selectAll("rect")
        .data(function(d, j) { return d; })
        .enter()
        .append("rect")
        .attr("x", function(d, j) { return (j*2) ; })
        .attr("width", 2)
        .attr("height", 2)
        .attr("fill", function(d) { return color(d);});
});
   
//zoomListener(svg);
