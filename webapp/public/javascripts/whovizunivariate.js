var width = 1000;
var height = 650;
var dataset;
var tree;
var continentID = ["Middle East","Europe","Africa","North America","South America","Australia","Asia"];
var colors = [""];

// Variable selector
var dropDown = d3.select("#dropDown").append("select")
        .attr("name", "Variables");
        /*.append("option")
        .text("-- select an indicator --")
        .attr("disabled")
        .attr("selected");*/

var names = d3.json("/who/columns", function(error, d){
    if(error){
        console.log(error);
    }
    dropDown.selectAll("option")
        .data(d)
        .enter()
        .append("option")
        .text(function (d) { return d._id; })
        .attr("value", function (d) { return d._id; });
});

// Treemap
var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(false)
    .value(function(d) { return d.value; });

var div = d3.select(".content-map").append("div")
        .attr("class", "YlGnBu")
        .style({
            "float": "left",
            "position": "relative",
            "display" : "block",
            "margin" : "auto"})
        .style("width", (width) + "px")
        .style("height", (height) + "px");

function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy) + "px"; });
}

function buildTree(column, indicator) {
    var tree = { "name" : "root",
                 "children" : []};
    var sub_tree = [];
    for (var continent=0; continent<7; continent++){
        sub_tree[continent] = { "name" : continent+1, "children" : [] };
    }
    for (var i=0; i< dataset.length; i++){
        sub_tree[dataset[i].Continent - 1].children.push({
            "name" : dataset[i].Country,
            "value" : dataset[i][indicator],
            "continent" : dataset[i].Continent });
    }
    tree.children = sub_tree;
    return tree;
}

d3.json("/who", function(error, data) {
    if(error){
        console.log(error);
    }
    indicator="CountryID";
    dataset = data;
    tree = buildTree(data, indicator);
    displayTree(tree);
});

function displayTree(tree){
    var node = div.datum(tree).selectAll(".node")
        .data(treemap.nodes)
        .enter()
        .append("div")
        .call(position)
        .attr("class", function(d) {
            if(d.children) { return "node"; }
            else { return "node q" + d.continent + "-9"; }
        })
        .on("mouseover", function(d){
            d3.select("#continent").text("Continent: " + continentID[d.continent-1]);
            d3.select("#country").text("Country: " + d.name);
            d3.select("#value").text("Value: " + d.value);
        });
}

d3.selectAll("select").on("change", function change(d) {
    var sel = d3.select("select").node().value;
    var newTree = buildTree(dataset, sel);
    var node = div.datum(newTree).selectAll(".node")
            .data(treemap.nodes);
    node.transition()
        .duration(1500)
        .call(position);
    d3.select("#continent").text("Continent: ");
    d3.select("#country").text("Country: ");
    d3.select("#value").text("Value: ");
});
