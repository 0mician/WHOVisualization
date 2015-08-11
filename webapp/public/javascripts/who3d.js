var width = 500, height = 500;

var projection = d3.geo.orthographic().scale(249).clipAngle(90).translate([250,250]);

var canvas = d3.select("#map").append("canvas")
        .attr("width", width)
        .attr("height", height);

var c = canvas.node().getContext("2d");

var path = d3.geo.path()
        .projection(projection)
        .context(c);

var title = d3.select("h1");


queue()
    .defer(d3.json, "/json/world-110m.json")
    .defer(d3.tsv, "/datafiles/world-country-names.tsv")
    .defer(d3.json, "/json/facts.json")
    .await(ready);

var dropDown;
var names;
var lookup = {};
var lookupfacts = {};

function setupDropdown(d){
    dropDown = d3.select("#dropDown").append("select")
        .attr("name", "Variables");

    console.log(d);
    dropDown.selectAll("option")
        .data(d)
        .enter()
        .append("option")
        .text(function (d) { return d.name; })
        .attr("value", function (d) { return d.name; });
}

function updateInfo(data){
    var info = d3.select("#info").selectAll("p")
            .data(data);
    
    // UPDATE
    info.text(function(d) { return JSON.stringify(d);} );
    
    // ENTER
    info.enter().append("p")
        .text(function(d) { return JSON.stringify(d);});

    // ENTER + UPDATE
    info.text(function(d) { return JSON.stringify(d);});
    
    // EXIT
    info.exit().remove();
}

function ready(error, world, names, facts){
    if (error) throw error;

    var globe = {type: "Sphere"},
        land = topojson.feature(world, world.objects.land),
        countries = topojson.feature(world, world.objects.countries).features,
        borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
        i = -1,
        n = countries.length;

    countries = countries.filter(function(d) {
        return names.some(function(n) {
            if (d.id == n.id) return d.name = n.name;
        });
    }).sort(function(a, b) {
        return a.name.localeCompare(b.name);
    });
    
    for (var j = 0, len = countries.length; j < len; j++) {
        lookup[countries[j].name] = countries[j];
    }
    for (var k = 0, l = facts.length; k < l; k++) {
        lookupfacts[facts[k].country] = facts[k];
    }
    setupDropdown(countries);

    d3.selectAll("select").on("change", function change(d) {
        var sel = d3.select("select").node().value;
        console.log(lookupfacts[sel]);
        updateInfo(lookupfacts[sel].facts);

        d3.transition()
            .duration(2500)
            .tween("rotate", function() {
                var p = d3.geo.centroid(lookup[sel]),
                    r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
                return function(t) {
                    projection.rotate(r(t));
                    c.clearRect(0, 0, width, height);
                    c.fillStyle = "#bbb", c.beginPath(), path(land), c.fill();
                    c.fillStyle = "rgb(25,25,112)", c.beginPath(), path(lookup[sel]), c.fill();
                    c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
                    c.strokeStyle = "#000", c.lineWidth = 1, c.beginPath(), path(globe), c.stroke();
                };
            });
    });
}
