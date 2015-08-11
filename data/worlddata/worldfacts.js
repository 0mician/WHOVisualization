// quick script to merge fact files (obtained from https://github.com/samayo/country-data) 
// and output to json  

var fs = require('fs');
var dir = './src/';

var data = {};
var merge = [];
var lookup = {};

// prepares the main object with countries and facts (facts being populated 
// at a later stage
fs.readFile('./countries.json', 'utf8', function(err, c) {
    if(err) throw err;
    var countries = JSON.parse(c);
    for (var i=0; i<countries.length; i++){
        merge.push({ "country" : countries[i]["country"], "facts" : []});
    }
    for (var j = 0, len = merge.length; j < len; j++) {
        lookup[merge[j].country] = merge[j];
    }
});

// reads through all files located in the src directory, populates the main object
// with the facts from those files (done by mergeObjects function)
fs.readdir(dir, function(err, files){
    if(err) throw err;
    var c = 0;
    files.forEach(function(file){
        c++;
        fs.readFile(dir+file,'utf-8',function(err, json){
            if(err) throw err;
            data[file] = JSON.parse(json);
            c--;
            if(c === 0){
                mergeObjects(data);
                fs.writeFile("facts.json", JSON.stringify(merge, null, 4), function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("JSON saved");
                    }
                }); 
            }
        });
    });
});

// populate facts one json file at a time
var mergeObjects = function(data) {
    var keys = [];
    for (var key in data) {
        for(var i=0; i< data[key].length; i++){
            if(lookup[data[key][i]["country"]]){
                lookup[data[key][i]["country"]]["facts"].push(data[key][i]);
            }
        }
    }
    // removes redundant {"country":"name"} information from the "facts" list
    for(var j=0; j<merge.length; j++){
        var poi = merge[j]["facts"];
        for(var l=0; l<poi.length; l++){
            delete poi[l]["country"];
        }
    }
};
