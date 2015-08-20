var fs = require('fs');
var who;

fs.readFile('./who.txt', 'utf8', function(err, c) {
    if(err) throw err;
    who = JSON.parse(c);
    kmeans_analysis();
});

function kmeans_analysis(){
    // Create the data 2D-array (vectors) describing the data 
    var vectors = new Array();
    var pos = new Array();
    var j = 0;
    for (var i = 0 ; i < who.length ; i++){
        console.log(i);
        if(who[i]['Military_expenditure'] != "" && who[i]['Pump_price_for_gasoline'] != ""){
            vectors[j] = [ who[i]['Military_expenditure'] , who[i]['Pump_price_for_gasoline']];
            pos[j] = i;
            j++;
        }
    }
    console.log(vectors);
    var kmeans = require('node-kmeans');
    kmeans.clusterize(vectors, {k: 4}, function(err,res) {
        if (err) console.error(err);
        else console.log('%o',res);
    });
}
