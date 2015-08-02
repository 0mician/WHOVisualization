var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom,
    x = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([0, height]);

var color = d3.scale.category20c();

var dropDown = d3.select("#dropDown").append("select")
        .attr("name", "Variables");

var names = d3.json("/who/columns", function(d){
    dropDown.selectAll("option")
        .data(d)
        .enter()
        .append("option")
        .text(function (d) { return d._id; })
        .attr("value", function (d) { return d._id; });
});

var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(function(d) { return d.size; });

var div = d3.select(".content-map").append("div")
        .attr("class", "YlGnBu")
        .style({
            "position": "relative",
            "display" : "block",
            "margin" : "auto"})
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")
        .style("left", margin.left + "px")
        .style("top", margin.top + "px");

function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy) + "px"; });
}

function getData(filter) {
    var data = json('/who/' + filter);
    console.log(data);
    var root = {
        "name": "flare",
        "children": data
    };
    console.log(root);
}

var iclu = 0;
d3.json("/json/test.json", function(error, data) {
    if(error){
        console.log(error);
    }
    else {
        console.log(data);
        var node = div.datum(data).selectAll(".node")
                .data(treemap.nodes)
                .enter()
                .append("div")
                .call(position)
                .attr("class", function(d) { 
                    var classes = "node";
                    if(d.children){
                        iclu += 1;
                        return classes;
                    }
                    else {
                        return classes + " q" + iclu + "-9";
                    }
                })
                .on("mouseover", function(d){
                    d3.select("#country").text("Country: " + d.name);
                    d3.select("#value").text("Value: " + d.size);
                });
        d3.selectAll("select").on("change", function change() {
            var value = this.value === "count"
                    ? function() { return 1; }
                : function(d) { return d.size; };
            console.log("value changed" + this.value);
            node
                .data(treemap.value(value).nodes)
                .transition()
                .duration(1500)
                .call(position);
        });
        
    }
});

