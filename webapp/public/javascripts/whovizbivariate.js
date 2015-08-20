var width = 1400;
var height = 700;
var dataset;


var svg = d3.select(".content-heatmap").append("svg")
        .attr("width", width).attr("height", height);

var text = svg.selectAll("text")
        .data([{"text": "Variable A: ", "class": "varA"},
               {"text": "Variable B: ", "class": "varB"},
               {"text": "Correlation: ", "class" : "cor"}])
        .enter()
        .append("text")
        .attr("x", 450)
        .attr("y", function(d, i) { return 50 + i*20;})
        .text( function (d) { return d.text; })
        .attr("class", function(d){return d.class;})
        .attr("font-size", "14px")
        .attr("fill", "white");


var gp = d3.select("svg").append("g")
        .attr("width", 300).attr("height", height);

var gn = d3.select("svg").append("g")
        .attr("width", 300).attr("height", height);

var color = d3.scale.linear()
        .domain([-1, -0.5, 0.5, 1])
        .range(["blue", "white", "white", "red"]);

queue()
    .defer(d3.json, "/json/pos_cor.json")
    .defer(d3.json, "/json/neg_cor.json")
    .defer(d3.json, "/who")
    .await(ready);

var resp, resn;
var whods;

function ready(error, pos_cor, neg_cor, who){
    whods = who;
    resp = gp.selectAll("g")
        .data(pos_cor)
        .enter()
        .append("g")
        .attr('transform', function(d, i) {
            return 'translate(0, ' + ((height-6) -(6 * i)) + ')';
        });
    resp.selectAll("rect")
        .data(function(d){return d;})
        .enter()
        .append("rect")
        .attr("x", function(d, j) { return (j*6) ; })
        .attr("width", 5)
        .attr("height", 5)
        .attr("fill", function(d) { return color(d.cor);})
        .on("mouseover", function(d){
            d3.select(".varA").text("Variable A: " + d.var1);
            d3.select(".varB").text("Variable B: " + d.var2);
            d3.select(".cor").text("Correlation: " + d.cor);
        })
        .on("click", function(d) {scaterplot(d);});

    resn = gn.selectAll("g")
        .data(neg_cor)
        .enter()
        .append("g")
        .attr('transform', function(d, i) {
            return 'translate(1100, ' + ((height-6) - (6 * i)) + ')';
        });
    resn.selectAll("rect")
        .data(function(d){return d;})
        .enter()
        .append("rect")
        .attr("x", function(d, j) { return (j*6) ; })
        .attr("width", 5)
        .attr("height", 5)
        .attr("fill", function(d) { return color(d.cor);})
        .on("mouseover", function(d){
            d3.select(".varA").text("Variable A: " + d.var1);
            d3.select(".varB").text("Variable B: " + d.var2);
            d3.select(".cor").text("Correlation: " + d.cor);
        })
        .on("click", function(d) {scaterplot(d);});
}

// scatter plot setup
var margin = {top: 20, right: 15, bottom: 10, left: 60},
    gsw = 600 - margin.left - margin.right,
    gsh = 550 - margin.top - margin.bottom;

var gs = d3.select("svg").append("g")
        .attr("width", gsw).attr("height", gsh)
        .attr("transform", "translate(400,125)");

var padding = 15;

var gsxaxis = gs.append("g").classed("axis", true).classed("xaxis", true)
        .attr("transform", "translate(0, " + (gsh + padding) + ")");

var gsyaxis =  gs.append("g").classed("axis", true).classed("yaxis", true)
        .attr("transform", "translate(0, 0)");

var labelx = gs.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", gsw)
        .attr("y", gsh + 50);

var labely = gs.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("y", 0 - 50)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)");

function scaterplot(d){
    console.log(d.cor);
    var var1 = d.var1;
    var var2 = d.var2;
    var corcol = color(d.cor);
    var datapoints = [];

    for(var i=0; i<whods.length; i++){
        if(whods[i][var1] && whods[i][var2])
            datapoints.push([parseFloat(whods[i][var1]), parseFloat(whods[i][var2])]);
    }

    var maxvar1 = d3.max(datapoints, function(d){
        return d[0];
    });
    var minvar1 = d3.min(datapoints, function(d){
        return d[0];
    });
    var maxvar2 = d3.max(datapoints, function(d){
        return d[1];
    });
    var minvar2 = d3.min(datapoints, function(d){
        return d[1];
    });

    var xScale = d3.scale.linear()
            .domain([minvar1, maxvar1])
            .range([0, gsw]);

    var yScale = d3.scale.linear()
            .domain([minvar2, maxvar2])
            .range([gsh, 0]);

    // draw the x axis
    var xAxis = d3.svg.axis()
	    .scale(xScale)
	    .orient('bottom');

    // draw the y axis
    var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient('left');
    
    var selection = gs.selectAll("circle")
            .data(datapoints);

    gsxaxis.call(xAxis);
    gsyaxis.call(yAxis);

    labelx.text(var1);
    labely.text(var2);

    // UPDATE
    selection.attr("r", 5)
        .attr("cx", function(d){
            return xScale(d[0]);
        })
        .attr("cy", function(d){
            return yScale(d[1]);
        })
        .attr("fill", corcol);

    // ENTER
    selection.enter()
        .append("circle")
        .attr("fill", corcol)
        .attr("r", 5)
        .attr("cx", function(d){
            return xScale(d[0]);
        })
        .attr("cy", function(d){
            return yScale(d[1]);
        });
    
    // ENTER + UPDATE
    selection.attr("r", 5)
        .attr("cx", function(d){
            return xScale(d[0]);
        })
        .attr("cy", function(d){
            return yScale(d[1]);
        })
        .attr("fill", corcol);

    // EXIT
    selection.exit().remove();
}
